import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Github, Code2 } from "lucide-react";
import { CASE_STUDIES, type CaseImage } from "@/lib/case-studies";
import { SITE } from "@/lib/content";

export function generateStaticParams() {
  return Object.keys(CASE_STUDIES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = CASE_STUDIES[slug];
  if (!cs) return {};
  return {
    title: `${cs.title} — Case study`,
    description: cs.intro,
    openGraph: {
      title: `${cs.title} — Case study · ${SITE.name}`,
      description: cs.intro,
      images: [{ url: cs.cover.src }],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = CASE_STUDIES[slug];
  if (!cs) notFound();

  return (
    <main className="relative overflow-x-clip">
      {/* ambient top glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(138,99,255,0.16),transparent_70%)]"
      />

      {/* Header */}
      <header className="border-b border-white/[0.06]">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-iris-400 to-iris-600 text-white shadow-glow-iris">
              <Code2 className="h-4 w-4" />
            </span>
            <span className="font-display text-base font-semibold tracking-tight text-white">
              {SITE.name}
            </span>
          </Link>
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> All work
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container pt-16 lg:pt-24">
        <div className="mb-4 flex items-center gap-3">
          <span className="label-mono">Case study</span>
          <span className="hairline max-w-[60px]" />
          <span className="label-mono text-iris-300">{cs.year}</span>
        </div>

        <h1 className="font-display text-hero text-white">{cs.title}</h1>
        <p className="mt-5 max-w-2xl text-xl text-zinc-300">{cs.tagline}</p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div>
            <div className="label-mono">Role</div>
            <div className="mt-1 text-sm text-white">{cs.role}</div>
          </div>
          {(cs.links?.live || cs.links?.repo) && (
            <div className="flex items-center gap-3">
              {cs.links?.live && (
                <a href={cs.links.live} target="_blank" rel="noreferrer" className="btn-iris group text-sm">
                  Visit live site
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
              {cs.links?.repo && (
                <a href={cs.links.repo} target="_blank" rel="noreferrer" className="btn-ghost group text-sm">
                  <Github className="h-3.5 w-3.5" /> Source
                </a>
              )}
            </div>
          )}
        </div>

        {/* Cover image */}
        <Figure image={cs.cover} className="mt-12" priority />
      </section>

      {/* Body */}
      <article className="container mt-16 max-w-3xl">
        <p className="text-lg leading-relaxed text-zinc-300">{cs.intro}</p>

        <div className="mt-14 space-y-14">
          {cs.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-title text-white">{section.heading}</h2>
              <div className="mt-4 space-y-4">
                {section.body.map((para, i) => (
                  <p key={i} className="leading-relaxed text-zinc-400">
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>

      {/* Gallery */}
      {cs.gallery.length > 0 && (
        <section className="container mt-16 max-w-4xl space-y-10">
          {cs.gallery.map((img) => (
            <Figure key={img.src} image={img} />
          ))}
        </section>
      )}

      {/* Stack + Results */}
      <section className="container mt-20 max-w-4xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <div className="label-mono mb-4">Built with</div>
            <div className="flex flex-wrap gap-2">
              {cs.stack.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="label-mono mb-4">At a glance</div>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              {cs.results.map((r) => (
                <div key={r.label} className="bg-slate-900/40 p-5">
                  <dt className="font-display text-2xl font-semibold text-white">{r.value}</dt>
                  <dd className="mt-1 text-xs leading-snug text-zinc-500">{r.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container my-24 max-w-4xl">
        <div className="glass-panel flex flex-col items-center justify-between gap-6 p-8 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="font-display text-xl font-semibold text-white">Want to see more?</h3>
            <p className="mt-1 text-sm text-zinc-400">Explore the rest of my work, or get in touch about a project.</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Link href="/#work" className="btn-ghost text-sm">
              <ArrowLeft className="h-3.5 w-3.5" /> All work
            </Link>
            <Link href="/#contact" className="btn-iris text-sm">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Figure({
  image,
  className = "",
  priority = false,
}: {
  image: CaseImage;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 shadow-panel">
        <Image
          src={image.src}
          alt={image.alt}
          width={1440}
          height={900}
          priority={priority}
          className="h-auto w-full"
          sizes="(max-width: 1024px) 100vw, 960px"
        />
      </div>
      {image.caption && (
        <figcaption className="mt-3 text-center text-sm text-zinc-500">{image.caption}</figcaption>
      )}
    </figure>
  );
}
