import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getKnowledgeBase } from "../../../src/lib/knowledge";
import {
  getGlobalPromptAssets,
  getClientPromptAssets,
  getVerticalPromptAssets,
  buildAssistantPrompt,
} from "../../../src/lib/prompt";
import { supabase } from "../../../src/lib/supabase";
import { ACTIVE_CLIENT } from "../../../src/lib/client";
import { brandConfig, chatConfig } from "../../../src/lib/content";

type MessageHistory = { role: "user" | "assistant"; content: string }[];

const CTA_TOKEN = "__SHOW_BOOKING_CTA__";

/** Aura: strict closing patterns (must match assistant-behavior.txt). */
const AURA_APPROVED_CLOSINGS = [
  "If you're deciding between options, I can guide you based on your goals.",
  "If you already know what you want, I can help you get scheduled.",
  "Tell me what you're looking to treat, and I'll point you in the right direction.",
] as const;

/** Aura: soft / drift phrases — trailing sentences containing these are stripped before enforcing closings. */
const AURA_FORBIDDEN_CLOSING_PHRASES = [
  "if you're interested",
  "if you'd like",
  "let me know",
  "i'm here to help",
  "i recommend",
  "we can schedule",
  "help you get scheduled",
  "schedule a consultation",
] as const;

function stripCtaToken(text: string) {
  return text.replace(/__SHOW_BOOKING_CTA__/g, "").trim();
}

/** Collapse spaces/tabs within each line, trim each line’s right side; preserve `\n` and empty lines. */
function normalizeLineWhitespace(text: string): string {
  return text
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").replace(/[ \t]+$/g, ""))
    .join("\n");
}

/**
 * Split at the last `(?<=[.!?])` + whitespace boundary only. Prefix is unchanged so newlines
 * and markdown lists above the tail stay intact.
 */
function splitOffTrailingSentence(text: string): { prefix: string; last: string } {
  let t = text;
  for (;;) {
    const re = /(?<=[.!?])\s+/g;
    let lastSplitEnd = -1;
    let m: RegExpExecArray | null;
    while ((m = re.exec(t)) !== null) {
      lastSplitEnd = m.index + m[0].length;
    }
    if (lastSplitEnd === -1) {
      return { prefix: "", last: t.trim() };
    }
    const last = t.slice(lastSplitEnd).trim();
    if (last !== "") {
      return { prefix: t.slice(0, lastSplitEnd), last };
    }
    t = t.slice(0, lastSplitEnd).replace(/\s+$/g, "");
    if (!t.trim()) {
      return { prefix: "", last: "" };
    }
  }
}

/** Peel weak CTA sentences from the string end only; does not reserialize the main body. */
function stripWeakClosingTail(
  text: string,
  sentenceIsWeak: (s: string) => boolean,
  maxPeels = 50,
): string {
  let current = text;
  for (let i = 0; i < maxPeels; i++) {
    if (!current.trim()) return current;
    const { prefix, last } = splitOffTrailingSentence(current);
    if (!last) break;
    if (!sentenceIsWeak(last)) break;
    current = prefix;
  }
  return current;
}

/**
 * Removes every approved closing pattern from the text, peels weak tail sentences from the
 * end only (preserves lists/paragraphs), normalizes per-line whitespace, then appends exactly
 * `approvedPatterns[0]` once.
 * No-op when `approvedPatterns` is empty.
 */
function enforceApprovedClosing(
  text: string,
  approvedPatterns: readonly string[],
  forbiddenPhrases: readonly string[],
): string {
  if (approvedPatterns.length === 0) return text;

  let cleaned = text;
  for (const pattern of approvedPatterns) {
    cleaned = cleaned.split(pattern).join("");
  }
  cleaned = normalizeLineWhitespace(cleaned).trim();
  cleaned = cleaned.replace(/\s*([,;:])+\s*$/g, "");
  cleaned = normalizeLineWhitespace(cleaned).trim();

  const lowerForbidden = forbiddenPhrases.map((p) => p.toLowerCase());
  const sentenceIsWeak = (sentence: string) =>
    lowerForbidden.some((phrase) => sentence.toLowerCase().includes(phrase));

  let body = stripWeakClosingTail(cleaned, sentenceIsWeak);
  body = normalizeLineWhitespace(body).trim();
  body = body.replace(/\s*([,;:])+\s*$/g, "");
  body = normalizeLineWhitespace(body).trim();

  const closing = approvedPatterns[0];
  if (!body) return closing;
  return normalizeLineWhitespace(`${body}\n\n${closing}`).trim();
}

/** Split-buffer streaming: never emit a suffix that could be an incomplete CTA token. */
function takeStreamablePrefix(buffer: string): { emit: string; hold: string } {
  let cleaned = buffer.replace(/__SHOW_BOOKING_CTA__/g, "");
  const maxHold = CTA_TOKEN.length - 1;
  for (let n = Math.min(maxHold, cleaned.length); n > 0; n--) {
    const tail = cleaned.slice(-n);
    if (CTA_TOKEN.startsWith(tail)) {
      return { emit: cleaned.slice(0, -n), hold: tail };
    }
  }
  return { emit: cleaned, hold: "" };
}

