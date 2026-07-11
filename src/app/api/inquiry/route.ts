import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const RECIPIENT = "sishir.phuyal03@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function esc(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const types = Array.isArray(data.types) ? (data.types as string[]) : [];
  const timeline = String(data.timeline ?? "");
  const budget = String(data.budget ?? "");
  const name = String(data.name ?? "").slice(0, 120);
  const email = String(data.email ?? "").slice(0, 200);
  const message = String(data.message ?? "").slice(0, 4000);
  const company = String(data.company ?? ""); // honeypot

  // Bots fill hidden fields — silently accept and drop.
  if (company) return NextResponse.json({ ok: true });

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "Email service isn't configured yet." },
      { status: 503 }
    );
  }

  const subject = `New project inquiry${types.length ? ": " + types.join(", ") : ""}`;

  const text = [
    `New project inquiry from ${name || "someone"} (${email})`,
    "",
    `Building: ${types.length ? types.join(", ") : "(not specified)"}`,
    `Timeline: ${timeline || "Flexible / TBD"}`,
    `Budget: ${budget || "Let's discuss"}`,
    "",
    "Message:",
    message || "(none)",
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;color:#111;">
      <h2 style="margin:0 0 4px;">New project inquiry</h2>
      <p style="margin:0 0 16px;color:#555;">via your Shipyard portfolio</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px;">
        <tr><td style="padding:6px 0;color:#888;width:90px;">From</td><td style="padding:6px 0;"><b>${esc(name) || "—"}</b> &lt;${esc(email)}&gt;</td></tr>
        <tr><td style="padding:6px 0;color:#888;">Building</td><td style="padding:6px 0;">${esc(types.join(", ")) || "—"}</td></tr>
        <tr><td style="padding:6px 0;color:#888;">Timeline</td><td style="padding:6px 0;">${esc(timeline) || "—"}</td></tr>
        <tr><td style="padding:6px 0;color:#888;">Budget</td><td style="padding:6px 0;">${esc(budget) || "—"}</td></tr>
      </table>
      <p style="margin:16px 0 4px;color:#888;font-size:14px;">Message</p>
      <p style="margin:0;white-space:pre-wrap;font-size:14px;line-height:1.6;">${esc(message) || "(none)"}</p>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Shipyard <onboarding@resend.dev>",
      to: [RECIPIENT],
      replyTo: email,
      subject,
      text,
      html,
    });
    if (error) {
      return NextResponse.json(
        { ok: false, error: "Couldn't send right now." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Couldn't send right now." },
      { status: 502 }
    );
  }
}
