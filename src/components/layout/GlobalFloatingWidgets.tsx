"use client";

import { usePathname } from "next/navigation";
import ChatWidget from "../ai/ChatWidget";
import StickyMobileCTA from "../mobile/StickyMobileCTA";

/**
 * Chat + sticky mobile bar on marketing pages only — hidden on /book so the form stays unobstructed.
 */
export function GlobalFloatingWidgets() {
  const pathname = usePathname();
  if (pathname === "/book") return null;

  return (
    <>
      <ChatWidget />
      <StickyMobileCTA />
    </>
  );
}