export async function POST(request: Request) {
  console.log("[assistant] POST /api/assistant received");

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    console.error("[assistant] OPENAI_API_KEY is missing");
    return NextResponse.json(
      { error: "Server configuration error: OPENAI_API_KEY is not set." },
      { status: 500 },
    );
  }

  let body: { message?: string; history?: MessageHistory; sessionId?: string };
  try {
    body = await request.json();
  } catch {
    console.warn("[assistant] Invalid JSON body");
    return NextResponse.json(
      { error: "Invalid request: body must be valid JSON." },
      { status: 400 },
    );
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    console.warn("[assistant] Missing or empty message");
    return NextResponse.json(
      { error: "Missing required field: message (non-empty string)." },
      { status: 400 },
    );
  }

  const history: MessageHistory = Array.isArray(body.history) ? body.history : [];

  const openai = new OpenAI({ apiKey });

  const knowledge = getKnowledgeBase(ACTIVE_CLIENT);
  const { behavior: globalBehavior } = getGlobalPromptAssets();
  const { behavior, examples, vertical } = getClientPromptAssets(ACTIVE_CLIENT);
  const { behavior: verticalBehavior } = getVerticalPromptAssets(vertical);
  const systemPrompt = buildAssistantPrompt({
    brandConfig,
    chatConfig,
    knowledge,
    globalBehavior,
    verticalBehavior,
    behavior,
    examples,
    bookingHref: brandConfig.brand.ctas.book.href,
    vertical,
  });

  const hasUserIntent = /\b(book|schedule|let'?s? do ?it|lets?doit|let'?s go|i want to book|i'?m ready|what'?s next|whats next|how do i start|get started|sign me up|i want to proceed|i want to do it)\b/i.test(message);

  const model = hasUserIntent ? "gpt-4o" : "gpt-4o-mini";

  try {
    const stream = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-6),
        { role: "user", content: message },
      ],
      max_tokens: 250,
      stream: true,
    });

    const encoder = new TextEncoder();
    let fullReply = "";
    const bufferAuraForClosingEnforcement =
      ACTIVE_CLIENT === "aura-skin-laser";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          let rawAccumulated = "";
          let streamHold = "";
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content ?? "";
            if (delta) {
              rawAccumulated += delta;
              const { emit, hold } = takeStreamablePrefix(streamHold + delta);
              streamHold = hold;
              if (emit) {
                fullReply += emit;
                if (!bufferAuraForClosingEnforcement) {
                  controller.enqueue(encoder.encode(emit));
                }
              }
            }
          }
          let tail = streamHold;
          if (
            tail &&
            CTA_TOKEN.startsWith(tail) &&
            tail.length < CTA_TOKEN.length
          ) {
            tail = "";
          }
          const finalFlush = stripCtaToken(tail);
          if (finalFlush) {
            fullReply += finalFlush;
            if (!bufferAuraForClosingEnforcement) {
              controller.enqueue(encoder.encode(finalFlush));
            }
          }

          // Post-processing after stream completes
          fullReply = stripCtaToken(fullReply);

          const showBookingCta = rawAccumulated.includes("__SHOW_BOOKING_CTA__");

          if (
            bufferAuraForClosingEnforcement &&
            !showBookingCta &&
            fullReply.trim() !== ""
          ) {
            fullReply = enforceApprovedClosing(
              fullReply,
              AURA_APPROVED_CLOSINGS,
              AURA_FORBIDDEN_CLOSING_PHRASES,
            );
          }

          if (bufferAuraForClosingEnforcement) {
            controller.enqueue(encoder.encode(fullReply));
          }

          // Supabase logging
          try {
            const sessionId =
              typeof body.sessionId === "string" ? body.sessionId : null;
            await supabase.from("conversations").insert([
              {
                session_id: sessionId,
                role: "user",
                message: message,
                client_id: ACTIVE_CLIENT,
                page_url: request.headers.get("referer") || null,
                referrer: request.headers.get("referer") || null,
                user_agent: request.headers.get("user-agent") || null,
              },
              {
                session_id: sessionId,
                role: "assistant",
                message: fullReply,
                client_id: ACTIVE_CLIENT,
                page_url: request.headers.get("referer") || null,
                referrer: request.headers.get("referer") || null,
                user_agent: request.headers.get("user-agent") || null,
              },
            ]);
          } catch (err) {
            console.error("[assistant] Supabase logging failed:", err);
          }

          console.log("[assistant] Success, reply length:", fullReply.length);

          // Send metadata as a final chunk so the client knows showBookingCta
          controller.enqueue(
            encoder.encode(`__META__${JSON.stringify({ showBookingCta })}`),
          );
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("[assistant] OpenAI request failed:", err);
    const errMsg =
      err instanceof Error ? err.message : "Unknown error calling OpenAI.";
    return NextResponse.json(
      { error: `Assistant unavailable: ${errMsg}` },
      { status: 502 },
    );
  }
}
