/**
 * ============================================================================
 *  Case studies — long-form writeups for flagship projects.
 *
 *  Each key matches a Project.slug in content.ts. A project that has an entry
 *  here gets a "Read case study" link and a dedicated /work/[slug] page.
 *
 *  Screenshots live in /public/work and are real captures of the running
 *  products (Helix in local demo mode; RayHealth from the live site).
 * ============================================================================
 */

export type CaseImage = { src: string; alt: string; caption?: string };
export type CaseSection = { heading: string; body: string[] };
export type CaseResult = { value: string; label: string };

export type CaseStudy = {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  cover: CaseImage;
  intro: string;
  sections: CaseSection[];
  gallery: CaseImage[];
  stack: string[];
  results: CaseResult[];
  links?: { live?: string; repo?: string };
};

export const CASE_STUDIES: Record<string, CaseStudy> = {
  "helix-studio": {
    slug: "helix-studio",
    title: "Helix Studio",
    tagline: "An AI operating system for software engineering.",
    year: "2026",
    role: "Solo — product, architecture, full-stack & AI",
    cover: {
      src: "/work/helix-agents.png",
      alt: "Helix Studio landing page showing the multi-agent pipeline running a build",
      caption: "The multi-agent pipeline — each specialist confirms its work before the next begins.",
    },
    intro:
      "Helix Studio is a full AI software-engineering platform in the class of Cursor, Windsurf, and Claude Code — but built around a multi-agent pipeline instead of a single assistant. You connect a repository, describe a change in plain English, and a team of specialist agents plans it, writes it, reviews it, audits it for security and performance, and ships it.",
    sections: [
      {
        heading: "The problem",
        body: [
          "Most AI coding tools are a single assistant bolted onto an editor. They're great at autocompleting the next line, but they don't own a change end to end — nobody plans the work, checks it against the rest of the codebase, hardens it, or verifies it actually runs before handing it back.",
          "I wanted to build the opposite: a system that treats shipping software as a pipeline of specialized responsibilities, the way a real engineering team does — and makes every step inspectable.",
        ],
      },
      {
        heading: "A pipeline of specialist agents",
        body: [
          "Helix runs a chain of agents — Planner → Repository Analyzer → Architect → Engineer → Reviewer → Security Auditor → Performance Auditor — where each one confirms its work before the next begins. On connect, Helix indexes and embeds the whole repository, then maps its architecture, data flow, and dependencies so every agent reasons with real context, not guesses.",
          "Code generation happens as safe, reviewable diffs inside a real editor with a file tree, tabs, and syntax highlighting — not an opaque 'trust me' rewrite.",
        ],
      },
      {
        heading: "The intent ledger & intentional undo",
        body: [
          "Every generated line links back to the request that asked for it, the plan step it belongs to, the agent's reasoning, and the tests that protect it — a line-by-line intent ledger. That makes the work auditable instead of magical.",
          "It also enables 'intentional undo': you reverse an idea, not a commit. Remove a feature and keep everything built after it intact.",
        ],
      },
      {
        heading: "Self-verifying, then shipped",
        body: [
          "A self-verifying agent runs the build and tests in a sandbox (Vercel Sandbox) and fixes its own errors before handing work back — Plan → Build → Verify. From there, a one-click deploy ships to a live edge runtime with logs, status, and rollback.",
          "Twenty-four built-in engineering skills (TDD, security hardening, performance) can be invoked on demand to bias the agents toward opinionated, production-grade output.",
        ],
      },
      {
        heading: "Engineering",
        body: [
          "Helix is built on Next.js 16 (App Router), React 19, and TypeScript, with PostgreSQL via Prisma 7 and Auth.js for sessions. The AI layer is model-routed across Anthropic and OpenAI so the right model handles each step, and the whole thing is observable through Sentry.",
          "It runs in a seeded demo mode without a database, which is how the internal screenshots here were captured locally.",
        ],
      },
    ],
    gallery: [
      {
        src: "/work/helix-build.png",
        alt: "Helix Studio build entry screen asking what the user wants to build",
        caption: "Plain-English intake — describe an app or model and Helix plans, builds, and refines it.",
      },
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Prisma 7", "PostgreSQL", "Auth.js", "Anthropic", "OpenAI", "Vercel Sandbox", "Sentry"],
    results: [
      { value: "7", label: "Specialist agents in the pipeline" },
      { value: "24", label: "Built-in engineering skills" },
      { value: "Live", label: "Deployed at helixstudio.org" },
      { value: "1-click", label: "Deploy with logs & rollback" },
    ],
    links: { live: "https://helixstudio.org" },
  },

  "rayhealth-evv": {
    slug: "rayhealth-evv",
    title: "RayHealth EVV",
    tagline: "A full-stack Electronic Visit Verification platform for home-care agencies.",
    year: "2026",
    role: "Solo — full-stack, mobile & infrastructure",
    cover: {
      src: "/work/rayhealth-hero.png",
      alt: "RayHealth EVV landing page — Care, finally on the same page",
      caption: "One calm workspace for scheduling, EVV, authorizations, credentialing, and audit.",
    },
    intro:
      "RayHealth EVV is a deployed Electronic Visit Verification platform that home-care agencies use to verify and document every caregiver visit for Medicaid compliance. It spans a caregiver mobile app, a coordinator web app, and a backend — all sharing one typed core — and is live in production for Pennsylvania agencies.",
    sections: [
      {
        heading: "The problem",
        body: [
          "Home-care agencies are legally required to verify and document every caregiver visit — who, where, when, and against which authorization — for Medicaid reimbursement. The tools that exist for this are fragmented across web, mobile, and state-reporting systems, and a single missed data point can mean a denied claim.",
          "RayHealth set out to make compliance a side effect of a clean daily workflow, not a separate chore: schedule a visit, clock in, and the audit trail builds itself.",
        ],
      },
      {
        heading: "A typed core, three surfaces",
        body: [
          "The platform is a scalable monorepo where shared domain models and validation logic power the web app, the mobile app (via Capacitor), and the backend from one source of truth. A scheduling, authorization, or credentialing rule lives in exactly one place and behaves identically everywhere.",
          "That shared core is what keeps caregiver, coordinator, and state-export views of the same visit consistent down to the field.",
        ],
      },
      {
        heading: "Verifying the visit",
        body: [
          "Caregivers clock in and out with GPS visit verification and a fast haptic confirmation that works offline and queues when signal returns. Coordinators get a visit-review queue that surfaces every exception — late clock-outs, flagged sessions — alongside the federal data points needed to approve or correct them.",
          "Scheduling and authorization management tie each visit back to the authorization it bills against, so over- and under-claiming get caught before they reach the state.",
        ],
      },
      {
        heading: "Compliance & exports",
        body: [
          "RayHealth produces Sandata and HHAeXchange EVV export formats so agencies can submit visit data for Medicaid and state reporting. It's built around the 21st Century Cures Act data elements and aligned to Pennsylvania DHS requirements, with a complete audit trail behind every action.",
          "Security is foundational: HttpOnly cookie sessions, CSRF protection, role-based access control, secure mobile credential storage, and audit logging for system activity.",
        ],
      },
      {
        heading: "AI assistance & delivery",
        body: [
          "AI-powered workflow assistance — built on Claude via AWS Bedrock and the Gemini API — supports caregivers and automates administrative tasks without ever free-drafting compliance-sensitive content.",
          "The whole platform ships through automated testing, linting, security scanning, and CI/CD pipelines, so releases stay reliable as the surface area grows.",
        ],
      },
    ],
    gallery: [
      {
        src: "/work/rayhealth-demo.png",
        alt: "RayHealth EVV product demo showing haptic clock-in, the visit review queue, and the state export format",
        caption: "A real visit, end to end — haptic clock-in, the coordinator review queue, and the state EVV export.",
      },
    ],
    stack: ["TypeScript", "React", "Vite", "Node.js", "Express", "PostgreSQL", "Capacitor", "AWS Bedrock", "Gemini", "Vercel"],
    results: [
      { value: "Live", label: "In production at rayhealthevv.com" },
      { value: "6/6", label: "CMS ACT data elements" },
      { value: "Monorepo", label: "Shared domain models across web, mobile & backend" },
      { value: "100%", label: "PA DHS-aligned exports (Sandata / HHAeXchange)" },
    ],
    links: { live: "https://rayhealthevv.com" },
  },
};

/** Slugs that have a full case study (used to render the card link). */
export const CASE_STUDY_SLUGS = new Set(Object.keys(CASE_STUDIES));
