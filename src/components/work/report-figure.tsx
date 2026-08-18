"use client";

/**
 * A screenshot on a deep-dive page, with click-to-enlarge.
 *
 * App screenshots are unreadable at the article's 960px column, so the inline
 * figure is a button that opens the shot full screen. Escape or a click on the
 * backdrop closes it; scroll locking and the Escape wiring are shared with the
 * architecture diagram via useOverlayDismiss.
 */

import { useCallback, useState } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import type { ReportImage } from "@/lib/reports/types";
import { useOverlayDismiss } from "@/lib/use-overlay";
import { cn } from "@/lib/utils";

export function ReportFigure({
  image,
  className = "",
  priority = false,
}: {
  image: ReportImage;
  className?: string;
  priority?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useOverlayDismiss(open, close);

  return (
    <>
      <figure className={className}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Enlarge: ${image.alt}`}
          className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 shadow-panel transition-colors hover:border-white/25"
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={1440}
            height={900}
            priority={priority}
            className="h-auto w-full"
            sizes="(max-width: 1024px) 100vw, 960px"
          />
          <span className="pointer-events-none absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-[#0a0d18]/80 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <Maximize2 className="h-4 w-4" />
          </span>
        </button>
        {image.caption && (
          <figcaption className="mt-3 text-center text-sm text-zinc-500">{image.caption}</figcaption>
        )}
      </figure>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={image.alt}
          onClick={close}
          className="fixed inset-0 z-[140] flex flex-col items-center justify-center gap-4 bg-[#06080f]/95 p-4 backdrop-blur-sm sm:p-8"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close (Esc)"
            title="Close (Esc)"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-[#0a0d18]/80 text-zinc-400 transition-colors hover:border-white/25 hover:text-white sm:right-8 sm:top-8"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Stop the backdrop handler firing when the image itself is clicked. */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={cn("max-h-full min-h-0 w-full max-w-6xl overflow-auto rounded-xl")}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={2560}
              height={1600}
              className="h-auto w-full"
              sizes="100vw"
            />
          </div>
          {image.caption && (
            <p className="shrink-0 text-center text-sm text-zinc-400">{image.caption}</p>
          )}
        </div>
      )}
    </>
  );
}
