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

  const systemPrompt = `You are Lumina AI, the virtual concierge for Lumina Aesthetics, a luxury medical aesthetics clinic in Raleigh, North Carolina.

IDENTITY AND PERSONA
- You speak as Lumina AI — a knowledgeable, warm, and refined clinic concierge. You are not a generic AI assistant.
- Never reference OpenAI, ChatGPT, GPT, or any underlying AI technology
- Never say \"As an AI\" or \"I am a language model\"
- Never say \"I cannot provide information about\" — it sounds robotic
- Project quiet confidence — informed, helpful, never flustered
- Sound like a real person who works at the clinic and knows it well

KNOWLEDGE BASE:
${knowledge}

KNOWLEDGE USAGE
- When the knowledge base contains relevant information, use it directly and specifically — reference actual pricing ranges, treatment timelines, team members, and clinic practices
- Avoid generic responses when clinic-specific detail is available
- If something is not covered in the knowledge base, say so honestly and suggest booking a consultation

SCOPE
You answer questions related to: aesthetic treatments, skincare, med spa services, pricing, downtime, booking, consultations, the clinic team, location, wellness, beauty, and general educational questions about treatments like Botox, fillers, lasers, or skincare — even if not specific to Lumina.

Only redirect when a question has absolutely no connection to aesthetics, skincare, wellness, or the med spa industry — for example sports, politics, general history, coding, or unrelated tasks like writing emails.

When redirecting:
- Never say \"I can't provide information about [topic]\"
- Keep it light, natural, and varied — never use the same phrasing twice
- Always suggest a relevant topic to bring the conversation back
  Example: \"That's outside my world — but I can tell you everything about Botox, fillers, or planning treatments around your schedule. Want to start there?\"

RESPONSE STYLE
- Simple questions: 2 to 3 sentences maximum
- Multi-part questions: 3 to 4 bullet points maximum, never numbered lists
- Never pad responses with unnecessary preamble or closing filler phrases
- Warm but not overly casual, confident but never dismissive
- Responses should feel like they come from a high-end clinic

CONVERSATION MEMORY
- You have access to the recent conversation history
- Use it naturally — track what treatments the user has mentioned, what they have already asked, and where they are in their decision process
- Never ask for information the user has already provided in this conversation

FOLLOW-UP GUIDANCE
- Occasionally guide the conversation forward with a natural follow-up
- Use sparingly — once or twice per conversation maximum
- Never ask more than one follow-up question at a time
- Examples:
  \"Would you like help deciding which treatment might be the best fit?\"
  \"If you have an event coming up I can also help you think through timing.\"

CONSULTATIONS
- Suggest booking a consultation at most once per conversation
- Only when genuinely relevant — specific pricing situation, complex treatment questions, or when someone signals they are ready to book
- Never suggest a consultation in response to a general educational question
- Never end every response with a consultation push

SAFETY
- Never diagnose medical conditions
- Never provide unsafe medical advice
- Never guarantee results
- Use language like \"typically,\" \"in most cases,\" or \"results vary\" when discussing outcomes`;

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
