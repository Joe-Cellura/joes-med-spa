import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getKnowledgeBase } from "../../../src/lib/knowledge";
import { getGlobalPromptAssets, getClientPromptAssets, buildAssistantPrompt } from "../../../src/lib/prompt";
import { supabase } from "../../../src/lib/supabase";
import { ACTIVE_CLIENT } from "../../../src/lib/client";
import { brandConfig, chatConfig } from "../../../src/lib/content";

type MessageHistory = { role: "user" | "assistant"; content: string }[];

export async function POST(request: Request) {
  console.log("[assistant] POST /api/lumina-ai received");

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

  // Explicit booking intent from the user — always triggers regardless of conversation context
  const explicitBookingPhrases = [
    "i want to book",
    "i'd like to book",
    "id like to book",
    "i want to schedule",
    "i'd like to schedule",
    "id like to schedule",
    "how do i book",
    "how do i schedule",
    "can i book",
    "can i schedule",
    "i want to come in",
    "i'd like to come in",
    "id like to come in",
    "i'm ready to book",
    "im ready to book",
    "i want to make an appointment",
    "i'd like to make an appointment",
    "ready to book",
    "ready to schedule",
    "book an appointment",
    "book online",
    "i want to book online",
    "make an appointment",
    "yes lets do it",
    "yes let's do it",
    "yes i do",
    "yes please",
    "lets do it",
    "let's do it",
    "yes book",
    "go ahead and book",
    "yes i'd like to",
    "yes id like to",
    "let's go ahead",
    "lets go ahead",
    "yes go ahead",
    "lets book",
    "let's book",
    "lets book a consultation",
    "let's book a consultation",
    "book a consultation",
    "book now",
    "schedule now",
    "can we book",
    "can we schedule",
    "please do",
  ];

  // Soft affirmations — only count as booking intent when the previous assistant
  // message was already in booking mode (prevents firing on general conversation)
  const contextualConfirmPhrases = [
    "sounds good",
    "alright",
    "sure",
    "that works",
    "lets go",
    "let's go",
    "go ahead",
  ];

  // Single-word confirmations — only count when previous assistant was in booking mode
  const singleWordConfirms = ["yes", "ok", "okay", "yep", "yeah", "yup"];

  const bookingReplyPhrases = [
    // Book Online CTA–aligned handoffs (preferred model)
    "book online here",
    "book online",
    "whenever you're ready",
    "when you're ready, you can",
    "you can go ahead and book",
    "choose a time that works",
    "choose a time here",
    "choose a time",
    "pick a time",
    "schedule your visit",
    "get you set up right here",
    "map out what will work best",
    "map out what works best",
    // Formal / explicit booking phrases (legacy detection / user phrasing)
    "schedule a consultation",
    "book a consultation",
    "book an appointment",
    "come in for a visit",
    "grab a time",
    "choose a time",
    "works for you right here",
    "booking page",
    "book your",
    "schedule your",
    "booking a consultation is",
    "schedule a visit",
    "book your consultation",
    "booking a visit",
    "set up a consultation",
    "arrange a consultation",
    "come in for a consultation",
    "we can schedule",
    "we can book",
    "a consultation is a great way",
    "a consultation would be",
    "scheduling a consultation",
    "get you set up",
    "i'll get you set up",
    "can i get that booked",
    "get that booked for you",
    "would you like to get that booked",
    // Natural-language patterns (specific enough to avoid false positives)
    "get that set up",
    "get this set up",
    "let's get you",
    "get you scheduled",
    "get that scheduled",
    "get you booked",
    "pull up a time",
    "pull up availability",
    "take a look at availability",
    "set that up for you",
    "set it up for you",
    "get it set up",
  ];

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-10),
        { role: "user", content: message },
      ],
      max_tokens: 512,
      stream: true,
    });

    const encoder = new TextEncoder();
    let fullReply = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content ?? "";
            if (delta) {
              fullReply += delta;
              controller.enqueue(encoder.encode(delta));
            }
          }

          // Post-processing after stream completes
          const lowerUser = message.toLowerCase();
          const lowerReply = fullReply.toLowerCase();

          // Check whether the previous assistant turn was already in booking mode.
          // This gates contextual and single-word triggers so they don't fire
          // on general conversational messages (e.g. "sure, tell me more").
          const lastAssistantMsg = [...history].reverse().find((m) => m.role === "assistant");
          const lastAssistantText = lastAssistantMsg?.content.toLowerCase() ?? "";
          const lastAssistantWasBooking = bookingReplyPhrases.some((p) =>
            lastAssistantText.includes(p),
          );

          // Always-explicit user intent (context-independent)
          const userIntent = explicitBookingPhrases.some((p) => lowerUser.includes(p));

          // Soft affirmations only count when last assistant was already in booking mode
          const contextualIntent =
            lastAssistantWasBooking &&
            contextualConfirmPhrases.some((p) => lowerUser.includes(p));

          // Bare single-word confirmations — compare the full normalized message
          // so "yes" doesn't match inside "I'm not sure yet"
          const normalizedUser = lowerUser.replace(/[^a-z]/g, "");
          const isShortConfirm =
            lastAssistantWasBooking && singleWordConfirms.includes(normalizedUser);

          // Assistant reply contains booking intent
          const replyIntent = bookingReplyPhrases.some((p) => lowerReply.includes(p));

          const showBookingCta = userIntent || contextualIntent || isShortConfirm || replyIntent;

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
