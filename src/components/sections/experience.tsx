"use client";

import { motion } from "framer-motion";
import { EXPERIENCE } from "@/lib/content";
import { fadeUp, reveal, staggerContainer } from "@/lib/motion";

export function Experience() {
  return (
    <section id="experience" className="relative scroll-mt-20 py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container">
        <motion.div {...reveal} variants={staggerContainer} className="mb-14 max-w-2xl">
          <motion.div variants={fadeUp} className="mb-4 flex items-center gap-3">
            <span className="font-mono text-base text-iris-300">02</span>
            <span className="hairline max-w-[60px]" />
            <span className="label-mono-lg">Experience</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-display text-white">
            Where I&apos;ve worked.
          </motion.h2>
        </motion.div>

        <motion.div {...reveal} variants={staggerContainer} className="space-y-6">
          {EXPERIENCE.map((job) => (
            <motion.article key={job.company} variants={fadeUp} className="glass-panel p-7 lg:p-8">
              <div className="flex flex-col gap-4 border-b border-white/[0.06] pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-white">{job.role}</h3>
                  <div className="mt-1 text-iris-300">{job.company}</div>
                  {job.note && (
                    <div className="mt-1.5 font-mono text-xs text-zinc-500">{job.note}</div>
                  )}
                </div>
                <span className="label-mono shrink-0 sm:text-right">{job.period}</span>
              </div>

              <ul className="mt-5 space-y-3">
                {job.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3 text-zinc-400">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-iris-400/70" />
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
