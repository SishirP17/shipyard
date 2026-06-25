"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SERVICES, SERVICES_INTRO } from "@/lib/content";
import { fadeUp, reveal, staggerContainer } from "@/lib/motion";
import { ProjectModal } from "@/components/services/project-modal";

/**
 * Services — the "build with me" pitch. Positions the site as a small software
 * studio: clients have already seen the shipped work above; here they learn
 * what can be built for them and how to start.
 */
export function Services() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="services" className="relative scroll-mt-20 py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* LEFT: pitch */}
          <motion.div {...reveal} variants={staggerContainer} className="lg:col-span-5">
            <motion.div variants={fadeUp} className="mb-4 flex items-center gap-3">
              <span className="font-mono text-base text-iris-300">05</span>
              <span className="hairline max-w-[60px]" />
              <span className="label-mono-lg">Work with me</span>
            </motion.div>

            {SERVICES_INTRO.available && (
              <motion.div
                variants={fadeUp}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1"
              >
                <span className="status-dot bg-emerald-400 animate-pulse-aqua" />
                <span className="font-mono text-[11px] uppercase tracking-widelabel text-emerald-300">
                  Available for projects
                </span>
              </motion.div>
            )}

            <motion.h2 variants={fadeUp} className="text-display text-white">
              {SERVICES_INTRO.heading}
            </motion.h2>

            <motion.p variants={fadeUp} className="mt-5 text-lg leading-relaxed text-zinc-400">
              {SERVICES_INTRO.sub}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8">
              <button onClick={() => setModalOpen(true)} className="btn-iris group text-base">
                {SERVICES_INTRO.cta.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </motion.div>
          </motion.div>

          {/* RIGHT: service cards */}
          <motion.div
            {...reveal}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7"
          >
            {SERVICES.map((s) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                className="group glass-panel p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-iris-300 transition-colors group-hover:border-iris-400/30 group-hover:text-iris-200">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.blurb}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <ProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
