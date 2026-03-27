import fs from "fs";
import path from "path";
import type { BrandConfig, ChatConfig } from "./types";

const PROMPT_ROOT = path.join(process.cwd(), "src", "lib", "prompt");
const GLOBAL_DIR = path.join(PROMPT_ROOT, "global");
const VERTICALS_DIR = path.join(PROMPT_ROOT, "verticals");
const PROMPT_CLIENTS_DIR = path.join(PROMPT_ROOT, "clients");

export type AssistantVertical = "medspa" | "concierge";

export interface ClientPromptAssets {
  behavior: string | null;
  examples: string | null;
  vertical: AssistantVertical;
}

export interface ClientBusinessInfo {
  vertical?: AssistantVertical;
  displayName?: string;
  _placeholder?: boolean;
  _note?: string;
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

function readVerticalFromBusinessInfo(clientId: string): AssistantVertical {
  const infoPath = path.join(PROMPT_CLIENTS_DIR, clientId, "business-info.json");
  try {
    const raw = fs.readFileSync(infoPath, "utf8");
    const info = JSON.parse(raw) as ClientBusinessInfo;
    if (info.vertical === "concierge") return "concierge";
  } catch {
    // missing or invalid — default medspa for backward compatibility
  }
  return "medspa";
}

export function getClientVertical(clientId: string): AssistantVertical {
  return readVerticalFromBusinessInfo(clientId);
}

export function getGlobalPromptAssets(): { behavior: string | null } {
  return {
    behavior: readPromptAsset(
      path.join(GLOBAL_DIR, "assistant-base-behavior.txt"),
    ),
  };
}

export function getVerticalPromptAssets(
  vertical: AssistantVertical,
): { behavior: string | null } {
  return {
    behavior: readPromptAsset(
      path.join(VERTICALS_DIR, vertical, "assistant-behavior.txt"),
    ),
  };
}

export function getClientPromptAssets(clientId: string): ClientPromptAssets {
  const clientDir = path.join(PROMPT_CLIENTS_DIR, clientId);
  const vertical = readVerticalFromBusinessInfo(clientId);
  return {
    behavior: readPromptAsset(path.join(clientDir, "assistant-behavior.txt")),
    examples: readPromptAsset(
      path.join(clientDir, "example-conversations.txt"),
    ),
    vertical,
  };
}

export function buildAssistantPrompt({
  brandConfig,
  chatConfig,
  knowledge,
  globalBehavior,
  verticalBehavior,
  behavior,
  examples,
  bookingHref,
  vertical,
}: {
  brandConfig: BrandConfig;
  chatConfig: ChatConfig;
  knowledge: string;
  globalBehavior: string | null;
  verticalBehavior: string | null;
  behavior: string | null;
  examples: string | null;
  bookingHref: string;
  vertical: AssistantVertical;
}): string {
  const brandName = brandConfig.brand.name;
  const location = brandConfig.brand.location.display;
  const assistantName = chatConfig.panelTitle;
  const verticalLabel =
    vertical === "concierge" ? "CONCIERGE" : "MEDSPA / AESTHETICS";

  const framing = `[SYSTEM FRAMING]
You are ${assistantName}, representing ${brandName} (${location}).
Primary action URL for this client (booking, inquiry, or contact — use per vertical and client rules): ${bookingHref}`;

  const knowledgeBlock = `[KNOWLEDGE]
${knowledge}`;

  const sections: string[] = [framing, knowledgeBlock];

  if (globalBehavior) {
    sections.push(`[GLOBAL RULES]\n${globalBehavior}`);
  }

  if (verticalBehavior) {
    sections.push(
      `[VERTICAL RULES — ${verticalLabel}]\n${verticalBehavior}`,
    );
  }

  if (behavior) {
    sections.push(`[CLIENT RULES]\n${behavior}`);
  }

  if (examples) {
    sections.push(
      `[EXAMPLES]\nUse as stylistic reference — do not copy verbatim unless highly relevant.\n\n${examples}`,
    );
  }

  return sections.join("\n\n");
}
