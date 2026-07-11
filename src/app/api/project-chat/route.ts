import { NextResponse } from "next/server";
import { REPORTS } from "@/lib/reports";
import { buildKnowledge } from "@/lib/reports/knowledge";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Per-project AI chat, grounded in the same report content the page renders.
 * Streams plain text back to the widget. Costs are bounded by hard message
 * caps + max_tokens, with a best-effort rate limit on top.
 */

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 1000;
const MAX_TOTAL_USER_CHARS = 4000;

/* Best-effort fixed-window rate limit. Serverless caveat: this Map lives per
   warm instance, so it stops bursts, not distributed abuse. The real cost
   ceiling is the message caps above plus max_tokens below. */
const WINDOW_MS = 5 * 60 * 1000;
const WINDOW_LIMIT = 10;
const MAX_BUCKETS = 500;
const buckets = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    if (buckets.size >= MAX_BUCKETS) {
      const oldest = buckets.keys().next().value;
      if (oldest) buckets.delete(oldest);
    }
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > WINDOW_LIMIT;
}

function systemPrompt(knowledge: string): string {
  return [
    "You are the project guide on Sishir Phuyal's portfolio site, Shipyard.",
    "You answer questions about exactly one project, described in the report below.",
    "Rules:",
    "- Only discuss this project. If asked about anything else, say that you only cover this project and steer back, in one friendly sentence.",
    "- Ground every answer in the report. If the report does not cover something, say so plainly instead of guessing. Never invent details.",
    "- Sound like a human engineer explaining their work: natural, concise, mid-level technical depth. A little light humor is welcome, but keep it subtle.",
    "- Never use em dashes. Never use a hyphen as sentence punctuation. Hyphens inside compound words are fine.",
    "- Keep answers short: a few sentences for simple questions, a short paragraph or two for deep ones.",
    "",
    "PROJECT REPORT:",
    knowledge,
  ].join("\n");
}

export async function POST(req: Request) {
  let body: { slug?: unknown; messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug : "";
  const report = REPORTS[slug];
  if (!report || !report.chat) {
    return NextResponse.json({ ok: false, error: "Unknown project." }, { status: 404 });
  }

  const raw = Array.isArray(body.messages) ? body.messages : null;
  if (!raw || raw.length === 0 || raw.length > MAX_MESSAGES) {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }
  const messages: ChatMessage[] = [];
  let totalUserChars = 0;
  for (const m of raw) {
    const role = (m as ChatMessage)?.role;
    const content = (m as ChatMessage)?.content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") {
      return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
    }
    if (content.length > MAX_MESSAGE_CHARS) {
      return NextResponse.json({ ok: false, error: "Message too long." }, { status: 400 });
    }
    if (role === "user") totalUserChars += content.length;
    messages.push({ role, content });
  }
  if (totalUserChars > MAX_TOTAL_USER_CHARS || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "Chat isn't configured yet." },
      { status: 503 }
    );
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many questions at once. Try again in a few minutes." },
      { status: 429 }
    );
  }

  const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      stream: true,
      max_tokens: 600,
      temperature: 0.5,
      messages: [{ role: "system", content: systemPrompt(buildKnowledge(report)) }, ...messages],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { ok: false, error: "Chat is having a moment. Try again shortly." },
      { status: 502 }
    );
  }

  /* Re-stream OpenAI's SSE as plain text tokens so the client reader stays
     trivial. */
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let carry = "";
  const transform = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      carry += decoder.decode(chunk, { stream: true });
      const lines = carry.split("\n");
      carry = lines.pop() ?? "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") continue;
        try {
          const parsed = JSON.parse(payload);
          const token = parsed?.choices?.[0]?.delta?.content;
          if (typeof token === "string" && token) controller.enqueue(encoder.encode(token));
        } catch {
          // partial or non-JSON keepalive line; ignore
        }
      }
    },
  });

  return new Response(upstream.body.pipeThrough(transform), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
