import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getKnowledgeBase } from "../../../src/lib/knowledge";

type MessageHistory = { role: "user" | "assistant"; content: string }[];

export async function POST(request: Request) {
  console.log("[lumina-ai] POST /api/lumina-ai received");

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    console.error("[lumina-ai] OPENAI_API_KEY is missing");
    return NextResponse.json(
      { error: "Server configuration error: OPENAI_API_KEY is not set." },
      { status: 500 },
    );
  }

  let body: { message?: string; history?: MessageHistory };
  try {
    body = await request.json();
  } catch {
    console.warn("[lumina-ai] Invalid JSON body");
    return NextResponse.json(
      { error: "Invalid request: body must be valid JSON." },
      { status: 400 },
    );
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    console.warn("[lumina-ai] Missing or empty message");
    return NextResponse.json(
      { error: "Missing required field: message (non-empty string)." },
      { status: 400 },
    );
  }

  const history: MessageHistory = Array.isArray(body.history) ? body.history : [];

  const openai = new OpenAI({ apiKey });
  const knowledge = getKnowledgeBase();

  const systemPrompt = `You are Lumina AI, a friendly and knowledgeable concierge for Lumina Aesthetics, a luxury medical aesthetics clinic in Raleigh, North Carolina.

You have access to detailed knowledge about the clinic. Use it to answer questions accurately. If something is not covered in the knowledge base, say so honestly and suggest booking a consultation.

CLINIC KNOWLEDGE BASE:
${knowledge}

RULES:
- Never diagnose medical conditions
- Never provide unsafe medical advice
- Never guarantee results
- Keep responses SHORT — 2 to 4 sentences for simple questions
- For multi-part questions, use at most 3 to 4 bullet points, never numbered lists
- Sound like a warm, knowledgeable human concierge — not a medical document
- Only suggest booking a consultation once per conversation, and only when it is genuinely relevant — for example when someone asks about pricing for their specific situation, is clearly ready to book, or has a question that truly requires an in-person assessment
- Never end a response with a consultation suggestion if you already suggested one earlier in the conversation
- Never suggest a consultation in response to a general educational question
- If the knowledge base covers the topic, answer directly and concisely
- Prioritize being useful over being comprehensive`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-10),
        { role: "user", content: message },
      ],
      max_tokens: 512,
    });

    const choice = completion.choices[0];
    const reply =
      choice?.message?.content?.trim() ??
      "I’m sorry, I couldn’t generate a response. Please try again or book a consultation so we can help you in person.";

    console.log("[lumina-ai] Success, reply length:", reply.length);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[lumina-ai] OpenAI request failed:", err);
    const message =
      err instanceof Error ? err.message : "Unknown error calling OpenAI.";
    return NextResponse.json(
      { error: `Assistant unavailable: ${message}` },
      { status: 502 },
    );
  }
}
