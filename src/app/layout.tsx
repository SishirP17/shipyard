import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { SITE, PROFILE } from "@/lib/content";
import "./globals.css";

// Type system — Space Grotesk (geometric display) + Inter (body)
// + JetBrains Mono (labels / code). Self-hosted via next/font.
const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: `${SITE.name} — ${PROFILE.name}, ${PROFILE.role}`,
    template: `%s · ${SITE.name}`,
  },
  description: PROFILE.summary,
  keywords: [PROFILE.name, "software engineer", "portfolio", "projects", ...PROFILE.skills.flatMap((s) => s.items)],
  authors: [{ name: PROFILE.name }],
  creator: PROFILE.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    title: `${SITE.name} — ${PROFILE.name}, ${PROFILE.role}`,
    description: PROFILE.summary,
    siteName: SITE.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${PROFILE.name}`,
    description: PROFILE.summary,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#06070d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        {/* Ambient grain — fixed, never scrolls */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 bg-noise opacity-[0.3] mix-blend-overlay"
        />
        {children}
      </body>
    </html>
  );
}
