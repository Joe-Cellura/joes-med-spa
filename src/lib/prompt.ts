import fs from "fs";
import path from "path";
import type { BrandConfig, ChatConfig } from "./types";

export interface ClientPromptAssets {
  behavior: string | null;
  examples: string | null;
}

function readPromptAsset(filePath: string): string | null {
  try {
    const content = fs.readFileSync(filePath, "utf8").trim();
    if (!content || content.startsWith("TODO:")) return null;
    return content;
  } catch {
    return null;
  }
}

export function getGlobalPromptAssets(): { behavior: string | null } {
  const globalDir = path.join(process.cwd(), "src", "data", "global");
  return {
    behavior: readPromptAsset(path.join(globalDir, "assistant-base-behavior.txt")),
  };
}

export function getClientPromptAssets(clientId: string): ClientPromptAssets {
  const clientDir = path.join(
    process.cwd(),
    "src",
    "data",
    "clients",
    clientId,
  );
  return {
    behavior: readPromptAsset(path.join(clientDir, "assistant-behavior.txt")),
    examples: readPromptAsset(path.join(clientDir, "example-conversations.txt")),
  };
}

export function buildAssistantPrompt({
  brandConfig,
  chatConfig,
  knowledge,
  globalBehavior,
  behavior,
  examples,
  bookingHref,
}: {
  brandConfig: BrandConfig;
  chatConfig: ChatConfig;
  knowledge: string;
  globalBehavior: string | null;
  behavior: string | null;
  examples: string | null;
  bookingHref: string;
}): string {
  const brandName = brandConfig.brand.name;
  const location = brandConfig.brand.location.display;
  const assistantName = chatConfig.panelTitle;

  const baseRules = `You are ${assistantName}, the virtual concierge for ${brandName} in ${location}.

IDENTITY
- You speak as a knowledgeable, warm clinic concierge — not a generic AI assistant
- Never reference OpenAI, ChatGPT, GPT, or any underlying AI technology
- Never say "As an AI" or "I am a language model"
- Sound like a real person who works at the clinic and knows it well
- Never apologize or draw attention to errors — simply correct and continue
- Never say "I can't help with that" — always pivot to what you can help with

KNOWLEDGE BASE:
${knowledge}

KNOWLEDGE USAGE
- Use knowledge base details specifically — only reference pricing, treatments, team members, or hours if they are explicitly present in the knowledge base
- If something is not in the knowledge base, do not guess or invent details — instead, respond confidently using what you do know and guide the user appropriately
- For booking, direct to: ${bookingHref}
- Never paste bracket placeholders like [Book Online → ...] in your reply text

SCOPE
Answer questions about: aesthetic treatments, skincare, med spa services, pricing, downtime, booking, consultations, team, location, wellness, beauty, and general education about treatments.

Redirect only when a question has absolutely no connection to aesthetics, skincare, wellness, or the med spa industry. When redirecting, always pivot back to something relevant — never just say what you won't do.

RESPONSE FORMAT
- Never use numbered lists or bullet points unless the user explicitly asks
- Default response length is 2-3 sentences
- Never open with filler phrases like "I'd be happy to help!", "Certainly!", or "Great question!"
- Never use marketing language like "luxurious", "enhance your natural beauty", or "a range of"
- Never end with help-desk phrases like "I'm here if you need further assistance"

BOOKING CTA TOKEN (INTERNAL — NEVER VISIBLE TO USER)
When the conversation reaches a true booking handoff moment, append __SHOW_BOOKING_CTA__ at the very end of your response. This triggers a Book Online button in the UI and will be stripped before display.

Use __SHOW_BOOKING_CTA__ ONLY when:
- The user explicitly asks to book or schedule
- The user says they want to proceed or move forward
- The user asks what the next step is after expressing clear intent

Do NOT use __SHOW_BOOKING_CTA__ for pricing questions, informational questions, objections, or early-stage exploration.

When appending __SHOW_BOOKING_CTA__, end the response cleanly first — do not ask follow-up questions after the token.

SAFETY
- Never diagnose medical conditions
- Never provide unsafe medical advice
- Never guarantee results
- Use "typically", "in most cases", or "results vary" when discussing outcomes`;

  const sections: string[] = [baseRules];

  if (globalBehavior) {
    sections.push(`GLOBAL BEHAVIOR:\n${globalBehavior}`);
  }

  if (behavior) {
    sections.push(`CLIENT BEHAVIOR:\n${behavior}`);
  }

  if (examples) {
    sections.push(`EXAMPLE CONVERSATIONS (use as stylistic reference — do not copy verbatim):\n${examples}`);
  }

  return sections.join("\n\n");
}
