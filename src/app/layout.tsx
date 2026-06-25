import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ScaredyPanda } from "@/components/shared/scaredy-panda";
import { PandaProvider } from "@/components/shared/panda-context";
import { SITE, PROFILE, SOCIALS } from "@/lib/content";
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
  metadataBase: new URL(SITE.url),
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
    url: SITE.url,
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

// Structured data — helps search engines show a richer result for your name.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PROFILE.name,
  jobTitle: PROFILE.role,
  url: SITE.url,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Louisville",
    addressRegion: "KY",
    addressCountry: "US",
  },
  sameAs: SOCIALS.filter((s) => s.label !== "Email").map((s) => s.href),
  knowsAbout: PROFILE.skills.flatMap((s) => s.items),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {/* Ambient grain — fixed, never scrolls */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 bg-noise opacity-[0.3] mix-blend-overlay"
        />
        <PandaProvider>
          {children}
          <ScaredyPanda />
        </PandaProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
