"use client";

/**
 * "Ask about this project" chat widget for deep-dive pages.
 *
 * The widget only knows the project's slug and a few suggested questions;
 * all grounding happens server-side in /api/project-chat, which streams back
 * plain text. History is capped client-side so a long conversation cannot
 * blow past the API's message limits.
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import type { Accent } from "@/lib/accents";
import { springSoft } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_HISTORY = 8;

const ACCENT_BTN: Record<Accent, string> = {
  iris: "from-iris-400 to-iris-600 shadow-glow-iris",
  aqua: "from-aqua-400 to-aqua-600 shadow-glow-aqua",
  ember: "from-ember-400 to-ember-500 shadow-[0_0_40px_-10px_rgba(255,180,84,0.5)]",
};

export function ProjectChat({
  slug,
  projectName,
  accent,
  suggestedQuestions,
}: {
  slug: string;
  projectName: string;
  accent: Accent;
  suggestedQuestions: string[];
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function ask(question: string) {
    const text = question.trim();
    if (!text || busy) return;
    setInput("");
    setOffline(null);
    setBusy(true);

    const history = [...messages, { role: "user" as const, content: text }];
    setMessages([...history, { role: "assistant", content: "" }]);

    try {
      const controller = new AbortController();
      abortRef.current = controller;
      const res = await fetch("/api/project-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ slug, messages: history.slice(-MAX_HISTORY) }),
      });

      if (!res.ok || !res.body) {
        const friendly =
          res.status === 429
            ? "Whoa, easy on the questions. Give it a few minutes and try again."
            : "Chat is offline right now. The rest of the page still works, promise.";
        setOffline(friendly);
        setMessages(history);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        const snapshot = answer;
        setMessages([...history, { role: "assistant", content: snapshot }]);
      }
      if (!answer.trim()) {
        setOffline("Chat is offline right now. The rest of the page still works, promise.");
        setMessages(history);
      }
    } catch {
      setOffline("Chat is offline right now. The rest of the page still works, promise.");
      setMessages(history);
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={springSoft}
            onClick={() => setOpen(true)}
            className={cn(
              "fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-gradient-to-b px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-px",
              ACCENT_BTN[accent]
            )}
          >
            <MessageCircle className="h-4 w-4" />
            Ask about this project
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={`Ask about ${projectName}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={springSoft}
            className="glass-panel-strong fixed inset-x-3 bottom-3 z-50 flex max-h-[80vh] flex-col overflow-hidden sm:inset-x-auto sm:right-5 sm:bottom-5 sm:h-[560px] sm:w-[400px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="status-dot status-dot-aqua" aria-hidden />
                  <span className="font-display text-sm font-semibold text-white">
                    Ask about {projectName}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Answers come from this project&apos;s deep dive.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="grid h-8 w-8 place-items-center rounded-full text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {messages.length === 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-zinc-400">
                    Curious how something works? Ask away, or start with one of these:
                  </p>
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => ask(q)}
                      className="block w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-left text-sm text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    m.role === "user"
                      ? "ml-auto bg-iris-500/20 text-zinc-100"
                      : "bg-white/[0.04] text-zinc-300"
                  )}
                >
                  {m.content || (
                    <span className="inline-flex gap-1" aria-label="Thinking">
                      <Dot delay="0ms" /> <Dot delay="150ms" /> <Dot delay="300ms" />
                    </span>
                  )}
                </div>
              ))}
              {offline && (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
                  {offline}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2 border-t border-white/[0.06] p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask about ${projectName}...`}
                maxLength={1000}
                className="input"
                aria-label="Your question"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send"
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-b text-white transition-opacity disabled:opacity-40",
                  ACCENT_BTN[accent]
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-500"
      style={{ animationDelay: delay }}
    />
  );
}
