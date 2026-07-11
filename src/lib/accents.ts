/**
 * Shared accent mappings so cards, diagrams, node panels, and the chat widget
 * all speak the same three colors (plus a neutral for infrastructure nodes).
 */

import type { Accent, NodeAccent } from "@/lib/reports/types";

export type { Accent, NodeAccent };

/** Card-level accent classes (originally lived in sections/projects.tsx). */
export const ACCENT: Record<Accent, { glow: string; text: string; ring: string }> = {
  iris: { glow: "bg-iris-500/10", text: "text-iris-300", ring: "group-hover:border-iris-400/30" },
  aqua: { glow: "bg-aqua-500/10", text: "text-aqua-200", ring: "group-hover:border-aqua-400/30" },
  ember: { glow: "bg-ember-500/10", text: "text-ember-400", ring: "group-hover:border-ember-400/30" },
};

/** Raw hex values for SVG strokes/fills in the architecture diagram. */
export const NODE_ACCENT_HEX: Record<
  NodeAccent,
  { stroke: string; fill: string; glow: string; text: string }
> = {
  iris: { stroke: "#8a63ff", fill: "rgba(116,69,245,0.10)", glow: "rgba(138,99,255,0.35)", text: "#c4b0ff" },
  aqua: { stroke: "#3fd6f0", fill: "rgba(63,214,240,0.08)", glow: "rgba(63,214,240,0.30)", text: "#9fe9f7" },
  ember: { stroke: "#ffb454", fill: "rgba(245,158,43,0.08)", glow: "rgba(255,180,84,0.30)", text: "#ffd29b" },
  neutral: { stroke: "#4a5478", fill: "rgba(74,84,120,0.10)", glow: "rgba(74,84,120,0.25)", text: "#a7b0cf" },
};

/** Tailwind text classes per accent for UI chrome outside the SVG. */
export const ACCENT_TEXT: Record<NodeAccent, string> = {
  iris: "text-iris-300",
  aqua: "text-aqua-200",
  ember: "text-ember-400",
  neutral: "text-zinc-400",
};
