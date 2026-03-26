import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getKnowledgeBase } from "../../../src/lib/knowledge";
import { getGlobalPromptAssets, getClientPromptAssets, buildAssistantPrompt } from "../../../src/lib/prompt";
import { supabase } from "../../../src/lib/supabase";
import { ACTIVE_CLIENT } from "../../../src/lib/client";
import { brandConfig, chatConfig } from "../../../src/lib/content";

type MessageHistory = { role: "user" | "assistant"; content: string }[];

const CTA_TOKEN = "__SHOW_BOOKING_CTA__";

function stripCtaToken(text: string) {
  return text.replace(/__SHOW_BOOKING_CTA__/g, "").trim();
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
  const { behavior, examples } = getClientPromptAssets(ACTIVE_CLIENT);
  const systemPrompt = buildAssistantPrompt({
    brandConfig,
    chatConfig,
    knowledge,
    globalBehavior,
    behavior,
    examples,
    bookingHref: brandConfig.brand.ctas.book.href,
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
                controller.enqueue(encoder.encode(emit));
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
            controller.enqueue(encoder.encode(finalFlush));
          }

          // Post-processing after stream completes
          fullReply = stripCtaToken(fullReply);

          const showBookingCta = rawAccumulated.includes("__SHOW_BOOKING_CTA__");

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
