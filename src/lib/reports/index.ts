/**
 * Deep-dive report registry. SERVER-ONLY: import this from server components,
 * route handlers, and metadata code. Client components must import
 * reports/slugs.ts instead (see the note there about bundle size).
 */

import type { ProjectReport } from "@/lib/reports/types";
import { REPORT as rayhealthEvv } from "@/lib/reports/rayhealth-evv";
import { REPORT as helixStudio } from "@/lib/reports/helix-studio";
import { REPORT as chalk } from "@/lib/reports/chalk";
import { REPORT as rayverify } from "@/lib/reports/rayverify";
import { REPORT as roamkit } from "@/lib/reports/roamkit";
import { REPORT as ionWaterQr } from "@/lib/reports/ion-water-qr";

export type { ProjectReport } from "@/lib/reports/types";

export const REPORTS: Record<string, ProjectReport> = {
  [rayhealthEvv.slug]: rayhealthEvv,
  [helixStudio.slug]: helixStudio,
  [chalk.slug]: chalk,
  [rayverify.slug]: rayverify,
  [roamkit.slug]: roamkit,
  [ionWaterQr.slug]: ionWaterQr,
};
