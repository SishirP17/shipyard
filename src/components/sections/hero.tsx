"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail, FileText } from "lucide-react";
import { PROFILE, NOW_TICKER } from "@/lib/content";
import { blurIn, fadeUp, staggerContainer, springSoft } from "@/lib/motion";
import { CursorGlow } from "@/components/fx/cursor-glow";
import { Tilt } from "@/components/fx/tilt";
import { ScrambleText } from "@/components/fx/scramble-text";

/**
 * Landing hero.
 *  - Left: status line, blur-in headline, sub, CTAs, stat row
 *  - Right: a floating "terminal" identity card (builder motif)
 *  - Bottom: a "now" marquee
 */
export function Hero() {
  const [line1, line2] = PROFILE.headline.split("\n");

  return (
    <section className="relative pt-32 pb-24 lg:pt-44 lg:pb-32">
      <CursorGlow />
      <div className="container relative grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* LEFT */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative lg:col-span-7"
        >
          <motion.div variants={fadeUp} className="mb-8 flex items-center gap-3">
            <span className="status-dot status-dot-aqua" />
            <span className="flex items-center gap-1.5">
              <ScrambleText text={PROFILE.role} className="label-mono" />
              <span className="label-mono text-zinc-600">·</span>
              <ScrambleText text={PROFILE.location} className="label-mono text-aqua-200" />
            </span>
          </motion.div>

          <motion.h1 variants={blurIn} className="font-display text-hero text-white">
            <span className="block">{line1}</span>
            <span className="block text-gradient-iris">{line2}</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-xl text-lg leading-relaxed text-zinc-400"
          >
            {PROFILE.sub}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-3">
            <a href="#work" className="btn-iris group">
              View my work
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#contact" className="btn-ghost group">
              <Mail className="h-3.5 w-3.5" />
              Get in touch
            </a>
            <a href={PROFILE.resumeUrl} target="_blank" rel="noreferrer" className="btn-ghost group">
              <FileText className="h-3.5 w-3.5" />
              Résumé
            </a>
          </motion.div>

          <motion.dl
            variants={fadeUp}
            className="mt-14 grid max-w-md grid-cols-3 divide-x divide-white/10"
          >
            {PROFILE.stats.map((s) => (
              <div key={s.label} className="px-4 first:pl-0">
                <dt className="label-mono">{s.label}</dt>
                <dd className="mt-1.5 text-sm font-medium text-white">{s.value}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSoft, delay: 0.35 }}
          className="relative lg:col-span-5"
          style={{ perspective: "1200px" }}
        >
          <Tilt className="relative">
            <TerminalCard />
          </Tilt>
        </motion.div>
      </div>

      <NowTicker />
    </section>
  );
}

/* ============================================================
   Floating terminal card — identity rendered as a code editor
   ============================================================ */
function TerminalCard() {
  const firstName = PROFILE.name.split(" ")[0].toLowerCase();

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
      className="relative"
    >
      <div className="absolute -inset-8 rounded-full bg-iris-400/10 blur-3xl" />

      <div className="glass-panel-strong relative overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-2 font-mono text-xs text-zinc-500">{firstName}.ts</span>
          <span className="ml-auto flex items-center gap-1.5 label-mono text-aqua-200">
            <span className="status-dot status-dot-aqua" /> online
          </span>
        </div>

        {/* Code body */}
        <div className="space-y-1.5 px-5 py-5 font-mono text-[13px] leading-relaxed">
          <CodeLine n={1}>
            <span className="text-iris-300">const</span>{" "}
            <span className="text-aqua-200">engineer</span>{" "}
            <span className="text-zinc-500">=</span> <span className="text-zinc-300">{"{"}</span>
          </CodeLine>
          <CodeLine n={2} indent>
            <span className="text-zinc-400">name</span>
            <span className="text-zinc-500">:</span>{" "}
            <span className="text-emerald-300/90">&quot;{PROFILE.name}&quot;</span>
            <span className="text-zinc-500">,</span>
          </CodeLine>
          <CodeLine n={3} indent>
            <span className="text-zinc-400">role</span>
            <span className="text-zinc-500">:</span>{" "}
            <span className="text-emerald-300/90">&quot;{PROFILE.role}&quot;</span>
            <span className="text-zinc-500">,</span>
          </CodeLine>
          <CodeLine n={4} indent>
            <span className="text-zinc-400">based</span>
            <span className="text-zinc-500">:</span>{" "}
            <span className="text-emerald-300/90">&quot;{PROFILE.location}&quot;</span>
            <span className="text-zinc-500">,</span>
          </CodeLine>
          <CodeLine n={5} indent>
            <span className="text-zinc-400">status</span>
            <span className="text-zinc-500">:</span>{" "}
            <span className="text-amber-300/90">&quot;building&quot;</span>
            <span className="text-zinc-500">,</span>
          </CodeLine>
          <CodeLine n={6}>
            <span className="text-zinc-300">{"}"}</span>
            <span className="text-zinc-500 ml-1 inline-block w-2 animate-pulse bg-iris-300/70">&nbsp;</span>
          </CodeLine>
        </div>
      </div>
    </motion.div>
  );
}

function CodeLine({
  n,
  indent,
  children,
}: {
  n: number;
  indent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="w-4 select-none text-right text-zinc-600">{n}</span>
      <span className={indent ? "pl-4" : ""}>{children}</span>
    </div>
  );
}

/* ============================================================
   Now ticker — current focus items scroll horizontally
   ============================================================ */
function NowTicker() {
  const items = [...NOW_TICKER, ...NOW_TICKER];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
      className="absolute inset-x-0 bottom-0 border-y border-white/5 bg-slate-900/40 backdrop-blur-sm"
    >
      <div className="container flex items-center gap-6 py-3">
        <span className="label-mono shrink-0">Now</span>
        <div className="mask-fade-edges flex-1 overflow-hidden">
          <div className="flex animate-marquee gap-12 whitespace-nowrap">
            {items.map((it, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                <span className="status-dot status-dot-iris" />
                {it}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
