"use client";

import { useEffect, useState } from "react";
import { brandConfig, chatConfig, homepageConfig } from "../../lib/content";
import { toTelHref } from "../../lib/utils";
import { cn } from "../../lib/utils";

const MOBILE_BAR_SECONDARY =
  "flex min-h-[44px] min-w-0 flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-2 py-2.5 text-center text-xs font-medium text-slate-800 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 whitespace-nowrap";

const MOBILE_BAR_CHAT_PRIMARY =
  "flex min-h-[44px] min-w-0 flex-1 items-center justify-center rounded-full bg-teal-600 px-2 py-2.5 text-center text-xs font-medium text-white shadow-sm transition-colors hover:bg-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 whitespace-nowrap";

const MOBILE_CHAT_LABEL = "Chat now";

export function StickyMobileCTA() {
  const { brand } = brandConfig;
  const chat = chatConfig;
  const sticky = homepageConfig.sections.stickyMobileCta;
  const [assistantOpen, setAssistantOpen] = useState(false);

  useEffect(() => {
    const onState = (e: Event) => {
      const detail = (e as CustomEvent<{ open?: boolean }>).detail;
      if (typeof detail?.open === "boolean") {
        setAssistantOpen(detail.open);
      }
    };
    window.addEventListener("assistant-widget-state", onState);
    return () => window.removeEventListener("assistant-widget-state", onState);
  }, []);

  if (!sticky.enabled) return null;

  const handleChatClick = () => {
    if (assistantOpen) return;
    window.dispatchEvent(new CustomEvent("open-chat-widget"));
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[190] border-t border-slate-200 bg-white/95 px-3 py-2.5 shadow-[0_-4px_16px_rgba(15,23,42,0.08)] sm:hidden">
      <div className="mx-auto flex max-w-6xl items-stretch justify-center gap-2">
        {sticky.items.map((item) => {
          if (item.type === "call") {
            return (
              <a
                key={item.type}
                href={toTelHref(brand.contact.phone)}
                className={MOBILE_BAR_SECONDARY}
              >
                {item.label}
              </a>
            );
          }
          if (item.type === "book") {
            return (
              <a key={item.type} href={item.href} className={MOBILE_BAR_SECONDARY}>
                {item.label}
              </a>
            );
          }
          if (item.type === "chat") {
            if (!chat.enabled) return null;
            return (
              <button
                key={item.type}
                type="button"
                onClick={handleChatClick}
                disabled={assistantOpen}
                aria-disabled={assistantOpen}
                className={cn(
                  MOBILE_BAR_CHAT_PRIMARY,
                  assistantOpen &&
                    "pointer-events-none opacity-40 hover:bg-teal-600",
                )}
              >
                {MOBILE_CHAT_LABEL}
              </button>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

export default StickyMobileCTA;

