"use client";

import { cn } from "@/lib/utils";
import { usePanda } from "./panda-context";

export function PandaToggle() {
  const { visible, toggle } = usePanda();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={visible}
      aria-label="Toggle the panda"
      onClick={toggle}
      className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 transition-colors hover:border-white/20"
    >
      <span aria-hidden className="text-sm leading-none">🐼</span>
      <span
        className={cn(
          "relative block h-5 w-9 shrink-0 rounded-full transition-colors",
          visible ? "bg-iris-500/70" : "bg-white/10"
        )}
      >
        <span
          className="absolute left-[3px] top-[3px] h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200"
          style={{ transform: visible ? "translateX(16px)" : "translateX(0px)" }}
        />
      </span>
    </button>
  );
}
