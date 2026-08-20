/**
 * ============================================================================
 *  Project deep-dive reports: types.
 *
 *  A ProjectReport is the long-form model behind every /work/[slug] page.
 *  It replaces the old CaseStudy model and adds an interactive architecture
 *  diagram plus optional AI chat grounding.
 *
 *  Writing rules for all report prose:
 *   - No em dashes. No hyphens used as punctuation to join clauses.
 *   - Human, natural tone. Mid-level technical depth. Light humor welcome.
 * ============================================================================
 */

export type Accent = "iris" | "aqua" | "ember";
export type NodeAccent = Accent | "neutral";

export type ReportImage = { src: string; alt: string; caption?: string };

/** A short clip embedded in a section. Vertical clips are fine: the player
 *  constrains by height so a 9:16 does not swallow the article column. */
export type ReportVideo = {
  src: string;
  /** Frame shown before playback. Without one the browser picks whatever it
   *  decodes first, which on a dark opening is usually a black rectangle. */
  poster?: string;
  alt: string;
  caption?: string;
};

export type ReportSection = {
  id: string;
  heading: string;
  body: string[];
  /** Screenshot shown inside this section, under its prose. Prefer this over
   *  the page-level `gallery` so a shot sits next to what it illustrates. */
  image?: ReportImage;
  /** Clip shown inside this section, under its prose and any image. */
  video?: ReportVideo;
};
export type ReportResult = { value: string; label: string };

/**
 * One box in the architecture diagram. Positioned on a logical grid
 * (col/row); the renderer converts that to SVG coordinates.
 * `icon` is a lucide icon NAME as a string so the data can cross the
 * server/client boundary (component references are not serializable).
 */
export type DiagramNode = {
  id: string;
  label: string;
  tech?: string;
  icon?: string;
  accent: NodeAccent;
  col: number;
  row: number;
  span?: number;
  detail: {
    what: string;
    why: string;
    protocol?: string;
  };
};

export type DiagramEdge = {
  from: string;
  to: string;
  label?: string;
  kind?: "sync" | "async" | "data";
};

/** Optional swim lane grouping a set of nodes (e.g. "Mobile", "Backend"). */
export type DiagramGroup = { id: string; label: string; nodeIds: string[] };

export type DiagramData = {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  groups?: DiagramGroup[];
  caption?: string;
};

export type ProjectReport = {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  /** "full" reports get the 9-section deep dive; "light" a shorter format. */
  treatment: "full" | "light";
  cover?: ReportImage;
  intro: string;
  sections: ReportSection[];
  diagram: DiagramData;
  gallery?: ReportImage[];
  stack: string[];
  results: ReportResult[];
  links?: {
    live?: string;
    repo?: string;
    /** A second product surface, e.g. the signed-in console behind a marketing site. */
    app?: { href: string; label: string };
  };
  /** Omit to hide the "Ask about this project" chat on the page. */
  chat?: {
    suggestedQuestions: string[];
    /** Extra facts for the chat that are not rendered on the page. */
    extraKnowledge?: string;
  };
  seo: {
    schemaType: "SoftwareApplication" | "CreativeWork";
    description: string;
  };
};
