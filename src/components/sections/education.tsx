"use client";

import { motion } from "framer-motion";
import { GraduationCap, BadgeCheck } from "lucide-react";
import { EDUCATION, CERTIFICATIONS } from "@/lib/content";
import { fadeUp, reveal, staggerContainer } from "@/lib/motion";

export function Education() {
  return (
    <section id="education" className="relative scroll-mt-20 py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container">
        <motion.div {...reveal} variants={staggerContainer} className="mb-14 max-w-2xl">
          <motion.div variants={fadeUp} className="mb-4 flex items-center gap-3">
            <span className="font-mono text-sm text-iris-300">04</span>
            <span className="hairline max-w-[60px]" />
            <span className="label-mono">Education &amp; Certs</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-display text-white">
            The credentials.
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Education */}
          <motion.div {...reveal} variants={staggerContainer} className="lg:col-span-7">
            <motion.div variants={fadeUp} className="glass-panel h-full p-7">
              <div className="mb-6 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-iris-300" />
                <span className="label-mono">Education</span>
              </div>

              <h3 className="font-display text-2xl font-semibold text-white">{EDUCATION.degree}</h3>
              <div className="mt-2 text-zinc-300">{EDUCATION.school}</div>
              <div className="text-sm text-zinc-500">{EDUCATION.detail}</div>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-zinc-500">
                <span>{EDUCATION.period}</span>
                <span className="text-zinc-700">·</span>
                <span>{EDUCATION.location}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Certifications */}
          <motion.div {...reveal} variants={staggerContainer} className="lg:col-span-5">
            <motion.div variants={fadeUp} className="glass-panel h-full p-7">
              <div className="mb-6 flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-aqua-300" />
                <span className="label-mono">Certifications</span>
              </div>

              <ul className="space-y-3">
                {CERTIFICATIONS.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-sm text-zinc-300">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-aqua-300/70" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
