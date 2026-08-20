"use client";

/**
 * A short clip inside a deep-dive report.
 *
 * Self-hosted rather than embedded: a YouTube iframe ships around a megabyte
 * of third party JavaScript, sets cookies before anyone presses play, and
 * decorates the page with its own branding and related-video thumbnails. The
 * file here is a faststart MP4, so it begins streaming on the first range
 * request instead of waiting for a full download.
 *
 * The clip is vertical. Sizing by width would make a 9:16 taller than the
 * viewport on desktop, so the player is capped by height and the width
 * follows from the aspect ratio.
 *
 * Nothing autoplays. The clip has narration, and audio that starts on its own
 * while someone is reading is hostile.
 */

import { useRef, useState } from "react";
import { Play } from "lucide-react";

export function ReportVideoFigure({
  video,
  className = "",
}: {
  video: { src: string; poster?: string; alt: string; caption?: string };
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const start = () => {
    setStarted(true);
    // The poster overlay swallows the first click, so start playback here
    // rather than making the visitor press play twice.
    void ref.current?.play();
  };

  return (
    <figure className={className}>
      <div className="mx-auto w-full max-w-[360px]">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 shadow-panel">
          <video
            ref={ref}
            src={video.src}
            poster={video.poster}
            controls={started}
            playsInline
            preload="metadata"
            aria-label={video.alt}
            className="block h-auto w-full max-h-[70vh]"
          />

          {!started && (
            <button
              type="button"
              onClick={start}
              aria-label={`Play: ${video.alt}`}
              className="group absolute inset-0 grid place-items-center bg-[#06080f]/25 transition-colors hover:bg-[#06080f]/10"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full border border-white/20 bg-[#0a0d18]/80 text-white backdrop-blur-sm transition-transform group-hover:scale-105">
                <Play className="ml-0.5 h-6 w-6" fill="currentColor" />
              </span>
            </button>
          )}
        </div>
      </div>

      {video.caption && (
        <figcaption className="mt-3 text-center text-sm text-zinc-500">{video.caption}</figcaption>
      )}
    </figure>
  );
}
