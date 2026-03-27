"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { bookingHref, chatConfig } from "../../lib/content";
import Button from "../ui/Button";
import { AppLink } from "../ui/AppLink";
import { cn } from "../../lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  showBookingCta?: boolean;
};

export function ChatWidget() {
  const config = chatConfig;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionId = useRef<string>(
    `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
  );

  useEffect(() => {
    if (!config.enabled) return;
    const handler = () => setOpen(true);
    window.addEventListener("open-chat-widget", handler);
    return () => window.removeEventListener("open-chat-widget", handler);
  }, [config.enabled]);

  useEffect(() => {
    if (!open || messages.length > 0) return;
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        text: config.welcomeMessage,
      },
    ]);
  }, [open, messages.length, config.welcomeMessage]);

  useEffect(() => {
    if (!config.enabled) return;
    window.dispatchEvent(
      new CustomEvent("assistant-widget-state", { detail: { open } }),
    );
  }, [open, config.enabled]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (userText: string) => {
      const trimmed = userText.trim();
      if (!trimmed || loading) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        text: trimmed,
      };

      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.role,
          content: m.text,
        }));

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setLoading(true);

      const assistantId = `assistant-${Date.now()}`;

      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            history,
            sessionId: sessionId.current,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          const errorText =
            typeof data?.error === "string"
              ? data.error
              : "Something went wrong. Please try again.";
          setMessages((prev) => [
            ...prev,
            { id: `err-${Date.now()}`, role: "assistant", text: errorText },
          ]);
          return;
        }

        // Add empty assistant message; hide "Thinking…" as streaming begins
        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", text: "", showBookingCta: false },
        ]);
        setLoading(false);

        setIsStreaming(true);
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        const hasCtaText = (raw: string) =>
          /\[Book Online\s*→[^\]]+\]/i.test(raw);

        // Display cleanup: hide complete bracket lines and any in-progress `[Book Online…` tail during streaming
        const stripCtaText = (raw: string) => {
          const partialIdx = raw.search(/\[Book Online/i);
          if (partialIdx !== -1) {
            return raw.slice(0, partialIdx).trimEnd();
          }
          return raw.replace(/\[Book[^\]]*\]/gi, "").trimEnd();
        };

        let bookingShownLogged = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          accumulated += decoder.decode(value, { stream: true });

          const metaIndex = accumulated.indexOf("__META__");

          if (metaIndex >= 0) {
            // Split: everything before __META__ is text, everything after is JSON
            const textPart = stripCtaText(accumulated.slice(0, metaIndex));
            const metaPart = accumulated.slice(metaIndex + "__META__".length);

            let showBookingCta = hasCtaText(accumulated);
            try {
              const meta = JSON.parse(metaPart) as {
                showBookingCta?: boolean;
              };
              if (meta.showBookingCta === true) {
                showBookingCta = true;
              }
            } catch {
              // Invalid or partial JSON — still honor visible CTA line if present
            }

            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, text: textPart, showBookingCta }
                  : m,
              ),
            );

            if (showBookingCta && !bookingShownLogged) {
              logBookingShown();
              bookingShownLogged = true;
            }
          } else {
            // Pure text chunk — strip CTA line for display; flag button if bracket line is present
            const currentText = stripCtaText(accumulated);
            const ctaFromText = hasCtaText(accumulated);
            setMessages((prev) =>
              prev.map((m) => {
                if (m.id !== assistantId) return m;
                return {
                  ...m,
                  text: currentText,
                  showBookingCta: ctaFromText ? true : m.showBookingCta,
                };
              }),
            );
            if (ctaFromText && !bookingShownLogged) {
              logBookingShown();
              bookingShownLogged = true;
            }
          }
        }
        setIsStreaming(false);
      } catch {
        setIsStreaming(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            text: "Unable to reach the assistant. Please check your connection and try again.",
          },
        ]);
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [loading, messages],
  );

  const logBookingShown = async () => {
    try {
      await fetch("/api/log-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId.current,
          type: "book_cta_shown",
          metadata: { trigger: "chat_widget" },
          pageUrl: window.location.href,
        }),
      });
    } catch {
      // silent fail
    }
  };

  const logBookingClick = async () => {
    try {
      await fetch("/api/log-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId.current,
          type: "book_cta_clicked",
          metadata: { trigger: "chat_widget" },
          pageUrl: window.location.href,
        }),
      });
    } catch {
      // silent fail
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleCopy = () => {
    const transcript = messages
      .map((m) => {
        const speaker = m.role === "assistant" ? chatConfig.panelTitle : "You";
        const text = `${speaker}: ${m.text}`;
        if (m.role === "assistant" && m.showBookingCta) {
          return `${text}\n[Book Online → ${bookingHref}]`;
        }
        return text;
      })
      .join("\n");
    navigator.clipboard.writeText(transcript).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!config.enabled) return null;

  return (
    <div
      id="assistant"
      className="pointer-events-none fixed bottom-20 right-4 z-[200] flex flex-col items-end gap-2 sm:bottom-6 sm:right-6"
    >
      {open ? (
        <div className="pointer-events-auto w-80 sm:w-[22rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200/90 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between border-b border-slate-200/80 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">
              {config.panelTitle}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Copy conversation"
              >
                {copied ? "Copied!" : "Copy chat"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close"
              >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              </button>
            </div>
          </div>

          <div className="max-h-64 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={cn(
                    "max-w-[90%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap break-words",
                    message.role === "assistant"
                      ? "bg-slate-100/90 text-slate-800"
                      : "ml-auto bg-teal-600 text-white",
                  )}
                >
                  {message.showBookingCta
                    ? message.text.replace(/https?:\/\/\S+/g, "").trim()
                    : message.text}
                </div>
                {message.role === "assistant" && message.showBookingCta && !isStreaming && (
                  <div className="mt-2">
                    <AppLink
                      href={bookingHref}
                      onClick={logBookingClick}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-teal-600 px-4 py-2 text-[13px] font-medium text-teal-700 bg-white transition-colors hover:bg-teal-50"
                    >
                      Book Online
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M2 7h10M7 2l5 5-5 5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </AppLink>
                  </div>
                )}
              </div>
            ))}
            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-1">
                {["What are your prices?", "Help me choose a treatment", "Book online"].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip)}
                    className="rounded-full border border-teal-600 px-3 py-1.5 text-[12px] text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
            {loading ? (
              <div className="rounded-2xl bg-slate-100/90 px-3.5 py-2.5 text-[13px] text-slate-500">
                Thinking…
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-slate-200/80 p-4 pt-4"
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder=""
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-[13px] text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="shrink-0 px-4 py-2.5 text-[13px]"
              >
                Send
              </Button>
            </div>
          </form>

          {config.disclaimer ? (
            <p className="border-t border-slate-100 px-4 py-2.5 text-[10px] leading-relaxed text-slate-400">
              {config.disclaimer}
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Floating trigger: desktop only — mobile uses StickyMobileCTA */}
      <div className="pointer-events-auto hidden sm:block">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500 bg-teal-600 text-white shadow-sm hover:bg-teal-500 shadow-md shadow-teal-200/60"
        >
          {config.triggerLabel}
        </button>
      </div>
    </div>
  );
}

export default ChatWidget;
