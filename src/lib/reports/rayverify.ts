import type { ProjectReport } from "@/lib/reports/types";

export const REPORT: ProjectReport = {
  slug: "rayverify",
  title: "RayVerify",
  tagline: "Fraud detection and identity verification for Medicaid home-care programs.",
  year: "2026",
  role: "2-engineer team: architecture, backend and infrastructure design",
  treatment: "full",
  intro:
    "RayVerify is the program-integrity sibling of RayHealth EVV. Where EVV proves a visit happened at a time and place, RayVerify asks the harder question: was it real? It layers identity, device, and location signals into an explainable fraud score from 0 to 100 that an investigator can act on before a payment goes out. It is a foundation-stage build: the scoring engine, data model, API, and cloud architecture are real, and I am upfront below about which parts are still designed rather than built.",
  sections: [
    {
      id: "overview",
      heading: "Overview",
      body: [
        "RayVerify is an npm workspaces monorepo: a NestJS 11 backend with Prisma and PostgreSQL, a Next.js investigator dashboard with shadcn/ui, and a shared types package. Around it sits an unusually complete paper trail: a 585-line physical SQL schema, a 28-path OpenAPI 3.1 contract, seven Terraform modules defining 150 AWS resources, and about 9,000 lines of design docs covering the fraud engine, security model, and compliance mapping.",
        "The product thesis: EVV compliance data already exists, but states pay first and chase fraud later. RayVerify is built to flip that order.",
      ],
    },
    {
      id: "problem",
      heading: "The problem",
      body: [
        "Medicaid home-care fraud is usually simple in kind and massive in volume: visits billed from the wrong place, two caregivers sharing one phone, shifts that overlap in ways physics disagrees with. Time and location checks alone miss most of it, and investigators drown in raw data with no ranking.",
        "The system that catches this has to explain itself. A score that says 87 with no reasons is useless in an administrative hearing, so explainability is a hard requirement, not a nice-to-have.",
      ],
    },
    {
      id: "architecture",
      heading: "The verification chain",
      body: [
        "Every visit runs a verification chain: identity, GPS geofence, device posture, patient confirmation, then fraud scoring, fused into an overall pass, review, or fail. Missing evidence always resolves to review, never to a silent pass. The chain result is hashed with SHA-256 over its canonical form and stored immutably, so what the system believed at decision time is provable later.",
        "The fraud engine runs six pure rule detectors: identity mismatch, GPS anomaly, impossible travel, duplicate visit, shared device, and abnormal duration. Detectors are deliberately pure functions with no database access, which makes them trivially testable and versioned. Each one returns a severity, a plain-English explanation, and structured evidence.",
      ],
    },
    {
      id: "stack-choices",
      heading: "Why this stack",
      body: [
        "NestJS over plain Express because this codebase is guard-heavy by nature: three global guards run on every request (throttling, JWT auth, permissions), and Nest's module system keeps eleven feature modules from melting into each other. Prisma owns the logical model, but the physical schema lives in raw SQL because the important guarantees are things an ORM cannot say: monthly range partitioning on the visits and audit tables, row-level security forced on 19 tables, and triggers that refuse mutations on evidence.",
        "The frontend is Next.js 15 with shadcn/ui and Recharts, styled as a deliberately dense, data-first investigator console. Terraform defines the AWS estate (VPC, RDS with a read replica, ECS Fargate, S3 with object-lock WORM evidence storage, CloudFront, KMS, WAF) so the day the product needs to exist in a government cloud, the infrastructure is a plan-and-apply, not a whiteboard.",
      ],
    },
    {
      id: "services",
      heading: "Explainability by construction",
      body: [
        "The composite score uses a weighted noisy-OR: each fired detector contributes a probability, and the fusion computes the chance that at least one is a real problem. The useful side effect is that each detector's share of the final score falls out of the math, so the dashboard can show exactly which signals drove an 87 and by how much.",
        "Every detection run writes one fraud event per fired detector, with the detector name, its version, the explanation, and the evidence. Scores are never overwritten; a rescore is a new row. Combined with the append-only audit log and its per-tenant SHA-256 hash chain, the whole decision history is tamper-evident: change one historical row and every hash after it stops matching.",
      ],
    },
    {
      id: "data-flow",
      heading: "One visit, end to end",
      body: [
        "A visit is created and the caregiver clocks in: the API writes an append-only GPS verification with a geofence verdict, snapshots the device, and moves the visit in progress. An identity verification lands as its own append-only record. At clock-out the duration and billed units compute, and the verify endpoint runs the full chain: gather the latest evidence, run the six detectors over a lookback window, fuse the score, hash the chain, and set the visit to approved, flagged, or rejected.",
        "Above the alert threshold the visit surfaces to investigators, ranked by score, with the per-detector breakdown and evidence attached. The design docs take it further: scores above 81 auto-open a case, but an actual payment hold always requires a human investigator. The system ranks and explains; it does not punish on its own.",
      ],
    },
    {
      id: "security",
      heading: "Security model",
      body: [
        "Tenant isolation is defense in depth. Every request binds the organization into a transaction-scoped Postgres setting, and row-level security policies enforce it at the database layer, forced even on table owners. A forgotten where-clause in application code returns zero rows instead of another tenant's data.",
        "Auth is argon2id password hashing, optional TOTP, account lockout after five failed attempts, and JWT access tokens with rotating refresh tokens stored only as hashes. Permissions are granular resource-action pairs seeded across roles, and every new endpoint must declare one. The compliance docs map all of it to HIPAA, NIST 800-63, and SOC 2 criteria, because this product's customers are the kind who ask for that mapping on day one.",
      ],
    },
    {
      id: "challenges",
      heading: "Challenges and honest tradeoffs",
      body: [
        "Rules first, ML later, on purpose. Day-one Medicaid fraud has no labeled training data, so deterministic detectors give instant explainability and zero cold start, and the design reserves a queue-fed ML scorer (isolation forests to start, gradient boosting once enough labeled cases exist) as a second opinion that can never be the only opinion. Precision is favored over recall because a false positive delays a caregiver's paycheck and disrupts someone's care.",
        "Being a foundation build, some parts are honest scaffolding: the identity provider is a stub behind a clean interface awaiting a real biometric vendor, the dashboard currently renders mock data while the API contract settles, and Redis plus the async scoring queue are designed but not wired. The docs describe a hypothetical fraudster clocking in 3,950 km away within 15 minutes, a commute of roughly Mach 13, which is exactly the kind of case the impossible-travel detector exists to catch.",
      ],
    },
    {
      id: "outcomes",
      heading: "Outcomes",
      body: [
        "The foundation is real and runs: 27 Prisma models, 34 tables with partitioning and forced row-level security, six versioned detectors with passing tests, a 28-path OpenAPI contract, four CI workflows including CodeQL and security scanning, and 150 Terraform resources ready to build the production estate.",
        "Just as important, the hard product decisions are already made and written down: explainable scoring as a legal requirement, humans in the loop for adverse action, and append-only evidence everywhere. The next phase is wiring, not rethinking.",
      ],
    },
  ],
  diagram: {
    caption: "The verification chain feeding the explainable fraud score.",
    groups: [
      { id: "front", label: "Investigators", nodeIds: ["dashboard"] },
      { id: "core", label: "Implemented core", nodeIds: ["api", "chain", "detectors", "fusion", "db", "audit"] },
      { id: "roadmap", label: "Designed, next phase", nodeIds: ["redis", "ml", "aws"] },
    ],
    nodes: [
      {
        id: "dashboard",
        label: "Investigator dashboard",
        tech: "Next.js 15 + shadcn/ui",
        icon: "Table",
        accent: "aqua",
        col: 0,
        row: 0,
        detail: {
          what: "Ranked alerts, case management, provider risk profiles, fraud trend charts, and per-score breakdowns.",
          why: "Investigators triage by score, so the UI is dense and data-first: tables, badges, and Recharts, no fluff.",
        },
      },
      {
        id: "api",
        label: "NestJS API",
        tech: "11 modules, 3 global guards",
        icon: "Server",
        accent: "iris",
        col: 1,
        row: 0,
        detail: {
          what: "Auth, identity, visits, fraud, cases, providers, audit, reports, and notifications behind one OpenAPI 3.1 contract.",
          why: "Guard-heavy by design: throttling, JWT, and permission checks run globally, and every endpoint declares a required permission.",
          protocol: "REST, documented as OpenAPI 3.1 with Swagger",
        },
      },
      {
        id: "chain",
        label: "Verification chain",
        tech: "identity + GPS + device",
        icon: "Fingerprint",
        accent: "iris",
        col: 2,
        row: 0,
        detail: {
          what: "Gathers the latest identity, geofence, and device evidence for a visit and fuses an overall pass, review, or fail.",
          why: "Missing evidence resolves to review, never to a silent pass, and the whole chain is hashed with SHA-256 for later proof.",
        },
      },
      {
        id: "detectors",
        label: "Rule detectors",
        tech: "6 pure functions",
        icon: "ShieldAlert",
        accent: "ember",
        col: 3,
        row: 0,
        detail: {
          what: "Identity mismatch, GPS anomaly, impossible travel, duplicate visit, shared device, abnormal duration.",
          why: "Pure functions with no database access: trivially testable, individually versioned, and each returns a plain-English explanation plus evidence.",
        },
      },
      {
        id: "fusion",
        label: "Score fusion",
        tech: "weighted noisy-OR",
        icon: "Gauge",
        accent: "ember",
        col: 3,
        row: 1,
        detail: {
          what: "Fuses fired detectors into a 0 to 100 score with a per-detector contribution breakdown.",
          why: "Noisy-OR models 'at least one signal is real' and hands the dashboard exact contribution shares for free. Bands: 0 to 30 low, up to 60 moderate, up to 80 high, above that critical.",
        },
      },
      {
        id: "db",
        label: "PostgreSQL",
        tech: "RLS + partitions",
        icon: "Database",
        accent: "neutral",
        col: 2,
        row: 1,
        detail: {
          what: "27 models; visits and audit logs range-partitioned monthly; append-only triggers on all evidence tables.",
          why: "Row-level security is forced on 19 tables and the runtime role cannot bypass it, so a missing tenant filter returns nothing instead of someone else's data.",
        },
      },
      {
        id: "audit",
        label: "Audit hash chain",
        tech: "SHA-256, per tenant",
        icon: "Lock",
        accent: "iris",
        col: 1,
        row: 1,
        detail: {
          what: "Each audit row's hash includes the previous row's hash, forming a tamper-evident chain per tenant.",
          why: "Chain of custody for litigation: edit one historical row and every hash after it stops matching.",
        },
      },
      {
        id: "redis",
        label: "Redis + queue",
        tech: "BullMQ (planned)",
        icon: "Zap",
        accent: "neutral",
        col: 1,
        row: 2,
        detail: {
          what: "The async scoring queue and online feature store in the target architecture.",
          why: "Rules answer in milliseconds synchronously; the queue exists so slower ML scoring never blocks a clock-out.",
          protocol: "queued jobs, rules-only fallback",
        },
      },
      {
        id: "ml",
        label: "ML scorer",
        tech: "Python (designed)",
        icon: "Cpu",
        accent: "neutral",
        col: 2,
        row: 2,
        detail: {
          what: "Isolation forests for cold start, gradient boosting once at least 500 labeled cases exist, SHAP for explanations.",
          why: "Fraud has no labels on day one, so ML is a phase-two second opinion, never the only opinion.",
        },
      },
      {
        id: "aws",
        label: "AWS estate",
        tech: "Terraform, 150 resources",
        icon: "Cloud",
        accent: "neutral",
        col: 3,
        row: 2,
        detail: {
          what: "VPC, RDS Multi-AZ with a read replica, ECS Fargate, S3 WORM evidence buckets, CloudFront, KMS, WAF, 14 alarms.",
          why: "Written as code now so production is a plan-and-apply later. Evidence buckets use object lock because evidence that can be edited is not evidence.",
        },
      },
    ],
    edges: [
      { from: "dashboard", to: "api", label: "REST + JWT" },
      { from: "api", to: "chain", label: "verify visit" },
      { from: "chain", to: "detectors", label: "24h context", kind: "data" },
      { from: "detectors", to: "fusion", label: "severities", kind: "data" },
      { from: "fusion", to: "db", label: "score + events", kind: "data" },
      { from: "api", to: "audit", label: "every action", kind: "data" },
      { from: "audit", to: "db", kind: "data" },
      { from: "api", to: "redis", label: "async scoring", kind: "async" },
      { from: "redis", to: "ml", label: "feature vectors", kind: "async" },
    ],
  },
  stack: ["NestJS 11", "Prisma", "PostgreSQL", "Redis", "Next.js 15", "shadcn/ui", "TypeScript", "Terraform", "AWS", "OpenAPI 3.1"],
  results: [
    { value: "0-100", label: "Explainable fraud score with per-signal breakdown" },
    { value: "6", label: "Versioned rule detectors, 13 designed" },
    { value: "150", label: "Terraform resources defining the AWS estate" },
    { value: "19", label: "Tables under forced row-level security" },
  ],
  chat: {
    suggestedQuestions: [
      "How does the explainable fraud score work?",
      "What makes the audit trail tamper-evident?",
      "Why rules first and machine learning later?",
    ],
    extraKnowledge: [
      "Foundation stage honesty: 6 of 13 documented detectors are implemented, the identity provider is a stub behind a clean interface, the dashboard renders mock data while the contract settles, and Redis plus BullMQ are dependencies awaiting wiring. Not yet an authorized-to-operate production system.",
      "Scoring math: each fired detector contributes p = severity/100 times its weight (0.6 to 1.0; impossible travel and identity mismatch weigh 1.0). Composite = 1 minus the product of (1 minus p). Contribution shares come from each p divided by the sum.",
      "Geofence verdicts at clock-in: pass within the radius, fail beyond five times the radius, review in between.",
      "Auth details: argon2id hashing, TOTP MFA support, lockout after 5 failures for 15 minutes, refresh tokens stored only as SHA-256 hashes and rotated on use. Throttle: 120 requests per 60 seconds.",
      "The design docs run about 9,000 lines across 12 files, including a worked example of a caregiver clocking in 3,950 km away in 15 minutes, roughly 15,800 km/h. The impossible-travel detector is not impressed.",
      "Compliance mapping targets HIPAA Security Rule sections, HITECH breach notification, NIST 800-63 identity assurance levels, SOC 2 criteria, and the CMS EVV requirements from the 21st Century Cures Act. Retention is 7 years via partition drops.",
    ].join("\n"),
  },
  seo: {
    schemaType: "CreativeWork",
    description:
      "Deep dive into RayVerify, a fraud detection and identity verification platform for Medicaid home-care programs, built around an explainable 0 to 100 fraud score, append-only evidence, and a Terraform-defined AWS estate.",
  },
};
