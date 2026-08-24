import type { ProjectReport } from "@/lib/reports/types";

export const REPORT: ProjectReport = {
  slug: "rayhealth-evv",
  title: "RayHealth EVV",
  tagline: "A full-stack Electronic Visit Verification platform for home-care agencies.",
  year: "2026",
  role: "2-engineer team. The caregiver mobile app was mine alone, design and build; the web console was shared",
  treatment: "full",
  cover: {
    src: "/work/rayhealth-hero.png",
    alt: "RayHealth EVV landing page: care, finally on the same page",
    caption: "One calm workspace for scheduling, EVV, authorizations, credentialing, and audit.",
  },
  intro:
    "RayHealth EVV is a production Electronic Visit Verification platform for home-care agencies. Caregivers clock in and out from a mobile app with GPS verification, coordinators run scheduling and compliance from a web console, and verified visits flow out to state Medicaid aggregators and billing. It is live at rayhealthevv.com, built for the 21st Century Cures Act rules that govern every Medicaid-funded home-care visit.",
  sections: [
    {
      id: "overview",
      heading: "Overview",
      body: [
        "The platform is a Turborepo monorepo with four workspaces: a core package that owns the domain models and the database, an Express 5 API, the React admin console that agencies know as Ray Admin, and an Expo caregiver app. Around 40 PostgreSQL tables, roughly 190 API route handlers, and 1,081 tests across 141 test files hold it together, all behind required CI gates.",
        "The design goal was simple to say and hard to do: make Medicaid compliance a side effect of a normal workday. Schedule a visit, clock in, clock out, and the audit trail, state submission, and claim build themselves.",
      ],
      image: {
        src: "/work/rayhealth-command.jpg",
        alt: "The command center: an AI briefing panel above open EVV exceptions, overdue training, and the day's visit operations",
        caption:
          "The command center answers the only question a coordinator has in the morning: is anything wrong today. Open exceptions surface first because they block a clean state submission.",
      },
    },
    {
      id: "problem",
      heading: "The problem",
      body: [
        "Federal law requires agencies to verify who delivered care, to whom, where, when, and under which authorization, for every single visit. Miss a data point and the claim gets denied. The existing tools are fragmented across web, mobile, and state-reporting portals, and caregivers are busy caring for people, not babysitting forms.",
        "Home care also has a fraud problem, which is why the data model treats visits as evidence: once a clock-in exists, nobody gets to quietly rewrite history. Not even the people who run the database.",
      ],
    },
    {
      id: "architecture",
      heading: "One typed core, three surfaces",
      body: [
        "The core package is the only workspace allowed to touch PostgreSQL. It holds Zod domain entities, about 30 Knex repositories, the migration runner, and the state aggregator integrations. The Express API composes those into routes, the React console and the Expo app are pure API clients. A scheduling or billing rule lives in exactly one place and behaves the same everywhere.",
        "The database does its own enforcement. The audit log has a trigger that refuses UPDATE and DELETE outright, visit rows lock their clock-in facts after creation, and event types are guarded by CHECK constraints kept in lockstep with the domain code. The comment on the audit trigger says it best: nobody, including future us with a SQL console open, gets to edit evidence.",
      ],
    },
    {
      id: "stack-choices",
      heading: "Why this stack",
      body: [
        "Express 5 with Knex instead of a heavy ORM, because the compliance guarantees live in hand-written PL/pgSQL triggers and raw SQL that an ORM cannot express. A CI check literally fails the build if string-built SQL sneaks in, so everything stays parameterized. PostgreSQL was non-negotiable: append-only triggers, timestamptz hardening, and CHECK-constraint enums are the backbone.",
        "Expo and React Native cover the caregiver app on both iOS and Android from one codebase, with tokens in the platform keychain via SecureStore. The web console is React with Vite because coordinators live in it all day and it needs to feel instant. AI runs exclusively through Claude on AWS Bedrock: the app refuses to boot in production if a non-BAA AI key is present, because PHI only travels to vendors with a signed business associate agreement.",
      ],
    },
    {
      id: "services",
      heading: "How the pieces talk",
      body: [
        "The mobile app authenticates with short-lived JWTs pinned to HS256, and every token carries a server-side session id that can be revoked. The web console uses HttpOnly session cookies with CSRF tokens compared in constant time. Both funnel into the same capability-based access control: 18 capabilities mapped across four roles, checked per route, so a coordinator can read billing but only an admin can write claims.",
        "Offline is a first-class citizen. The caregiver app keeps a store-and-forward queue in AsyncStorage: a clock-in with no signal gets a local id, and when the network returns the queue replays in order and remaps the local id to the server one. Punches are treated as evidence, so only a definitive rejection ever drops one, and the server accepts offline timestamps up to 72 hours old before insisting on a formal visit correction.",
      ],
    },
    {
      id: "data-flow",
      heading: "One visit, end to end",
      body: [
        "A recurring schedule materializes into assignments, checked for conflicts and caregiver eligibility. At the door, the caregiver clocks in: the API resolves the assignment, pulls the client's geofence anchor, and runs a Haversine distance check against a 150 meter radius. Outside the fence gets a 422 with the exact distance, plus an audit event. Inside, the visit row snapshots every Cures Act data point at that moment.",
        "Clock-out re-runs the geofence, detects exceptions, and marks the visit verified or flagged. From there the Sandata integration takes over: clients, employees, and visits are submitted as batches over REST, polled for per-record accept or reject, with monotonic sequence numbers on resubmission because Sandata demands them. Verified visits then feed claim generation, which applies the CMS 8-minute rule, scores denial risk, and emits a structurally valid 837P EDI file that goes to the clearinghouse over SFTP. Remittances come back as 835 files and post against the claims. That whole sentence used to be somebody's entire week of manual work.",
      ],
      image: {
        src: "/work/rayhealth-demo.png",
        alt: "RayHealth EVV product demo showing haptic clock-in, the visit review queue, and the state export format",
        caption: "A real visit, end to end: clock-in, the coordinator review queue, and the state EVV export.",
      },
    },
    {
      id: "edi-claims",
      heading: "Building X12 by hand",
      body: [
        "The 837P generator does not lean on a library. X12 is a rigid, positional text format from a decades-old EDI spec (ASC X12N 005010X222A1), so the code builds the interchange segment by segment: the ISA and GS envelope, the billing provider, then for each claim the subscriber, diagnosis codes, and every service line. It refuses to emit a file at all if required billing fields are missing, so a broken claim never leaves the building. The 835 side is the mirror image, a parser that reads whatever a payer sends back, auto-detecting the delimiter characters from the ISA envelope because trading partners do not all agree on one.",
        "Matching a remittance to the original claim turns out to be simpler than the acronyms suggest. Every claim carries a control number when it goes out, and the payer echoes that same number back on the remittance, so posting a payment is just a lookup on that id. Submission itself runs through a pluggable transport, SFTP for real clearinghouses, an HTTP option for the ones that support it, and a sandbox simulator so the whole claim loop is demoable with zero live credentials. Incoming remittance files are deduped by content hash before they are posted, so a scheduled pull can never process the same file twice.",
      ],
    },
    {
      id: "security",
      heading: "Security and compliance",
      body: [
        "PHI columns like Medicaid numbers are encrypted cell by cell with AES-256-GCM before they hit the database, with a random IV per write. Rate limits are tiered per surface, login attempts are capped, TOTP two-factor is available, and super-admin access uses WebAuthn passkeys. The audit middleware records every PHI read, write, and export with a server-generated correlation id, and the retention sweep archives seven years of history, which is longer than HIPAA's own floor.",
        "The AI copilot gets the same treatment. Every prompt is logged as a hash, never as text, because prompts can contain PHI. And when the copilot proposes an action, like enrolling a caregiver in training, it returns a typed, schema-validated proposal that a human must confirm before anything executes. The AI suggests. People decide.",
      ],
      image: {
        src: "/work/rayhealth-audit.jpg",
        alt: "The audit events browser: a filterable table of phi.read events with actor ids, entities, and outcomes, labelled append-only",
        caption:
          "Nearly five thousand audit events on one small agency, and every PHI read is one of them. The append-only badge is not decoration: a database trigger refuses UPDATE and DELETE outright.",
      },
    },
    {
      id: "challenges",
      heading: "Challenges and honest tradeoffs",
      body: [
        "GPS is noisy and people are creative. The geofence check deliberately ignores the phone's self-reported accuracy value, because trusting it would let someone borrow 50 meters by spoofing low confidence. On the flip side, the check fails open when a client has no geocoded address yet, because a new client's first visit should not be blocked by missing setup, and the gap is still audited.",
        "Immutability creates its own puzzles. The retention sweep cannot DELETE through its own append-only trigger, so system maintenance briefly and explicitly bypasses triggers inside a transaction, chunked and logged. And since visit rows refuse edits, all corrections flow through a dedicated maintenance workflow with a seven-day window, exactly how Pennsylvania wants it. The HHAeXchange integration is honest about its state: automated submission is not implemented yet, so the code says so and offers a portal-ready CSV export instead of faking success.",
      ],
    },
    {
      id: "caregiver-app",
      heading: "The app a caregiver actually opens",
      body: [
        "This app is the part of the platform that is mine alone. I designed it and built it, every screen and every flow, while the web console was shared work. The piece I care most about is location: the app tracks where the caregiver is against the client's registered geofence, and anyone who drifts outside the radius during a visit is flagged for a coordinator to review rather than silently accepted. The decision is made on the server, so a modified phone cannot talk its way inside the fence.",
        "Compliance is what the agency needs; it is not what makes a caregiver open the app. So the mobile surface grew into the whole workday. Shifts announce themselves with a soft repeating alarm and a full-screen overlay rather than a single notification that gets missed, delivered by server-driven push with SMS behind a per-user channel preference. Caregivers see what their verified visits are worth, log mileage for agency approval, submit availability and time-off requests, and message their agency without leaving the app.",
        "Training lives there too: an in-app course player with resume-where-you-left-off, including a Pennsylvania Chapter 611 Direct Care Worker competency course of eight modules and a 25-question exam, with the completion evidence attached to the per-visit audit packet. Clock-out captures a verification-of-service e-signature and structured task and note documentation, so the evidence packet is complete the moment the visit ends.",
        "The newest layer is identity. RayVerify adds a consented selfie identity check at clock-in, so the record shows not just that someone's phone was at the right address, but that the right person was holding it. It refuses the capture clearly when storage is not configured rather than silently degrading, because a verification feature that quietly stops verifying is worse than one that is switched off.",
      ],
      image: {
        src: "/work/rayhealth-mobile.jpg",
        alt: "Three caregiver app screens: the day ahead, a live geofence map during a visit, and the completed visit record",
        caption:
          "A caregiver's whole shift, left to right: what is next and how far away it is, the live geofence during the visit reading six metres inside the allowed zone, and the finished record with GPS verified and five tasks documented. The map is feedback, not the decision. That runs on the server, which is why a modified phone cannot talk its way inside the fence.",
      },
    },
    {
      id: "outcomes",
      heading: "Outcomes",
      body: [
        "RayHealth EVV is live in production at rayhealthevv.com, aligned to Pennsylvania DHS requirements with all Cures Act data elements captured, Sandata submission wired end to end on a schedule, and real 837P and 835 EDI handling. Adding the next state is a registry entry, not a refactor: New Jersey already exists in the codebase as a config object waiting for its production flag.",
        "The delivery pipeline runs seven required CI checks including type checking, security scanning, and a job that verifies the audit triggers still refuse mutations. 1,081 tests keep the compliance math honest, and the operational side is written down rather than improvised: deploy, monitoring, mobile and App Store release runbooks, a risk register, incident response, data retention, and encryption verification all live in the repo.",
      ],
      image: {
        src: "/work/rayhealth-golive.jpg",
        alt: "The go-live readiness checklist: client, caregiver, 837 billing identity, and fee schedule complete, aggregator connection outstanding",
        caption:
          "Onboarding as a gate rather than a wish. An agency cannot bill until the 837 billing identity and the fee schedule are real, and each unfinished item links to the screen that fixes it.",
      },
    },
  ],
  diagram: {
    caption: "A verified visit flowing from the caregiver's phone to the state and the claim.",
    groups: [
      { id: "field", label: "In the field", nodeIds: ["mobile", "queue"] },
      { id: "agency", label: "Agency", nodeIds: ["web"] },
      { id: "backend", label: "Backend", nodeIds: ["api", "geofence", "audit", "bedrock"] },
      { id: "compliance", label: "State and billing", nodeIds: ["sandata", "hha", "claims"] },
    ],
    nodes: [
      {
        id: "mobile",
        label: "Caregiver app",
        tech: "Expo + React Native",
        icon: "Smartphone",
        accent: "aqua",
        col: 0,
        row: 0,
        detail: {
          what: "Clock-in and clock-out with GPS capture, schedules, visit details, and training.",
          why: "One Expo codebase covers iOS and Android; tokens live in the platform keychain via SecureStore.",
          protocol: "REST over HTTPS with short-lived HS256 JWTs",
        },
      },
      {
        id: "queue",
        label: "Offline queue",
        tech: "store and forward",
        icon: "WifiOff",
        accent: "aqua",
        col: 0,
        row: 1,
        detail: {
          what: "Persists punches in AsyncStorage when there is no signal and replays them in order later.",
          why: "Punches are evidence. Only a definitive rejection drops one; the server accepts offline timestamps up to 72 hours old.",
        },
      },
      {
        id: "web",
        label: "Agency console",
        tech: "React + Vite",
        icon: "AppWindow",
        accent: "aqua",
        col: 0,
        row: 2,
        detail: {
          what: "Scheduling, visit review, exceptions, billing, credentialing, and onboarding for coordinators and admins.",
          why: "Coordinators live here all day, so it is a fast Vite SPA using HttpOnly cookie sessions plus CSRF tokens.",
          protocol: "same-site REST with cookies + x-csrf-token",
        },
      },
      {
        id: "api",
        label: "Express API",
        tech: "Express 5 + Knex",
        icon: "Server",
        accent: "iris",
        col: 1,
        row: 1,
        detail: {
          what: "About 190 route handlers composing the core package: EVV, scheduling, billing, learning, and admin.",
          why: "Capability RBAC (18 capabilities, 4 roles) is checked per route. CI fails if string-built SQL appears anywhere.",
        },
      },
      {
        id: "bedrock",
        label: "Copilot",
        tech: "Claude on AWS Bedrock",
        icon: "Bot",
        accent: "iris",
        col: 1,
        row: 0,
        detail: {
          what: "Role-aware assistant for agencies plus a public support chat. Proposes typed actions a human confirms.",
          why: "Bedrock is the only AI vendor with a signed BAA, so the app refuses to boot in prod with any other AI key set. Prompts are logged as hashes, never text.",
          protocol: "generateText via the Vercel AI SDK Bedrock provider",
        },
      },
      {
        id: "geofence",
        label: "Geofence check",
        tech: "Haversine, 150 m",
        icon: "MapPin",
        accent: "ember",
        col: 2,
        row: 0,
        detail: {
          what: "Distance check between the phone's fix and the client's home at clock-in and clock-out.",
          why: "GPS accuracy is deliberately ignored so nobody can borrow meters by spoofing low confidence. Fails open only when a client has no coordinates yet, and that gap is audited.",
        },
      },
      {
        id: "audit",
        label: "Audit log",
        tech: "append-only trigger",
        icon: "Lock",
        accent: "ember",
        col: 2,
        row: 1,
        detail: {
          what: "Every PHI read, write, export, and denial, with correlation ids and a 7-year retention sweep.",
          why: "A database trigger refuses UPDATE and DELETE outright. Audit rows are evidence, even against future admins.",
        },
      },
      {
        id: "db",
        label: "PostgreSQL",
        tech: "~40 tables",
        icon: "Database",
        accent: "neutral",
        col: 2,
        row: 2,
        detail: {
          what: "Visits, schedules, authorizations, claims, learning, audit. Money in integer cents, PHI encrypted per cell.",
          why: "Immutability triggers, timestamptz hardening, and CHECK-constraint enums live in raw SQL because an ORM cannot express 'refuse UPDATE'.",
        },
      },
      {
        id: "sandata",
        label: "Sandata",
        tech: "PA aggregator",
        icon: "Landmark",
        accent: "iris",
        col: 3,
        row: 0,
        detail: {
          what: "State EVV submission: clients, employees, and visits sent as batches, then polled for per-record accept or reject.",
          why: "Visits are deferred until their client and employee records are verified, and resubmissions carry monotonic sequence ids because Sandata requires them.",
          protocol: "REST with HTTP Basic auth, async batch + status polling",
        },
      },
      {
        id: "hha",
        label: "HHAeXchange",
        tech: "CSV export",
        icon: "FileText",
        accent: "neutral",
        col: 3,
        row: 1,
        detail: {
          what: "The second PA aggregator. Currently a portal-ready CSV export with an honest not-yet-automated client.",
          why: "The integration refuses to fake success: until automated submission ships, it tells you to upload the CSV.",
        },
      },
      {
        id: "claims",
        label: "Claims + EDI",
        tech: "837P out, 835 in",
        icon: "Receipt",
        accent: "ember",
        col: 3,
        row: 2,
        detail: {
          what: "Claim generation from verified visits with denial-risk scoring, 837P EDI files out, 835 remittances posted back.",
          why: "Applies the CMS 8-minute rule for units and emits a structurally valid X12 005010X222A1 interchange. Transport is SFTP with a local hash ledger for idempotence.",
          protocol: "ASC X12N 837P/835 over SFTP",
        },
      },
    ],
    edges: [
      { from: "mobile", to: "queue", label: "no signal? queue it", kind: "async" },
      { from: "queue", to: "api", label: "replay in order", kind: "async" },
      { from: "mobile", to: "api", label: "clock-in + GPS" },
      { from: "web", to: "api", label: "review + billing" },
      { from: "api", to: "geofence", label: "distance check" },
      { from: "api", to: "bedrock", label: "copilot ask" },
      { from: "api", to: "audit", label: "every action", kind: "data" },
      { from: "api", to: "db", label: "immutable visits", kind: "data" },
      { from: "api", to: "sandata", label: "visit batches", kind: "async" },
      { from: "api", to: "hha", label: "CSV export" },
      { from: "db", to: "claims", label: "verified visits", kind: "data" },
    ],
  },
  stack: ["TypeScript", "React", "Vite", "Node.js", "Express 5", "PostgreSQL", "Knex", "Expo", "AWS Bedrock", "Turborepo", "Vercel"],
  results: [
    { value: "Live", label: "In production at rayhealthevv.com" },
    { value: "1,081", label: "Tests across core, app, web and mobile" },
    { value: "7 yrs", label: "Audit retention, beyond the HIPAA floor" },
    { value: "837P", label: "Real X12 EDI claims out, 835 remits in" },
  ],
  links: {
    live: "https://rayhealthevv.com",
    app: { href: "https://app.rayhealthevv.com", label: "Ray Admin console" },
  },
  chat: {
    suggestedQuestions: [
      "How does GPS visit verification actually work?",
      "What makes the audit log tamper-proof?",
      "How do visits turn into Medicaid claims?",
    ],
    extraKnowledge: [
      "Monorepo: Turborepo + npm workspaces, four packages (core, app, web, mobile). Core is the only package that touches the database. Node 22 in CI.",
      "Auth: three modes resolved by one middleware. Web uses HttpOnly cookies whose values are stored only as hashes. Mobile JWTs are pinned to HS256 and must carry a jti backed by a revocable session row. Cron requests use a bearer secret.",
      "Supported HCPCS service codes: T1019, S5125, T1004, T1021, enforced by a database CHECK constraint. Clock-in opens 5 minutes before the scheduled start.",
      "The state strategy registry means each state is a config entry: Pennsylvania is production-ready with a choice of Sandata or HHAeXchange, New Jersey exists with HHAeXchange forced and a 75 meter geofence but is not production-enabled yet.",
      "Fun edge case: if GPS is completely dead at clock-out, the app falls back to coordinates 0,0 so a caregiver is never trapped in an open visit. The server just knows not to call that one GPS verified.",
      "PHI cell encryption uses AES-256-GCM with a random IV per write, which means the same value encrypts differently every time, so imports deduplicate on an external id instead of on PHI.",
    ].join("\n"),
  },
  seo: {
    schemaType: "SoftwareApplication",
    description:
      "Deep dive into RayHealth EVV, a production Electronic Visit Verification platform: GPS-verified visits, an append-only audit log, Sandata state submission, and real 837P/835 EDI billing.",
  },
};
