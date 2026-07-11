"use client";

/**
 * Detail panel for the selected diagram node: what it is, why it was chosen,
 * and the protocol it speaks. Inline glass panel on sm+ screens, slide-up
 * bottom sheet on phones.
 */

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { DiagramNode } from "@/lib/reports/types";
import { ACCENT_TEXT, NODE_ACCENT_HEX } from "@/lib/accents";
import { springSoft } from "@/lib/motion";

export function DiagramNodePanel({
  node,
  onClose,
}: {
  node: DiagramNode | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {node && (
        <>
          {/* Inline panel (sm and up) */}
          <motion.div
            key={`inline-${node.id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={springSoft}
            className="glass-panel mt-4 hidden p-6 sm:block"
          >
            <PanelBody node={node} onClose={onClose} />
          </motion.div>

          {/* Bottom sheet (phones) */}
          <motion.div
            key={`backdrop-${node.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 sm:hidden"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            key={`sheet-${node.id}`}
            role="dialog"
            aria-label={`${node.label} details`}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={springSoft}
            className="glass-panel-strong fixed inset-x-3 bottom-3 z-50 max-h-[70vh] overflow-y-auto rounded-2xl p-6 sm:hidden"
          >
            <PanelBody node={node} onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function PanelBody({ node, onClose }: { node: DiagramNode; onClose: () => void }) {
  const hex = NODE_ACCENT_HEX[node.accent];
  return (
    <div className="relative">
      <button
        onClick={onClose}
        aria-label="Close details"
        className="absolute -right-1 -top-1 grid h-8 w-8 place-items-center rounded-full text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-3 pr-9">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: hex.stroke }} aria-hidden />
        <h3 className="font-display text-lg font-semibold text-white">{node.label}</h3>
        {node.tech && <span className={`font-mono text-xs ${ACCENT_TEXT[node.accent]}`}>{node.tech}</span>}
      </div>

      <dl className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="label-mono mb-1.5">What it does</dt>
          <dd className="text-sm leading-relaxed text-zinc-300">{node.detail.what}</dd>
        </div>
        <div>
          <dt className="label-mono mb-1.5">Why this choice</dt>
          <dd className="text-sm leading-relaxed text-zinc-300">{node.detail.why}</dd>
        </div>
        {node.detail.protocol && (
          <div>
            <dt className="label-mono mb-1.5">Protocol</dt>
            <dd className="text-sm leading-relaxed text-zinc-300">{node.detail.protocol}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
