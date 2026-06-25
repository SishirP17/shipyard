"use client";

import { motion } from "framer-motion";
import { PROFILE } from "@/lib/content";
import { fadeUp, reveal, staggerContainer } from "@/lib/motion";

export function About() {
  return (
    <section id="about" className="relative scroll-mt-20 py-24 lg:py-32">
      {/* soft divider glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          {/* LEFT: narrative */}
          <motion.div {...reveal} variants={staggerContainer} className="lg:col-span-7">
            <motion.div variants={fadeUp} className="mb-4 flex items-center gap-3">
              <span className="font-mono text-base text-iris-300">03</span>
              <span className="hairline max-w-[60px]" />
              <span className="label-mono-lg">About</span>
            </motion.div>

            <motion.h2 variants={fadeUp} className="text-display text-white">
              {PROFILE.summary}
            </motion.h2>

            <div className="mt-8 space-y-5">
              {PROFILE.about.map((para, i) => (
                <motion.p key={i} variants={fadeUp} className="text-zinc-400 leading-relaxed">
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Focus areas */}
            <motion.div variants={fadeUp} className="mt-8">
              <div className="label-mono mb-3">What I work on</div>
              <div className="flex flex-wrap gap-2">
                {PROFILE.focus.map((f) => (
                  <span key={f} className="chip">
                    {f}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: skills */}
          <motion.div {...reveal} variants={staggerContainer} className="lg:col-span-5">
            <motion.div variants={fadeUp} className="glass-panel bracket-frame p-7">
              <div className="label-mono mb-6">Toolbox</div>
              <div className="space-y-6">
                {PROFILE.skills.map((s) => (
                  <div key={s.group}>
                    <div className="mb-3 font-mono text-xs text-zinc-500">{s.group}</div>
                    <div className="flex flex-wrap gap-2">
                      {s.items.map((item) => (
                        <span key={item} className="chip">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
