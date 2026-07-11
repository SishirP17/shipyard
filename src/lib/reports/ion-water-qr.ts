import type { ProjectReport } from "@/lib/reports/types";

// LIGHT report: this project predates my local archives, so it sticks to
// what actually shipped rather than reconstructed detail.
export const REPORT: ProjectReport = {
  slug: "ion-water-qr",
  title: "ION Water QR",
  tagline: "QR-driven client intake for a real Louisville business.",
  year: "2025",
  role: "Front-end lead on a 4-person capstone team",
  treatment: "light",
  intro:
    "ION Water QR was my University of Louisville capstone: a web app that replaced a local water company's paper intake forms with QR codes that open the right digital form, feeding straight into their backend. Real client, real deadline, real users who did not care that we were students.",
  sections: [
    {
      id: "overview",
      heading: "Overview",
      body: [
        "Louisville ION Water ran client intake on paper: forms got lost, handwriting got misread, and someone had to retype everything. We built a Next.js app where each service scenario gets a QR code that opens the matching form, validates it, and submits it to a SQL backend.",
        "I led the front end: dynamic routing per form type, QR code generation, reusable form components, and mobile-responsive layouts, since nearly everyone scanned from a phone.",
      ],
    },
    {
      id: "problem",
      heading: "The problem",
      body: [
        "Paper intake was slow to process and error-prone, and the errors landed in customer records. The fix had to be something a non-technical customer could use in a parking lot on a phone with one bar of signal, with no app install and no account.",
        "QR codes fit perfectly: print one sticker per scenario, and the right form is one scan away.",
      ],
    },
    {
      id: "build",
      heading: "The build",
      body: [
        "React and Next.js with Tailwind on the front, a SQL backend behind an API layer, deployed on Vercel. Environment variables kept credentials out of the client, and we spent honest time on CORS and API security, the classic first-deployment rites of passage.",
        "Working as a four-person team for an external client meant requirements meetings, scope negotiation, and shipping something the client could run without us. That part taught as much as the code did.",
      ],
    },
    {
      id: "outcomes",
      heading: "Outcomes",
      body: [
        "Shipped on Vercel and handed off to the client. Paper forms out, scannable intake in.",
        "It was the first project where I owned a production front end end to end, and the one that made the 'build the whole thing and ship it' habit stick.",
      ],
    },
  ],
  diagram: {
    caption: "One scan, one form, straight to the database.",
    nodes: [
      {
        id: "qr",
        label: "QR codes",
        tech: "per service scenario",
        icon: "QrCode",
        accent: "aqua",
        col: 0,
        row: 0,
        detail: {
          what: "Printed codes that deep-link to the right intake form for each service scenario.",
          why: "No app install, no typing a URL. A scan from any phone camera lands on the exact form.",
        },
      },
      {
        id: "web",
        label: "Next.js app",
        tech: "React + Tailwind",
        icon: "AppWindow",
        accent: "aqua",
        col: 1,
        row: 0,
        detail: {
          what: "Dynamic routes per form type, reusable validated form components, mobile-first layouts.",
          why: "Dynamic routing meant one form engine served every scenario instead of one page per form.",
        },
      },
      {
        id: "api",
        label: "API layer",
        tech: "secured endpoints",
        icon: "Server",
        accent: "iris",
        col: 2,
        row: 0,
        detail: {
          what: "Validated submissions and kept credentials server-side behind environment variables.",
          why: "The client-facing app never touches the database directly. CORS and API hardening were part of the handoff.",
          protocol: "HTTPS + JSON",
        },
      },
      {
        id: "db",
        label: "SQL backend",
        tech: "client records",
        icon: "Database",
        accent: "neutral",
        col: 3,
        row: 0,
        detail: {
          what: "Stores intake submissions as structured records instead of retyped paper.",
          why: "Typed rows beat handwriting. The whole point of the project lives in this box.",
        },
      },
    ],
    edges: [
      { from: "qr", to: "web", label: "scan opens form" },
      { from: "web", to: "api", label: "validated submit" },
      { from: "api", to: "db", label: "intake record", kind: "data" },
    ],
  },
  stack: ["React", "Next.js", "Tailwind", "SQL", "Vercel"],
  results: [
    { value: "4", label: "Person capstone team, real external client" },
    { value: "0", label: "Paper forms after launch" },
    { value: "Live", label: "Shipped on Vercel and handed off" },
  ],
  seo: {
    schemaType: "SoftwareApplication",
    description:
      "ION Water QR: a QR-driven client intake web app built as a University of Louisville capstone for a real Louisville business, replacing paper forms with scannable digital intake.",
  },
};
