"use client";

/**
 * In-page search for a deep-dive report. Matches the query against every
 * section's heading and body paragraphs, then jumps to the section on
 * selection the same way ReportToc does: set the hash, let ReportSection's
 * own hashchange listener open it, and smooth-scroll into view.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { ReportSection as ReportSectionData } from "@/lib/reports/types";
import type { Accent } from "@/lib/accents";
import { ACCENT_TEXT } from "@/lib/accents";
import { cn } from "@/lib/utils";

type SearchableSection = Pick<ReportSectionData, "id" | "heading" | "body">;

type Result = {
  id: string;
  heading: string;
  snippet: string;
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Wraps every case-insensitive match of `query` in text with <mark>. */
function highlight(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const re = new RegExp(`(${escapeRegExp(q)})`, "gi");
  return text.split(re).map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded-sm bg-iris-400/30 text-white">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

/** Pulls a short window of text centered on the query, so a hit deep inside
 *  a long paragraph still reads in context instead of showing the start
 *  of an unrelated sentence. */
function snippetAround(text: string, query: string, radius = 70): string {
  const idx = text.toLowerCase().indexOf(query.trim().toLowerCase());
  if (idx === -1) return text.slice(0, radius * 2);
  const start = Math.max(0, idx - radius);
  const end = Math.min(text.length, idx + query.trim().length + radius);
  return (start > 0 ? "…" : "") + text.slice(start, end).trim() + (end < text.length ? "…" : "");
}

export function ReportSearch({
  sections,
  accent,
}: {
  sections: SearchableSection[];
  accent: Accent;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out: Result[] = [];
    for (const s of sections) {
      const matchedHeading = s.heading.toLowerCase().includes(q);
      const matchedBody = s.body.find((p) => p.toLowerCase().includes(q));
      if (matchedHeading || matchedBody) {
        out.push({
          id: s.id,
          heading: s.heading,
          snippet: matchedBody ? snippetAround(matchedBody, query) : (s.body[0] ?? "").slice(0, 140),
        });
      }
      if (out.length >= 8) break;
    }
    return out;
  }, [sections, query]);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function jumpTo(id: string) {
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
    window.location.hash = id;
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              inputRef.current?.blur();
            } else if (e.key === "Enter" && results[0]) {
              jumpTo(results[0].id);
            }
          }}
          placeholder="Search this project, try 837P or geofence"
          className="input pl-10 pr-9"
          aria-label="Search this project"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && query.trim() && (
        <div className="glass-panel-strong absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-4 text-sm text-zinc-500">No matches for &ldquo;{query.trim()}&rdquo;.</p>
          ) : (
            <ul className="space-y-0.5">
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => jumpTo(r.id)}
                    className="block w-full rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.05]"
                  >
                    <div className={cn("text-sm font-medium", ACCENT_TEXT[accent])}>
                      {highlight(r.heading, query)}
                    </div>
                    <div className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                      {highlight(r.snippet, query)}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
