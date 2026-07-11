/**
 * Server-only helper that flattens a ProjectReport into a markdown knowledge
 * document for the project chat's system prompt. Because it serializes the
 * same object the page renders, the chat can never drift from the page.
 */

import type { ProjectReport } from "@/lib/reports/types";

export function buildKnowledge(report: ProjectReport): string {
  const lines: string[] = [];

  lines.push(`# ${report.title}`);
  lines.push(report.tagline);
  lines.push(`Year: ${report.year}. Role: ${report.role}.`);
  if (report.links?.live) lines.push(`Live at: ${report.links.live}`);
  lines.push("");
  lines.push(report.intro);

  for (const section of report.sections) {
    lines.push("");
    lines.push(`## ${section.heading}`);
    lines.push(...section.body);
  }

  lines.push("");
  lines.push("## Architecture components");
  for (const node of report.diagram.nodes) {
    const tech = node.tech ? ` (${node.tech})` : "";
    lines.push(`- ${node.label}${tech}: ${node.detail.what} Why this choice: ${node.detail.why}${node.detail.protocol ? ` Protocol: ${node.detail.protocol}` : ""}`);
  }
  lines.push("");
  lines.push("## How components connect");
  for (const edge of report.diagram.edges) {
    const from = report.diagram.nodes.find((n) => n.id === edge.from)?.label ?? edge.from;
    const to = report.diagram.nodes.find((n) => n.id === edge.to)?.label ?? edge.to;
    lines.push(`- ${from} -> ${to}${edge.label ? `: ${edge.label}` : ""}`);
  }

  lines.push("");
  lines.push("## Tech stack");
  lines.push(report.stack.join(", "));

  lines.push("");
  lines.push("## Key facts");
  for (const r of report.results) {
    lines.push(`- ${r.label}: ${r.value}`);
  }

  if (report.chat?.extraKnowledge) {
    lines.push("");
    lines.push("## Additional context");
    lines.push(report.chat.extraKnowledge);
  }

  return lines.join("\n");
}
