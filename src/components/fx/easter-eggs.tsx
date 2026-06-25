"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SEQUENCE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

/**
 * Two easter eggs:
 *  1. A styled greeting for anyone who opens the dev console.
 *  2. The Konami code (↑↑↓↓←→←→ B A) triggers a "ship it" emoji burst.
 * Renders nothing visible until triggered.
 */
export function EasterEggs() {
  const reduce = useReducedMotion();
  const [party, setParty] = useState(false);

  // Console greeting
  useEffect(() => {
    console.log(
      "%c⚓ Shipyard",
      "color:#8a63ff;font-size:22px;font-weight:700;"
    );
    console.log(
      "%cHey — you opened the console. I like you already.\n" +
        "Built from scratch by Sishir Phuyal.\n" +
        "Like what you see? → sishir.phuyal03@gmail.com\n" +
        "P.S. try the Konami code:  ↑ ↑ ↓ ↓ ← → ← → B A",
      "color:#94a0b8;font-size:13px;line-height:1.7;"
    );
  }, []);

  // Konami listener
  useEffect(() => {
    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === SEQUENCE[idx]) {
        idx += 1;
        if (idx === SEQUENCE.length) {
          idx = 0;
          setParty(true);
          window.setTimeout(() => setParty(false), 2600);
        }
      } else {
        idx = key === SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return <AnimatePresence>{party && <Burst reduce={!!reduce} key="burst" />}</AnimatePresence>;
}

function Burst({ reduce }: { reduce: boolean }) {
  const emojis = ["🚀", "🚢", "⚓", "✨", "🛠️", "📦"];
  const items = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    emoji: emojis[i % emojis.length],
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    drift: (Math.random() - 0.5) * 220,
    rotate: (Math.random() - 0.5) * 360,
    size: 18 + Math.random() * 22,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {!reduce &&
        items.map((it) => (
          <motion.span
            key={it.id}
            className="absolute bottom-0"
            style={{ left: `${it.left}%`, fontSize: it.size }}
            initial={{ y: 40, opacity: 0, rotate: 0 }}
            animate={{
              y: -1000,
              x: it.drift,
              opacity: [0, 1, 1, 0],
              rotate: it.rotate,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, delay: it.delay, ease: "easeOut" }}
          >
            {it.emoji}
          </motion.span>
        ))}

      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 rounded-full border border-iris-400/30 bg-slate-900/80 px-5 py-2 font-mono text-sm text-iris-200 shadow-glow-iris backdrop-blur-md"
      >
        ⚓ Ship it.
      </motion.div>
    </div>
  );
}
