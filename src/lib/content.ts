/**
 * ============================================================================
 *  SINGLE SOURCE OF TRUTH for the portfolio.
 *
 *  Everything on the site is driven from this file. To change the site, edit
 *  the values below; you should not need to touch any component.
 *
 *  Writing rules (locked):
 *   - No em dashes. No hyphens used as punctuation to join clauses.
 *   - Compound words (offline-first) are fine.
 *   - Human, natural tone. Mid-level technical depth. Light humor welcome.
 * ============================================================================
 */

import {
  Github,
  Linkedin,
  Mail,
  Globe,
  Layers,
  Sparkles,
  Smartphone,
  Rocket,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Profile                                                                    */
/* -------------------------------------------------------------------------- */

/** Site brand / wordmark. */
export const SITE = {
  name: "Shipyard",
  tagline: "software that ships",
  // Canonical production URL, used for metadata, OG image, robots, sitemap.
  // Update this if you add a custom domain.
  url: "https://shipyard-delta.vercel.app",
};

export const PROFILE = {
  name: "Sishir Phuyal",
  role: "Software Engineer",
  location: "Louisville, KY",

  // Hero headline. "\n" forces a line break; the second line renders in the
  // iris gradient.
  headline: "I build AI-powered\nsoftware that ships.",

  // One-line positioning under the headline.
  sub: "Software engineer focused on full-stack development, AI integration, and production systems. I build the whole thing, data layer to interface, and I ship it.",

  // Short, bold statement for the top of the About section.
  summary:
    "I build production software end to end: clean backends, fast interfaces, and AI that does real work.",

  // Longer About paragraphs.
  about: [
    "I'm a software engineer in Louisville who builds production software from the database up. At Investors Heritage I develop features in a live .NET platform used daily by agents and admin teams, and I rearchitected the team's data-access layer into a centralized query builder that is now the company-wide standard.",
    "Outside of that I build full-stack and AI-native products: RayHealth EVV, a deployed home-care compliance platform, and Chalk, an AI lecture-capture tool with a crash-tolerant media pipeline. I'm most interested in AI applications, autonomous coding agents, and large-scale systems: software that helps people move faster.",
  ],

  // Focus areas, small chips in the About section.
  focus: [
    "AI Applications",
    "Autonomous Coding Agents",
    "Full-Stack Development",
    "Backend Systems",
    "Automation",
    "Algorithms & Optimization",
  ],

  // Three compact stats in the hero. Keep to 3.
  stats: [
    { label: "Now", value: "Software Engineer" },
    { label: "Focus", value: "AI · Full-Stack" },
    { label: "Based", value: "Louisville, KY" },
  ],

  // Path to the résumé PDF served from /public.
  resumeUrl: "/resume.pdf",

  // Skills, grouped.
  skills: [
    { group: "Languages", items: ["TypeScript", "Python", "Java", "C#", "JavaScript", "SQL", "Swift", "Kotlin"] },
    { group: "Frontend", items: ["React", "Next.js", "React Native", "Expo", "Tailwind", "Vite"] },
    { group: "Backend & Data", items: ["Node.js", "Express", "Django", ".NET", "PostgreSQL", "Prisma", "SQL Server", "Firebase"] },
    { group: "AI & Cloud", items: ["Anthropic (Claude)", "AWS Bedrock", "Gemini API", "OpenAI API", "Vercel", "Stripe"] },
    { group: "Practices", items: ["Git", "CI/CD", "REST APIs", "Monorepos"] },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  Projects                                                                   */
/* -------------------------------------------------------------------------- */

export type Project = {
  slug: string;
  name: string;
  logo?: string;
  tagline: string;
  year: string;
  status: "Live" | "In progress" | "Archived";
  problem: string;
  build: string;
  outcome: string;
  stack: string[];
  links?: {
    live?: string;
    repo?: string;
  };
  accent: "iris" | "aqua" | "ember";
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "rayhealth-evv",
    name: "RayHealth EVV",
    logo: "/logos/rayhealth-evv.svg",
    tagline: "A full-stack Electronic Visit Verification platform for home-care agencies.",
    year: "2026",
    status: "Live",
    problem:
      "Home-care agencies have to verify and document every caregiver visit for Medicaid compliance, but the tools to do it are clunky and fragmented across web, mobile, and state reporting.",
    build:
      "Built and deployed a full-stack EVV platform as a scalable monorepo, with shared domain models and validation logic so the web app, mobile app (Expo), and backend stay type-safe and in lockstep. Caregiver clock-in/out with GPS visit verification, scheduling, and authorization management; secure auth with HttpOnly cookie sessions, CSRF protection, role-based access, and audit logging. Integrated Sandata and HHAeXchange export formats, plus AI-assisted workflows via Claude (AWS Bedrock) and Gemini.",
    outcome:
      "Live at rayhealthevv.com with automated testing, linting, security scanning, and CI/CD pipelines. Shared domain models keep web, mobile, and backend in lockstep, designed to meet state Medicaid reporting requirements.",
    stack: ["TypeScript", "React", "Vite", "Node.js", "Express", "PostgreSQL", "Expo", "AWS Bedrock", "Gemini", "Vercel"],
    links: { live: "https://rayhealthevv.com" },
    accent: "iris",
    featured: true,
  },
  {
    slug: "helix-studio",
    name: "Helix Studio",
    logo: "/logos/helix-studio.svg",
    tagline: "An AI operating system for software engineering: a team of agents that build inside your codebase.",
    year: "2026",
    status: "Live",
    problem:
      "Most AI coding tools are a single assistant bolted onto an editor. They autocomplete, but they don't own a change end to end: planning, building, reviewing, securing, and shipping it.",
    build:
      "A full AI software-engineering platform built around a multi-agent pipeline: Planner → Repository Analyzer → Architect → Engineer → Reviewer → Security → Performance, each agent confirming its work before the next begins. Helix indexes and embeds a whole repo on connect, generates reviewable diffs in a real editor, and keeps a line-by-line intent ledger linking every generated line back to the request, plan, and tests. A self-verifying agent runs builds and tests in a sandbox and fixes errors before handing work back, then deploys one-click to an edge runtime with logs and rollback.",
    outcome:
      "Live at helixstudio.org with an autoplaying product demo. Built on Next.js 16, React 19, Prisma 7, and Vercel Sandbox, with model-routed Anthropic + OpenAI agents and 24 built-in engineering skills.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Prisma 7", "PostgreSQL", "Anthropic", "OpenAI", "Vercel Sandbox"],
    links: { live: "https://helixstudio.org" },
    accent: "aqua",
  },
  {
    slug: "chalk",
    name: "Chalk",
    logo: "/logos/chalk.svg",
    tagline: "Turn any lecture into chapters, notes, and quizzes you can actually study from.",
    year: "2026",
    status: "Live",
    problem:
      "Lecture recordings are where studying goes to die. A two-hour video with no structure means scrubbing around hoping to spot the whiteboard change, and transcription tools hand back a wall of text with no map.",
    build:
      "One Next.js app carries the entire backend (36 API routes) with an Expo mobile app as a pure client. Uploads go straight from the browser to Vercel Blob, then a crash-tolerant pipeline extracts audio with ffmpeg and transcribes in parallel Whisper chunks with per-chunk database checkpoints, so when a serverless function dies at 300 seconds the job resumes instead of paying Whisper twice. Chapter timestamps come from matching verbatim quotes against the transcript, because gpt-4o drifts up to 100 seconds if you just ask it for times. YouTube imports skip transcription entirely by pulling the caption track, and when YouTube bot-checks datacenter IPs, the mobile app fetches captions on its own residential IP and hands them to the server.",
    outcome:
      "Live in production on Vercel with Stripe billing: metered transcription minutes, idempotent charging so retries never double-bill, and four-hour lectures that chunk, checkpoint, and chapter themselves without babysitting.",
    stack: ["Next.js 16", "TypeScript", "Expo", "Neon Postgres", "Vercel Blob", "Whisper", "GPT-4o", "Stripe", "ffmpeg"],
    links: { live: "https://chalk-neon.vercel.app" },
    accent: "ember",
  },
  {
    slug: "rayverify",
    name: "RayVerify",
    logo: "/logos/rayverify.svg",
    tagline: "Fraud detection and identity verification for Medicaid home-care programs.",
    year: "2026",
    status: "In progress",
    problem:
      "Medicaid home-care fraud is simple in kind and massive in volume: visits billed from the wrong place, two caregivers sharing one phone, shifts that overlap in ways physics disagrees with. States pay first and chase fraud later, and a score that says 87 with no reasons is useless in a hearing.",
    build:
      "A NestJS + Prisma backend where six pure-function detectors (impossible travel, shared device, duplicate visits, GPS anomaly, identity mismatch, abnormal duration) feed a weighted noisy-OR fusion, so each detector's share of the final 0 to 100 score falls out of the math and investigators see exactly what drove an 87. Every decision is hashed with SHA-256 and stored append-only, row-level security is forced on 19 tables so a forgotten where-clause returns zero rows instead of another tenant's data, and 150 Terraform-defined AWS resources (ECS Fargate, RDS, WORM evidence storage) are ready to plan-and-apply.",
    outcome:
      "A foundation-stage build that is honest about it: 27 Prisma models, 34 partitioned tables, versioned detectors with passing tests, a 28-path OpenAPI contract, and an investigator dashboard. The hard product decisions (explainable scoring, humans in the loop for adverse action) are made and written down.",
    stack: ["NestJS", "Prisma", "PostgreSQL", "TypeScript", "Next.js 15", "Terraform", "AWS"],
    accent: "iris",
  },
  {
    slug: "roamkit",
    name: "Roamkit",
    logo: "/logos/roamkit.svg",
    tagline: "An offline-first travel toolkit for iOS, Android, and web.",
    year: "2026",
    status: "In progress",
    problem:
      "Travelers need quick utilities (currency, units, tips, time zones) exactly when they have no signal. Most apps break the moment you go offline.",
    build:
      "A cross-platform Expo / Expo Router app that's offline-first by design: it ships with a bundled exchange-rate snapshot, silently refreshes and caches fresh rates on-device when online, and falls back to the latest known rates (with a \"rates as of…\" note) when offline. A growing grid of tools (currency and unit converters, tip and split, world clock, phrasebook, flashlight and SOS) driven by a single tool catalog, so new tools drop in fast.",
    outcome:
      "Building toward a Play Store release with EAS, including in-app purchases via RevenueCat. One Expo app, shipped to iOS, Android, and web.",
    stack: ["React Native", "Expo", "Expo Router", "AsyncStorage", "RevenueCat", "EAS"],
    accent: "ember",
  },
  {
    slug: "ion-water-qr",
    name: "ION Water QR",
    logo: "/logos/ion-water-qr.svg",
    tagline: "A dynamic web app that simplifies client form submissions for Louisville ION Water.",
    year: "2025",
    status: "Live",
    problem:
      "ION Water's client intake relied on manual, error-prone paper forms that were slow to process.",
    build:
      "Led front-end development with React/Next.js and Tailwind, integrated with a SQL backend. Implemented dynamic routing, QR-code generation, and secure API handling with environment variables; built reusable components and mobile-responsive layouts.",
    outcome:
      "Shipped on Vercel as a 4-person capstone team at the University of Louisville, working through security, CORS, and backend integration challenges.",
    stack: ["React", "Next.js", "Tailwind", "SQL", "Vercel"],
    accent: "aqua",
  },
  {
    slug: "student-ninja",
    name: "Student Ninja",
    logo: "/logos/student-ninja.svg",
    tagline: "An academic productivity app that turns class schedules into an organized calendar.",
    year: "2023",
    status: "Archived",
    problem:
      "Students juggle deadlines scattered across syllabi and PDFs with no single view of what's due.",
    build:
      "Django web app that parses uploaded Excel/PDF schedules and auto-populates an interactive calendar via JavaScript. Added dynamic task management and an automated email-reminder system using Django background tasks (Celery/Crontab).",
    outcome:
      "Deployed via GitHub and Vercel. An early end-to-end build spanning parsing, scheduling, and backend automation.",
    stack: ["Django", "JavaScript", "HTML/CSS", "Celery"],
    accent: "iris",
  },
];

/* -------------------------------------------------------------------------- */
/*  Experience                                                                 */
/* -------------------------------------------------------------------------- */

export type Experience = {
  company: string;
  role: string;
  period: string;
  note?: string;
  bullets: string[];
};

export const EXPERIENCE: Experience[] = [
  {
    company: "Investors Heritage",
    role: "Software Developer",
    period: "May 2022 to Present",
    note: "Intern (May 2022 to May 2025) · Full-time (May 2025 to Present)",
    bullets: [
      "Build and improve features in a production .NET application used daily by agents and admin teams.",
      "Refactored the backend into a centralized database class and query builder, replacing raw SQL with maintainable, dynamic methods that were adopted company-wide as the standard querying approach.",
      "Write and optimize complex SQL queries and CRUD operations (e.g. policy-history tracking), improving performance and cutting unnecessary database calls.",
      "Created and optimized batch jobs, including a monthly void-policy report emailed to agents that has been in active use for 2+ years.",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Education & Certifications                                                 */
/* -------------------------------------------------------------------------- */

export const EDUCATION = {
  school: "University of Louisville",
  detail: "J.B. Speed School of Engineering",
  degree: "B.S. in Computer Science",
  period: "Aug 2021 to May 2025",
  location: "Louisville, KY",
};

export const CERTIFICATIONS: string[] = [
  "Microsoft Technology Associate (MTA)",
  "Google IT: Technical Support Fundamentals",
  "Google IT: Bits & Bytes of Computer Networking",
  "HackerRank: Problem Solving (Basic)",
  "HackerRank: Software Engineer Intern",
  "HackerRank: Software Engineer",
];

/* -------------------------------------------------------------------------- */
/*  Services: "build with me"                                                  */
/* -------------------------------------------------------------------------- */

export type Service = {
  title: string;
  blurb: string;
  icon: LucideIcon;
};

// Headline + sub for the Services section.
export const SERVICES_INTRO = {
  available: true, // toggles the "Available for projects" badge
  heading: "Need something built? Let's ship it.",
  sub: "I take on a small number of freelance and contract projects, building real, production-grade software for people and teams. If you have an idea or a problem worth solving, I can take it from concept to shipped.",
  // The button that starts a project inquiry (pre-fills an email).
  cta: {
    label: "Start a project",
    href: "mailto:sishir.phuyal03@gmail.com?subject=Project%20inquiry%20via%20Shipyard&body=Hi%20Sishir%2C%0A%0AI%27d%20like%20to%20talk%20about%20building%3A%0A%0A",
  },
};

export const SERVICES: Service[] = [
  {
    title: "Full-stack web apps",
    blurb: "End-to-end product builds: database, API, and a fast, polished interface. From idea to deployed.",
    icon: Layers,
  },
  {
    title: "AI integration",
    blurb: "LLM features, chat assistants, and autonomous agents wired into your product or workflow.",
    icon: Sparkles,
  },
  {
    title: "Mobile apps",
    blurb: "Cross-platform iOS + Android apps built with React Native / Expo.",
    icon: Smartphone,
  },
  {
    title: "MVPs & prototypes",
    blurb: "Get a startup idea built and shipped fast: a real, working product you can put in front of users.",
    icon: Rocket,
  },
];

/* -------------------------------------------------------------------------- */
/*  Contact / Socials                                                          */
/* -------------------------------------------------------------------------- */

export type Social = {
  label: string;
  href: string;
  handle: string;
  icon: LucideIcon;
};

export const SOCIALS: Social[] = [
  { label: "Email", href: "mailto:sishir.phuyal03@gmail.com", handle: "sishir.phuyal03@gmail.com", icon: Mail },
  { label: "GitHub", href: "https://github.com/SishirPhuyal", handle: "@SishirPhuyal", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sishir-phuyal-3a3b33214/", handle: "/in/sishir-phuyal", icon: Linkedin },
  { label: "RayHealth EVV", href: "https://rayhealthevv.com", handle: "rayhealthevv.com", icon: Globe },
];

// "Now" ticker under the hero.
export const NOW_TICKER: string[] = [
  "Software Developer @ Investors Heritage",
  "Building RayHealth EVV",
  "Developing an AI coding assistant",
  "Full-stack + AI engineering",
  "Louisville, KY",
];
