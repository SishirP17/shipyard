import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

/**
 * Design tokens for the portfolio.
 *
 * Shares lineage with the ghimtech carbon system (CSS-var driven shadcn
 * tokens, glassy dark surfaces) but deliberately diverges:
 *   - accent is IRIS / violet, with a cool CYAN secondary (not blue+emerald)
 *   - surfaces lean a touch cooler ("slate carbon")
 *   - motifs are builder/terminal, not military HUD
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // shadcn-style semantic tokens, driven by CSS vars in globals.css.
        // Space-separated RGB channels so `text-foreground/60` alpha works.
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        // Slate-carbon surfaces — slightly cooler than pure carbon
        slate: {
          950: "#06070d",
          900: "#0a0c14",
          850: "#0e111b",
          800: "#131726",
          750: "#191e30",
          700: "#222840",
          600: "#323a59",
          500: "#4a5478",
        },
        // Iris / violet — primary accent (the "signal" of this brand)
        iris: {
          50: "#f1edff",
          100: "#e0d6ff",
          200: "#c4b1ff",
          300: "#a487ff",
          400: "#8a63ff",
          500: "#7445f5",
          600: "#5f31d6",
          700: "#4a23ad",
          glow: "#8a63ff",
        },
        // Cyan / aqua — cool secondary
        aqua: {
          50: "#e3fbff",
          100: "#baf3ff",
          200: "#7fe7fb",
          300: "#3fd6f0",
          400: "#16bfdd",
          500: "#0a9cb8",
          600: "#067a92",
          glow: "#3fd6f0",
        },
        // Warm amber — sparing highlight (awards, "now")
        ember: {
          400: "#ffb454",
          500: "#f59e2b",
        },
      },
      fontFamily: {
        // Geometric display + clean grotesk body + mono for code/labels
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        hero: ["clamp(2.75rem, 7vw, 5.75rem)", { lineHeight: "1.0", letterSpacing: "-0.035em", fontWeight: "600" }],
        display: ["clamp(1.9rem, 4.5vw, 3.25rem)", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "600" }],
        title: ["clamp(1.4rem, 2.6vw, 2rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
      },
      letterSpacing: {
        tightest: "-0.05em",
        widelabel: "0.22em",
      },
      boxShadow: {
        "glow-iris": "0 0 40px -10px rgba(138, 99, 255, 0.45), 0 0 90px -20px rgba(138, 99, 255, 0.22)",
        "glow-aqua": "0 0 40px -10px rgba(63, 214, 240, 0.4), 0 0 90px -20px rgba(63, 214, 240, 0.18)",
        panel: "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 0 0 1px rgba(255,255,255,0.06), 0 30px 60px -30px rgba(0,0,0,0.85)",
      },
      backgroundImage: {
        "dot-grid":
          "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
        "iris-radial":
          "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(138,99,255,0.18), transparent 70%)",
        noise:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        "dot-sm": "22px 22px",
        "dot-md": "34px 34px",
      },
      keyframes: {
        pulse_iris: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 0 0 rgba(138,99,255,0.6)" },
          "50%": { opacity: "0.85", boxShadow: "0 0 0 7px rgba(138,99,255,0)" },
        },
        pulse_aqua: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 0 0 rgba(63,214,240,0.6)" },
          "50%": { opacity: "0.85", boxShadow: "0 0 0 7px rgba(63,214,240,0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "pulse-iris": "pulse_iris 2.4s ease-in-out infinite",
        "pulse-aqua": "pulse_aqua 2.4s ease-in-out infinite",
        marquee: "marquee 38s linear infinite",
        floaty: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 3.2s linear infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
