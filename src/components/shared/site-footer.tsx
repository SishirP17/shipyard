import { Code2 } from "lucide-react";
import { SITE, PROFILE, SOCIALS } from "@/lib/content";
import { PandaToggle } from "./panda-toggle";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/[0.06] py-10">
      <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-iris-400 to-iris-600 text-white">
            <Code2 className="h-3.5 w-3.5" />
          </span>
          <span className="font-display text-sm font-semibold text-white">{SITE.name}</span>
          <span className="font-mono text-xs text-zinc-600">{`// ${SITE.tagline}`}</span>
        </div>

        <div className="flex items-center gap-4">
          {SOCIALS.filter((s) => s.label !== "Email").map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="text-zinc-500 transition-colors hover:text-white"
            >
              <s.icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        <div className="font-mono text-xs text-zinc-600">© 2026 {PROFILE.name}</div>
      </div>

      {/* Panda visibility toggle — the very bottom of the page */}
      <div className="container mt-8 flex justify-center">
        <PandaToggle />
      </div>
    </footer>
  );
}
