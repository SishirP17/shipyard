/**
 * Slugs that have a deep-dive report at /work/[slug].
 *
 * BUNDLE-CRITICAL: this file must never import report content. It is the only
 * reports module a client component (projects.tsx on the homepage) is allowed
 * to import; pulling in index.ts there would ship every report's text in the
 * homepage JS bundle.
 */
export const REPORT_SLUGS = [
  "rayhealth-evv",
  "helix-studio",
  "chalk",
  "rayverify",
  "roamkit",
  "ion-water-qr",
  "student-ninja",
] as const;

export type ReportSlug = (typeof REPORT_SLUGS)[number];
