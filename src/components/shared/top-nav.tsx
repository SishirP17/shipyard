"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { SITE, PROFILE } from "@/lib/content";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

/**
 * Fixed top navigation. Goes from transparent to glass once the user scrolls.
 * The mark is a monospace "{ }" bracket + initials — the builder motif.
 */
export function TopNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cn(
          "transition-all duration-300",
          scrolled
            ? "border-b border-white/[0.06] bg-slate-950/70 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <nav className="container flex h-16 items-center justify-between">
          {/* Mark + wordmark lockup */}
          <a href="#top" className="group flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-iris-400 to-iris-600 text-white shadow-glow-iris">
              <Code2 className="h-4 w-4" />
            </span>
            <span className="flex items-baseline gap-2">
              <span className="font-display text-base font-semibold tracking-tight text-white">
                {SITE.name}
              </span>
              <span className="hidden font-mono text-xs text-zinc-500 sm:inline">
                · {PROFILE.name.toLowerCase()}
              </span>
            </span>
          </a>

          {/* Links */}
          <div className="hidden items-center gap-1 sm:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 text-sm text-zinc-400 transition-colors hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <a href="#contact" className="btn-iris ml-2 !px-4 !py-2 text-sm">
              Get in touch
            </a>
          </div>

          {/* Mobile CTA */}
          <a href="#contact" className="btn-iris !px-4 !py-2 text-sm sm:hidden">
            Contact
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
