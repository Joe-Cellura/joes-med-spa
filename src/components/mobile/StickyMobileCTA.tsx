"use client";

import { brandConfig, chatConfig, homepageConfig } from "../../lib/content";
import { toTelHref } from "../../lib/utils";
import { cn } from "../../lib/utils";

export function StickyMobileCTA() {
  const { brand } = brandConfig;
  const chat = chatConfig;
  const sticky = homepageConfig.sections.stickyMobileCta;

  if (!sticky.enabled) return null;

  const handleChatClick = () => {
    window.dispatchEvent(new Event("open-lumina-chat"));
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-2 shadow-[0_-4px_16px_rgba(15,23,42,0.08)] sm:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
        {sticky.items.map((item) => {
          if (item.type === "call") {
            return (
              <a
                key={item.type}
                href={toTelHref(brand.contact.phone)}
                className={cn(
                  "flex-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-center text-xs font-medium text-slate-800",
                )}
              >
                {item.label}
              </a>
            );
          }
          if (item.type === "book") {
            return (
              <a
                key={item.type}
                href="/book"
                className="flex-1 rounded-full bg-teal-600 px-3 py-2 text-center text-xs font-medium text-white"
              >
                {item.label}
              </a>
            );
          }
          if (item.type === "chat") {
            return (
              <button
                key={item.type}
                type="button"
                onClick={handleChatClick}
                className="flex-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-center text-xs font-medium text-slate-800"
              >
                {chat.triggerLabel}
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

