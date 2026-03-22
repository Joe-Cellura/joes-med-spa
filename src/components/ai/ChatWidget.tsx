"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { chatConfig } from "../../lib/content";
import Button from "../ui/Button";
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
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef<string>(
    `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
  );

  useEffect(() => {
    if (!config.enabled) return;
    const handler = () => setOpen(true);
    window.addEventListener("open-lumina-chat", handler);
    return () => window.removeEventListener("open-lumina-chat", handler);
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

      try {
        const res = await fetch("/api/lumina-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            history,
            sessionId: sessionId.current,
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          const errorText =
            typeof data?.error === "string"
              ? data.error
              : "Something went wrong. Please try again.";
          setMessages((prev) => [
            ...prev,
            {
              id: `err-${Date.now()}`,
              role: "assistant",
              text: errorText,
            },
          ]);
          return;
        }

        const reply =
          typeof data?.reply === "string" && data.reply.trim()
            ? data.reply.trim()
            : "I couldn't generate a response. Please try again or book a consultation.";
        const showBookingCta =
          typeof data?.showBookingCta === "boolean" ? data.showBookingCta : false;
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            text: reply,
            showBookingCta,
          },
        ]);
      } catch {
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
      }
    },
    [loading],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleCopy = () => {
    const transcript = messages
      .map((m) => {
        const speaker = m.role === "assistant" ? "Lumina AI" : "You";
        const text = `${speaker}: ${m.text}`;
        if (m.role === "assistant" && m.showBookingCta) {
          return `${text}\n[Book a Consultation → /book]`;
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
      id="lumina-ai"
      className="pointer-events-none fixed bottom-20 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6"
    >
      {open ? (
        <div className="pointer-events-auto w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200/90 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
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
                    "max-w-[90%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap",
                    message.role === "assistant"
                      ? "bg-slate-100/90 text-slate-800"
                      : "ml-auto bg-teal-600 text-white",
                  )}
                >
                  {message.text}
                </div>
                {message.role === "assistant" && message.showBookingCta && (
                  <div className="mt-2">
                    <Link
                      href="/book"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-teal-600 px-4 py-2 text-[13px] font-medium text-teal-700 bg-white transition-colors hover:bg-teal-50"
                    >
                      Book a Consultation
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
                    </Link>
                  </div>
                )}
              </div>
            ))}
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
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about treatments, pricing, downtime, or consultations..."
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

      <div className="pointer-events-auto">
        <Button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="shadow-md shadow-teal-200/60"
        >
          {config.triggerLabel}
        </Button>
      </div>
    </div>
  );
}

export default ChatWidget;
