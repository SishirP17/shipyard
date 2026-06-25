"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * A soft iris glow that follows the cursor inside its parent element.
 * Drop it as the first child of a `relative` container (e.g. the hero).
 * Pure decoration — pointer-events: none. Hidden until the pointer enters,
 * and disabled under prefers-reduced-motion.
 */
export function CursorGlow() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const sx = useSpring(x, { stiffness: 120, damping: 25, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 120, damping: 25, mass: 0.4 });
  const opacity = useMotionValue(0);
  const sOpacity = useSpring(opacity, { stiffness: 120, damping: 25 });

  useEffect(() => {
    if (reduce) return;
    const parent = ref.current?.parentElement;
    if (!parent) return;

    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
      opacity.set(1);
    };
    const onLeave = () => opacity.set(0);

    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, [reduce, x, y, opacity]);

  if (reduce) return null;

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute z-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        left: sx,
        top: sy,
        opacity: sOpacity,
        background:
          "radial-gradient(circle, rgba(138,99,255,0.18), rgba(63,214,240,0.06) 40%, transparent 70%)",
        filter: "blur(20px)",
      }}
    />
  );
}
