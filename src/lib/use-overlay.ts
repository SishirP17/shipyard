"use client";

import { useEffect } from "react";

/**
 * Shared behaviour for anything that covers the page: the architecture
 * diagram's full-screen mode and the screenshot lightbox.
 *
 * While active it locks body scroll (so the page behind does not move under the
 * overlay) and routes Escape to `onEscape`. The callback is deliberately not a
 * plain "close": the diagram has two stages, closing its node panel first and
 * only then leaving full screen, so each caller decides what Escape means.
 */
export function useOverlayDismiss(active: boolean, onEscape: () => void): void {
  useEffect(() => {
    if (!active) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active, onEscape]);
}
