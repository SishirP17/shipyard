import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Github, LayoutDashboard } from "lucide-react";
import { REPORTS } from "@/lib/reports";
import type { ProjectReport } from "@/lib/reports/types";
import { SITE, PROJECTS } from "@/lib/content";
import type { Accent } from "@/lib/accents";
import { ArchitectureDiagram } from "@/components/work/architecture-diagram";
import { ReportToc } from "@/components/work/report-toc";
import { ReportSection } from "@/components/work/report-section";
import { ReportFigure } from "@/components/work/report-figure";
import { ReportVideoFigure } from "@/components/work/report-video";
import { ProjectChat } from "@/components/work/project-chat";

export function generateStaticParams() {
  return Object.keys(REPORTS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const report = REPORTS[slug];
  if (!report) return {};
  return {
    title: `${report.title} deep dive`,
    description: report.seo.description,
    openGraph: {
      title: `${report.title} deep dive · ${SITE.name}`,
      description: report.seo.description,
      ...(report.cover ? { images: [{ url: report.cover.src }] } : {}),
    },
  };
}

function buildJsonLd(report: ProjectReport) {
  const base = {
    "@context": "https://schema.org",
    "@type": report.seo.schemaType,
    name: report.title,
    description: report.seo.description,
    url: `${SITE.url}/work/${report.slug}`,
    author: { "@type": "Person", name: "Sishir Phuyal" },
  };
  if (report.seo.schemaType === "SoftwareApplication") {
    return {
      ...base,
      applicationCategory: "WebApplication",
      operatingSystem: "Web",
      ...(report.links?.live ? { installUrl: report.links.live } : {}),
    };
  }
  return base;
}

export default async function DeepDivePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = REPORTS[slug];
  if (!report) notFound();

  const accent: Accent = PROJECTS.find((p) => p.slug === slug)?.accent ?? "iris";
  const diagramAfter = report.sections.some((s) => s.id === "architecture")
    ? "architecture"
    : report.sections[0]?.id;

  return (
    <main className="relative overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(report)) }}
      />

      {/* ambient top glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(138,99,255,0.16),transparent_70%)]"
      />

      {/* Header */}
      <header className="border-b border-white/[0.06]">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/favicon.svg"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 drop-shadow-[0_0_10px_rgba(138,99,255,0.25)]"
            />
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
          <span className="label-mono">Deep dive</span>
          <span className="hairline max-w-[60px]" />
          <span className="label-mono text-iris-300">{report.year}</span>
        </div>

        <div className="flex items-center gap-4">
          {PROJECTS.find((p) => p.slug === slug)?.logo && (
            <Image
              src={PROJECTS.find((p) => p.slug === slug)!.logo!}
              alt={`${report.title} logo`}
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 rounded-xl bg-white/[0.03] object-cover ring-1 ring-white/10"
            />
          )}
          <h1 className="font-display text-hero text-white">{report.title}</h1>
        </div>
        <p className="mt-5 max-w-2xl text-xl text-zinc-300">{report.tagline}</p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div>
            <div className="label-mono">Role</div>
            <div className="mt-1 text-sm text-white">{report.role}</div>
          </div>
          {(report.links?.live || report.links?.repo || report.links?.app) && (
            <div className="flex flex-wrap items-center gap-3">
              {report.links?.live && (
                <a href={report.links.live} target="_blank" rel="noreferrer" className="btn-iris group text-sm">
                  Visit live site
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
              {report.links?.app && (
                <a href={report.links.app.href} target="_blank" rel="noreferrer" className="btn-ghost group text-sm">
                  <LayoutDashboard className="h-3.5 w-3.5" /> {report.links.app.label}
                </a>
              )}
              {report.links?.repo && (
                <a href={report.links.repo} target="_blank" rel="noreferrer" className="btn-ghost group text-sm">
                  <Github className="h-3.5 w-3.5" /> Source
                </a>
              )}
            </div>
          )}
        </div>

        {report.cover && <ReportFigure image={report.cover} className="mt-12" priority />}
      </section>

      {/* Body: TOC rail + article */}
      <div className="container mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[200px_minmax(0,1fr)]">
        <ReportToc
          items={report.sections.map((s) => ({ id: s.id, heading: s.heading }))}
          accent={accent}
        />

        <article className="max-w-3xl">
          <p className="text-lg leading-relaxed text-zinc-300">{report.intro}</p>

          <div className="mt-14 space-y-4">
            {report.sections.map((section, index) => (
              <ReportSection
                key={section.id}
                id={section.id}
                heading={section.heading}
                // The first two carry the pitch, so they are open on arrival.
                // Everything after is there for whoever wants the depth.
                defaultOpen={index < 2}
              >
                <div className="space-y-4">
                  {section.body.map((para, i) => (
                    <p key={i} className="leading-relaxed text-zinc-400">
                      {para}
                    </p>
                  ))}
                </div>

                {section.image && <ReportFigure image={section.image} className="mt-8" />}

                {section.video && <ReportVideoFigure video={section.video} className="mt-8" />}

                {section.id === diagramAfter && (
                  <div className="mt-10">
                    <div className="label-mono mb-4">System map</div>
                    <ArchitectureDiagram data={report.diagram} />
                  </div>
                )}
              </ReportSection>
            ))}
          </div>

          {/* Gallery: still supported for reports that have not moved their
              screenshots inline onto individual sections. */}
          {report.gallery && report.gallery.length > 0 && (
            <div className="mt-16 space-y-10">
              {report.gallery.map((img) => (
                <ReportFigure key={img.src} image={img} />
              ))}
            </div>
          )}
        </article>
      </div>

      {/* Stack + Results */}
      <section className="container mt-20 max-w-4xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <div className="label-mono mb-4">Built with</div>
            <div className="flex flex-wrap gap-2">
              {report.stack.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="label-mono mb-4">At a glance</div>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              {report.results.map((r) => (
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

      {report.chat && (
        <ProjectChat
          slug={report.slug}
          projectName={report.title}
          accent={accent}
          suggestedQuestions={report.chat.suggestedQuestions}
        />
      )}
    </main>
  );
}
