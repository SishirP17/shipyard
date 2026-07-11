import { ImageResponse } from "next/og";
import { SITE, PROFILE } from "@/lib/content";

// Branded social-share card, generated at build/request time (1200×630).
// Shows when the site is shared on LinkedIn, X, iMessage, Slack, etc.

export const alt = `${SITE.name} · ${PROFILE.name}, ${PROFILE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#06070d",
          backgroundImage:
            "linear-gradient(135deg, rgba(138,99,255,0.18), transparent 45%), linear-gradient(315deg, rgba(63,214,240,0.10), transparent 40%)",
          padding: 80,
        }}
      >
        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundImage: "linear-gradient(135deg, #8a63ff, #5f31d6)",
              color: "white",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            {"</>"}
          </div>
          <div style={{ display: "flex", color: "white", fontSize: 34, fontWeight: 600, marginLeft: 18 }}>
            {SITE.name}
          </div>
        </div>

        {/* Identity */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", color: "white", fontSize: 92, fontWeight: 700, letterSpacing: -2 }}>
            {PROFILE.name}
          </div>
          <div style={{ display: "flex", width: 120, height: 5, borderRadius: 4, backgroundColor: "#8a63ff", marginTop: 22 }} />
          <div style={{ display: "flex", color: "#c4b1ff", fontSize: 40, marginTop: 26 }}>{PROFILE.role}</div>
          <div style={{ display: "flex", color: "#94a0b8", fontSize: 30, marginTop: 14 }}>
            I build AI-powered software that ships.
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", color: "#5a6478", fontSize: 24 }}>
          {SITE.url.replace("https://", "")}
        </div>
      </div>
    ),
    { ...size }
  );
}
