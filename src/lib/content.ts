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
  // This must be the URL Vercel actually SERVES, not one that redirects to it:
  // the apex sishir.dev 308s to www, so www is canonical. If you ever flip the
  // primary domain in Vercel, change this to match or the sitemap and OG tags
  // will start advertising a redirect.
  url: "https://www.sishir.dev",
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
    "I'm a software engineer in Louisville who builds production software from the database up. At Investors Heritage, a life insurance carrier supporting more than 15,000 agents and 300,000 policies, I build the internal .NET platform behind agent servicing, policy administration, and finance. I rearchitected the team's data-access layer into a centralized query builder that is now the company-wide standard, migrated a legacy COBOL program to .NET, and built the quarterly engine that calculates every agent's bonus.",
    "Outside of that I build full-stack and AI-native products, and I ship them. Chalk is an AI lecture-capture platform running in production on a serverless pipeline built to survive being killed mid-job. RoamKit is live on the Google Play Store, offline-first across iOS, Android, and web. RayHealth EVV is a deployed home-care compliance platform I co-built, where the caregiver mobile app was mine alone, design and build, along with the 837P claims transport. I'm most interested in AI applications, autonomous coding agents, and large-scale systems: software that helps people move faster.",
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
    { group: "Backend & Data", items: ["Node.js", "Express", "Django", ".NET", "PostgreSQL", "Prisma", "Knex", "SQL Server", "Neon"] },
    { group: "AI & Cloud", items: ["Anthropic (Claude)", "OpenAI API", "Groq", "AWS Bedrock", "Gemini API", "Vercel", "Stripe"] },
    { group: "Practices", items: ["Git", "CI/CD", "REST APIs", "Monorepos (Turborepo)", "Automated Testing", "Docker", "EAS / app store releases"] },
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
    /** A second product surface, e.g. the signed-in console behind a marketing site. */
    app?: { href: string; label: string };
  };
  accent: "iris" | "aqua" | "ember";
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "rayhealth-evv",
    name: "RayHealth EVV",
    logo: "/logos/rayhealth-evv.png",
    tagline: "A full-stack Electronic Visit Verification platform for home-care agencies.",
    year: "2026",
    status: "Live",
    problem:
      "Home-care agencies have to verify and document every caregiver visit for Medicaid compliance, but the tools to do it are clunky and fragmented across web, mobile, and state reporting.",
    build:
      "A four-workspace Turborepo (a shared domain core, an Express API, a React admin console, and an Expo caregiver app) built with one other engineer, with shared models and validation keeping all four in lockstep. The caregiver mobile app was mine alone: I designed the interface and built every screen, including GPS visit verification that flags any caregiver who moves outside the client's geofence radius for review, an offline store-and-forward queue that survives dead zones, e-signature verification of service, push and SMS notifications, in-app training courses, mileage and earnings, availability and time-off, and a consented selfie identity check at clock-in. I also built the claims and billing transport: 837P X12 claim submission with automated 835 remittance ingest, plus scheduled visit submission to state aggregators (Sandata, HHAeXchange).",
    outcome:
      "Live at rayhealthevv.com with 1,081 tests behind seven required CI gates, an append-only audit log enforced by a database trigger, cell-level PHI encryption, capability-based RBAC, and automated security scanning on every pull request.",
    stack: ["TypeScript", "React", "Vite", "Node.js", "Express", "PostgreSQL", "Expo", "Turborepo", "AWS Bedrock", "Vercel"],
    links: {
      live: "https://rayhealthevv.com",
      app: { href: "https://app.rayhealthevv.com", label: "Ray Admin console" },
    },
    accent: "iris",
    featured: true,
  },
  {
    slug: "chalk",
    name: "Chalk",
    logo: "/logos/chalk.svg",
    tagline: "An AI lecture-capture platform that turns any lecture into chapters, notes, and quizzes.",
    year: "2026",
    status: "Live",
    problem:
      "Lecture recordings are where studying goes to die. A two-hour video with no structure means scrubbing around hoping to spot the moment something changed, and transcription tools just hand back a wall of text with no map.",
    build:
      "A serverless media pipeline with five ways in (record live, upload a file, paste a video link, or import straight from Zoom or Webex) feeding 82 API routes that serve both a Next.js web app and an Expo client. Audio is chunked and each chunk checkpointed to Postgres, with an atomic claim lock and a cron sweeper reviving runs killed by the 300-second function ceiling, so a crashed job resumes instead of re-paying for transcription. Chapter times are resolved by matching the model's verbatim quotes against the real transcript, because asked directly it drifts up to 100 seconds. Models are routed by task: transcription on Groq at roughly a tenth of OpenAI's price, mechanical language work on a cheap tier, and only the calls users judge the product on left on the strong model.",
    outcome:
      "Live at chalkrecap.com with Stripe subscriptions, a metered credit ledger with idempotent per-lecture billing, LTI 1.3 launch from Canvas and Moodle, spaced-repetition study packs, multi-document binders, and instructor engagement analytics. Android is in beta, iOS next.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Groq + OpenAI", "Neon Postgres", "Vercel Blob", "Stripe", "LTI 1.3", "Expo"],
    links: { live: "https://chalkrecap.com" },
    accent: "ember",
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
      "Built with one other engineer, around a multi-agent pipeline: Planner → Repository Analyzer → Architect → Engineer → Reviewer → Security → Performance, each agent confirming its work before the next begins. Helix indexes and embeds a whole repo on connect, generates reviewable diffs in a real editor, and keeps a line-by-line intent ledger linking every generated line back to the request, plan, and tests. A self-verifying agent runs builds and tests in a sandbox and fixes errors before handing work back, then deploys one-click to an edge runtime with logs and rollback.",
    outcome:
      "Live at helixstudio.org with an autoplaying product demo. Built on Next.js 16, React 19, Prisma 7, and Vercel Sandbox, with model-routed Anthropic + OpenAI agents and 24 built-in engineering skills.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Prisma 7", "PostgreSQL", "Anthropic", "OpenAI", "Vercel Sandbox"],
    links: { live: "https://helixstudio.org" },
    accent: "aqua",
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
    status: "Live",
    problem:
      "Travelers need quick utilities (currency, units, tips, time zones) exactly when they have no signal. Most apps break the moment you go offline.",
    build:
      "A cross-platform Expo / Expo Router app that's offline-first by design: it ships with a bundled exchange-rate snapshot, silently refreshes and caches fresh rates on-device when online, and falls back to the latest known rates (with a \"rates as of…\" note) when offline. A growing grid of tools (currency and unit converters, tip and split, world clock, phrasebook, flashlight and SOS) driven by a single tool catalog, so new tools drop in fast.",
    outcome:
      "Live on the Google Play Store after a 14-day closed beta and production review, with real in-app purchases through RevenueCat. One Expo codebase shipping to iOS, Android, and web, and a shared rate store that cut network usage to roughly one call per day.",
    stack: ["React Native", "Expo", "Expo Router", "AsyncStorage", "RevenueCat", "EAS"],
    links: { live: "https://play.google.com/store/apps/details?id=com.roamkit.app" },
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
    note: "Intern (May 2022 to May 2025) · Full-time (May 2025 to Present) · A life insurance carrier supporting 15,000+ agents and 300,000+ policies",
    bullets: [
      "Refactored the backend into a centralized database class and query builder, replacing raw SQL with maintainable, dynamic methods that were adopted company-wide as the standard querying approach.",
      "Migrated a legacy COBOL program to a .NET application, rebuilding the agent hierarchy workflow that governs how policies are credited: business rules for inserting new agents into existing hierarchies, plus a split-hierarchy path for the policies that need one. Months of logic and test refinement, now running in production.",
      "Built the quarterly agent bonus engine that turned the finance team's manual calculation into an algorithm. Finance loads each quarter's data, and the engine evaluates chargebacks, lapsed policies, and tier rules with complex queries across several finance databases to compute every agent's bonus, then generates the annual true-up table at Q4 close.",
      "Build and improve features in a production .NET application used daily by agents and admin teams, and write the complex SQL and CRUD behind them (e.g. policy-history tracking).",
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
  { label: "GitHub", href: "https://github.com/SishirP17", handle: "@SishirP17", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sishir-phuyal-3a3b33214/", handle: "/in/sishir-phuyal", icon: Linkedin },
  { label: "RayHealth EVV", href: "https://rayhealthevv.com", handle: "rayhealthevv.com", icon: Globe },
];

// "Now" ticker under the hero.
export const NOW_TICKER: string[] = [
  "Software Developer @ Investors Heritage",
  "Building Chalk, live at chalkrecap.com",
  "RoamKit is live on Google Play",
  "Shipping RayHealth EVV",
  "Full-stack + AI engineering",
  "Louisville, KY",
];
