"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  X, ArrowRight, ArrowLeft, Check, Send, CheckCircle2, Copy, Plus,
} from "lucide-react";
import { SERVICES } from "@/lib/content";
import { cn } from "@/lib/utils";

const RECIPIENT = "sishir.phuyal03@gmail.com";

const TYPE_OPTIONS = [
  ...SERVICES.map((s) => ({ id: s.title, label: s.title, icon: s.icon })),
  { id: "Something else", label: "Something else", icon: Plus },
];

const TIMELINES = ["ASAP", "1–3 months", "3–6 months", "Flexible"];
const BUDGETS = ["< $2k", "$2k – $5k", "$5k – $15k", "$15k+", "Let's discuss"];

const STEPS = ["What you need", "Scope", "About you", "Review"];

export function ProjectModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [types, setTypes] = useState<string[]>([]);
  const [timeline, setTimeline] = useState("");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => setMounted(true), []);

  // Reset to a clean state whenever it re-opens.
  useEffect(() => {
    if (open) {
      setStep(0); setDir(1); setSent(false); setCopied(false);
    }
  }, [open]);

  // Esc to close + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canNext = step === 0 ? types.length > 0 : step === 2 ? emailValid : true;

  const brief = useMemo(() => {
    const lines = [
      "Hi Sishir,",
      "",
      "I'd like to talk about building:",
      ...(types.length ? types.map((t) => `  • ${t}`) : ["  • (not specified)"]),
      "",
      `Timeline: ${timeline || "Flexible / TBD"}`,
      `Budget: ${budget || "Let's discuss"}`,
      "",
      "About the project:",
      message.trim() || "(I'll share more details over email.)",
      "",
      "—",
      name.trim() || "(name)",
      email.trim(),
    ];
    return lines.join("\n");
  }, [types, timeline, budget, message, name, email]);

  const subject = `Project inquiry via Shipyard${types.length ? " — " + types.join(", ") : ""}`;
  const mailto = `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(brief)}`;

  function go(next: number) {
    setDir(next > step ? 1 : -1);
    setStep(next);
  }

  function toggleType(id: string) {
    setTypes((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  }

  function send() {
    window.location.href = mailto;
    setSent(true);
  }

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(`To: ${RECIPIENT}\nSubject: ${subject}\n\n${brief}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          aria-modal
          role="dialog"
        >
          <motion.div
            className="glass-panel-strong relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-b-none rounded-t-3xl sm:rounded-3xl"
            initial={{ y: 40, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 30, scale: 0.97, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* progress bar */}
            <div className="h-1 w-full bg-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-iris-400 to-aqua-400"
                animate={{ width: `${sent ? 100 : ((step + 1) / STEPS.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 26 }}
              />
            </div>

            {/* header */}
            <div className="flex items-center justify-between px-6 pt-5">
              <div>
                <div className="label-mono text-iris-300">
                  {sent ? "Done" : `Step ${step + 1} of ${STEPS.length}`}
                </div>
                <h3 className="mt-1 font-display text-xl font-semibold text-white">
                  {sent ? "Brief ready" : STEPS[step]}
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-colors hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {sent ? (
                <SuccessView copied={copied} onCopy={copyBrief} mailto={mailto} />
              ) : (
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div
                    key={step}
                    custom={dir}
                    initial={{ opacity: 0, x: dir * 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: dir * -30 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {step === 0 && (
                      <Step title="What do you want built?" hint="Pick anything that applies.">
                        <div className="grid grid-cols-2 gap-3">
                          {TYPE_OPTIONS.map((o) => {
                            const active = types.includes(o.id);
                            return (
                              <button
                                key={o.id}
                                onClick={() => toggleType(o.id)}
                                className={cn(
                                  "group relative flex flex-col gap-2 rounded-xl border p-4 text-left transition-all",
                                  active
                                    ? "border-iris-400/50 bg-iris-500/10"
                                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                                )}
                              >
                                <o.icon className={cn("h-5 w-5", active ? "text-iris-300" : "text-zinc-400")} />
                                <span className="text-sm font-medium text-white">{o.label}</span>
                                <span
                                  className={cn(
                                    "absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full transition-all",
                                    active ? "bg-iris-400 text-white" : "bg-white/5 text-transparent"
                                  )}
                                >
                                  <Check className="h-3 w-3" />
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </Step>
                    )}

                    {step === 1 && (
                      <div className="space-y-7">
                        <Step title="Timeline" hint="When do you need it?">
                          <ChipRow options={TIMELINES} value={timeline} onChange={setTimeline} />
                        </Step>
                        <Step title="Budget" hint="Ballpark is fine — no commitment.">
                          <ChipRow options={BUDGETS} value={budget} onChange={setBudget} />
                        </Step>
                      </div>
                    )}

                    {step === 2 && (
                      <Step title="How do I reach you?" hint="Email is required so I can reply.">
                        <div className="space-y-4">
                          <Field label="Name">
                            <input
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Your name"
                              className="input"
                            />
                          </Field>
                          <Field label="Email" required>
                            <input
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="you@email.com"
                              type="email"
                              className={cn("input", email && !emailValid && "ring-1 ring-rose-400/60")}
                            />
                          </Field>
                          <Field label="Anything else?">
                            <textarea
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="A sentence or two about the project…"
                              rows={3}
                              className="input resize-none"
                            />
                          </Field>
                        </div>
                      </Step>
                    )}

                    {step === 3 && (
                      <Step title="Quick review" hint="Here's the brief I'll send.">
                        <dl className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm">
                          <Row k="Building">
                            <div className="flex flex-wrap justify-end gap-1.5">
                              {types.length ? types.map((t) => <span key={t} className="chip">{t}</span>) : <span className="text-zinc-500">—</span>}
                            </div>
                          </Row>
                          <Row k="Timeline">{timeline || "Flexible"}</Row>
                          <Row k="Budget">{budget || "Let's discuss"}</Row>
                          <Row k="From">{name || "—"}</Row>
                          <Row k="Email">{email}</Row>
                          {message.trim() && <Row k="Notes">{message}</Row>}
                        </dl>
                      </Step>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* footer */}
            {!sent && (
              <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-6 py-4">
                <button
                  onClick={() => (step === 0 ? onClose() : go(step - 1))}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" /> {step === 0 ? "Cancel" : "Back"}
                </button>

                {step < STEPS.length - 1 ? (
                  <button
                    onClick={() => canNext && go(step + 1)}
                    disabled={!canNext}
                    className="btn-iris group text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ) : (
                  <button onClick={send} className="btn-iris group text-sm">
                    Send brief
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ----------------------------- small pieces ----------------------------- */

function SuccessView({ copied, onCopy, mailto }: { copied: boolean; onCopy: () => void; mailto: string }) {
  return (
    <div className="py-4 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
        className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-iris-400 to-iris-600 text-white shadow-glow-iris"
      >
        <CheckCircle2 className="h-8 w-8" />
      </motion.div>
      <h4 className="mt-5 font-display text-xl font-semibold text-white">Your email is ready to go.</h4>
      <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-400">
        Your mail app should have opened with the brief pre-filled. If it didn&apos;t, copy it or open it manually below.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button onClick={onCopy} className="btn-ghost text-sm">
          <Copy className="h-3.5 w-3.5" /> {copied ? "Copied!" : "Copy brief"}
        </button>
        <a href={mailto} className="btn-iris text-sm">Open email</a>
      </div>
    </div>
  );
}

function Step({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-display text-lg font-semibold text-white">{title}</h4>
      {hint && <p className="mt-1 text-sm text-zinc-500">{hint}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ChipRow({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            onClick={() => onChange(active ? "" : o)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-all",
              active
                ? "border-iris-400/50 bg-iris-500/15 text-white"
                : "border-white/10 bg-white/[0.02] text-zinc-300 hover:border-white/20"
            )}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-mono">
        {label} {required && <span className="text-iris-300">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.05] pb-3 last:border-0 last:pb-0">
      <dt className="label-mono shrink-0 pt-0.5">{k}</dt>
      <dd className="text-right text-zinc-200">{children}</dd>
    </div>
  );
}
