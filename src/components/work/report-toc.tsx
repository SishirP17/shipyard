"use client";

/**
 * Sticky table of contents for deep-dive pages. Renders on lg+ only.
 * Scrollspy via IntersectionObserver; the active section lights up in the
 * project's accent color.
 */

import { useEffect, useState } from "react";
import type { Accent } from "@/lib/accents";
import { ACCENT_TEXT } from "@/lib/accents";
import { cn } from "@/lib/utils";

export function ReportToc({
  items,
  accent,
}: {
  items: { id: string; heading: string }[];
  accent: Accent;
}) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="Report sections" className="hidden lg:block">
      <div className="sticky top-24">
        <div className="label-mono mb-4">On this page</div>
        <ul className="space-y-1 border-l border-white/[0.08]">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "-ml-px block border-l py-1.5 pl-4 text-sm transition-colors",
                  activeId === item.id
                    ? cn("border-current font-medium", ACCENT_TEXT[accent])
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                )}
              >
                {item.heading}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
