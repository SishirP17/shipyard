"use client";

import { motion } from "framer-motion";

/**
 * Ambient background layer behind the hero. Purely decorative.
 *   - Dot-grid (builder motif) faded toward edges
 *   - Two drifting radial auras: iris overhead, aqua lower-right
 *   - Vignette to settle the edges
 *
 * pointer-events: none so it never blocks interaction.
 */
export function AmbientBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Dot grid with radial mask */}
      <div
        className="absolute inset-0 bg-dot-grid bg-dot-md opacity-70"
        style={{
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 35%, black 25%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 35%, black 25%, transparent 80%)",
        }}
      />

      {/* Iris aura — top */}
      <motion.div
        className="absolute -top-1/3 left-1/2 h-[760px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(138,99,255,0.26),transparent_60%)] blur-3xl"
        animate={{ scale: [1, 1.06, 1], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 13, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
      />

      {/* Aqua aura — lower right */}
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle,rgba(63,214,240,0.16),transparent_60%)] blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.45, 0.8, 0.45] }}
        transition={{ duration: 15, repeat: Infinity, ease: [0.65, 0, 0.35, 1], delay: 2 }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(6,7,13,0.85)_92%)]" />
    </div>
  );
}
