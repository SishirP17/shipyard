"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { PROJECTS, type Project } from "@/lib/content";
import { fadeUp, reveal, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

const ACCENT: Record<Project["accent"], { glow: string; text: string; ring: string }> = {
  iris: { glow: "bg-iris-500/10", text: "text-iris-300", ring: "group-hover:border-iris-400/30" },
  aqua: { glow: "bg-aqua-500/10", text: "text-aqua-200", ring: "group-hover:border-aqua-400/30" },
  ember: { glow: "bg-ember-500/10", text: "text-ember-400", ring: "group-hover:border-ember-400/30" },
};

const STATUS: Record<Project["status"], string> = {
  Live: "text-emerald-300",
  "In progress": "text-amber-300",
  Archived: "text-zinc-500",
};

export function Projects() {
  return (
    <section id="work" className="relative scroll-mt-20 py-24 lg:py-32">
      <div className="container">
        {/* Section header */}
        <motion.div {...reveal} variants={staggerContainer} className="mb-14 max-w-2xl">
          <motion.div variants={fadeUp} className="mb-4 flex items-center gap-3">
            <span className="font-mono text-sm text-iris-300">01</span>
            <span className="hairline max-w-[60px]" />
            <span className="label-mono">Selected work</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-display text-white">
            Things I&apos;ve designed, built, and shipped.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-lg text-zinc-400">
            A few projects that show how I think about problems — the constraint, the
            build, and what came out the other side.
          </motion.p>
        </motion.div>

        {/* Cards */}
        <motion.div
          {...reveal}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          {PROJECTS.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ project: p }: { project: Project }) {
  const a = ACCENT[p.accent];

  return (
    <motion.article
      variants={fadeUp}
      className={cn(
        "group glass-panel relative flex flex-col overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1",
        p.featured && "lg:col-span-2"
      )}
    >
      {/* Accent glow that brightens on hover */}
      <div
        className={cn(
          "pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl opacity-60 transition-opacity duration-500 group-hover:opacity-100",
          a.glow
        )}
      />

      {/* Header row */}
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className={cn("label-mono", a.text)}>{p.year}</span>
            <span className="text-zinc-700">·</span>
            <span className={cn("label-mono", STATUS[p.status])}>{p.status}</span>
          </div>
          <h3 className="mt-2 font-display text-2xl font-semibold text-white">{p.name}</h3>
          <p className="mt-1.5 max-w-lg text-zinc-400">{p.tagline}</p>
        </div>

        {/* Links */}
        <div className="flex shrink-0 items-center gap-2">
          {p.links?.repo && (
            <a
              href={p.links.repo}
              target="_blank"
              rel="noreferrer"
              aria-label={`${p.name} source code`}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {p.links?.live && (
            <a
              href={p.links.live}
              target="_blank"
              rel="noreferrer"
              aria-label={`${p.name} live site`}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
            >
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {/* Case study body */}
      <div
        className={cn(
          "relative mt-6 grid gap-5 border-t border-white/[0.06] pt-6",
          p.featured ? "sm:grid-cols-3" : "grid-cols-1"
        )}
      >
        <CaseBlock label="Problem" body={p.problem} />
        <CaseBlock label="Build" body={p.build} />
        <CaseBlock label="Outcome" body={p.outcome} />
      </div>

      {/* Stack */}
      <div className="relative mt-6 flex flex-wrap gap-2">
        {p.stack.map((s) => (
          <span key={s} className="chip">
            {s}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

function CaseBlock({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <div className="label-mono mb-2">{label}</div>
      <p className="text-sm leading-relaxed text-zinc-400">{body}</p>
    </div>
  );
}
