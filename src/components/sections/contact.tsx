"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SOCIALS } from "@/lib/content";
import { fadeUp, reveal, staggerContainer } from "@/lib/motion";

export function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-20 py-24 lg:py-32">
      <div className="container">
        <motion.div
          {...reveal}
          variants={staggerContainer}
          className="glass-panel-strong relative overflow-hidden px-7 py-14 text-center sm:px-14"
        >
          {/* glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-iris-500/15 blur-3xl" />

          <motion.div variants={fadeUp} className="relative mb-5 flex items-center justify-center gap-3">
            <span className="font-mono text-base text-iris-300">06</span>
            <span className="label-mono-lg">Contact</span>
          </motion.div>

          <motion.h2 variants={fadeUp} className="relative text-display text-white">
            Let&apos;s build something.
          </motion.h2>

          <motion.p variants={fadeUp} className="relative mx-auto mt-5 max-w-xl text-lg text-zinc-400">
            I&apos;m always open to interesting problems, ambitious teams, and good
            conversations. Whether it&apos;s a role, a collaboration, or just to say hi,
            my inbox is open.
          </motion.p>

          {/* Social links */}
          <motion.div
            variants={fadeUp}
            className="relative mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3"
          >
            {SOCIALS.filter((s) => s.label !== "Email").map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left transition-all hover:border-white/20 hover:bg-white/[0.05]"
              >
                <s.icon className="h-4 w-4 text-iris-300" />
                <span className="min-w-0">
                  <span className="block text-sm text-white">{s.label}</span>
                  <span className="block truncate font-mono text-xs text-zinc-500">{s.handle}</span>
                </span>
                <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-zinc-600 transition-colors group-hover:text-zinc-300" />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
