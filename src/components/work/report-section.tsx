"use client";

/**
 * One collapsible section of a deep-dive report.
 *
 * The body is NEVER unmounted. It stays in the DOM behind an animated
 * max-height so that:
 *   - search engines still index the whole report,
 *   - Ctrl+F finds text inside collapsed sections,
 *   - ReportToc's IntersectionObserver still sees every section element.
 *
 * That rules out AnimatePresence here. Height animates from 0 to the measured
 * content height and is then released to "auto", so a section that reflows
 * (an image finishing loading, a phone rotating) is never clipped.
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReportSection({
  id,
  heading,
  defaultOpen = false,
  children,
}: {
  id: string;
  heading: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(defaultOpen);
  const [height, setHeight] = useState<number | "auto">(defaultOpen ? "auto" : 0);
  const inner = useRef<HTMLDivElement>(null);
  const panelId = `${useId()}-panel`;

  // Deep links and the table of contents both jump to "#id". If that section is
  // closed the reader lands on a lone heading, so open it when it is targeted.
  useEffect(() => {
    const openIfTargeted = () => {
      if (decodeURIComponent(window.location.hash.slice(1)) === id) setOpen(true);
    };
    openIfTargeted();
    window.addEventListener("hashchange", openIfTargeted);
    return () => window.removeEventListener("hashchange", openIfTargeted);
  }, [id]);

  // Animate to the measured height, then hand control back to "auto" so later
  // reflows inside the section are not clipped by a stale pixel value.
  useEffect(() => {
    if (reduce) {
      setHeight(open ? "auto" : 0);
      return;
    }
    const el = inner.current;
    if (!el) return;

    if (open) {
      setHeight(el.scrollHeight);
      const t = setTimeout(() => setHeight("auto"), 340);
      return () => clearTimeout(t);
    }

    // Collapsing from "auto" would have nothing to tween from, so pin the
    // current pixel height for a frame first.
    setHeight(el.scrollHeight);
    const raf = requestAnimationFrame(() => setHeight(0));
    return () => cancelAnimationFrame(raf);
  }, [open, reduce]);

  const toggle = useCallback(() => setOpen((o) => !o), []);

  return (
    <section id={id} className="scroll-mt-24 border-b border-white/[0.06] pb-6 last:border-b-0">
      <h2>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="group flex w-full items-center justify-between gap-4 py-2 text-left"
        >
          <span className="font-display text-title text-white">{heading}</span>
          <ChevronDown
            aria-hidden
            className={cn(
              "h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-300 group-hover:text-zinc-300",
              open && "rotate-180",
            )}
          />
        </button>
      </h2>

      <div
        id={panelId}
        style={{ height: height === "auto" ? undefined : height }}
        className={cn(
          "overflow-hidden",
          height === "auto" && "h-auto",
          !reduce && "transition-[height,opacity] duration-300 ease-out",
          open ? "opacity-100" : "opacity-0",
        )}
        // inert rather than aria-hidden: the body contains focusable elements
        // (the enlarge button on a screenshot), and focusable children inside an
        // aria-hidden subtree is an accessibility violation. inert takes them
        // out of both the tab order and the accessibility tree, while leaving
        // the text in the DOM for crawlers.
        inert={!open ? true : undefined}
      >
        <div ref={inner} className="pb-2 pt-2">
          {children}
        </div>
      </div>
    </section>
  );
}
