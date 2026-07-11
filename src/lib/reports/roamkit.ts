import type { ProjectReport } from "@/lib/reports/types";

export const REPORT: ProjectReport = {
  slug: "roamkit",
  title: "Roamkit",
  tagline: "A travel toolkit that keeps working when your signal does not.",
  year: "2026",
  role: "Solo: product, design and mobile",
  treatment: "full",
  intro:
    "Roamkit is an offline-first travel app: one Expo codebase shipping to iOS, Android, and the web, packed with the tools you actually reach for abroad. Currency and unit converters, tip and split, a world clock, a phrasebook that speaks, a real LED flashlight with SOS, sun times, a compass, a trip budget, and a 57-article survival guide. Every single one works in airplane mode, which is the entire point.",
  sections: [
    {
      id: "overview",
      heading: "Overview",
      body: [
        "Roamkit is built with Expo and Expo Router, React Native 0.85, and React 19. The home screen is a grid of tools driven by a single catalog file, so adding a tool is a data entry plus a route. A dark navy design system with per-tool identity colors keeps it feeling like one product instead of eleven small ones.",
        "Monetization is a one-time 4.99 Pro unlock through RevenueCat: no subscription, no ads, no tracking. The production build is through Google Play review with real billing enabled.",
      ],
    },
    {
      id: "problem",
      heading: "The problem",
      body: [
        "Travel utilities fail exactly when you need them: at customs with no SIM, in a mountain town with one bar, on a plane. Most currency apps are a thin skin over an API call, so offline they show you a spinner and an apology.",
        "The requirement was strict: every tool must produce a correct, honest answer with zero connectivity, and clearly label how fresh its data is.",
      ],
    },
    {
      id: "architecture",
      heading: "Three tiers of truth",
      body: [
        "The heart of the app is the rate store, a three-tier fallback for exchange rates. Tier one is a bundled snapshot that ships inside the JS bundle itself, so conversion works on the very first launch with the network off. Tier two is the last successful fetch, cached on-device. Tier three is a live refresh from a keyless public rate API when the app is online and the data is stale.",
        "Reads never touch the network: the store returns the best available table instantly (memory, then cache, then bundled), and refreshes happen silently in the background. Concurrent screens share one in-flight request, and staleness is defined as older than 12 hours or past the feed's own advertised next-update time. The footer always tells the truth: live rates, saved rates, or built-in rates as of a date.",
      ],
    },
    {
      id: "stack-choices",
      heading: "Why this stack",
      body: [
        "Expo earns its keep here because the tools lean hard on device hardware through one API surface: the flashlight drives the actual LED torch through the camera module, the compass reads the OS fused heading with a raw magnetometer fallback, sun times come from GPS plus pure astronomy math, and the phrasebook speaks through on-device text-to-speech. No servers, no accounts, no backend at all.",
        "Offline needs no cleverness for most tools: unit conversion is ratio math, the world clock uses the IANA timezone database already baked into the JavaScript engine, phrases are a static array, and sunrise math is an almanac formula. The only tool that genuinely needs the internet sometimes is currency, which is why it got the three-tier treatment.",
      ],
    },
    {
      id: "services",
      heading: "The tools, briefly",
      body: [
        "Currency converts and compares 30 curated currencies, expandable to 162 with Pro. Tip and split has a round-up-per-person mode that folds the rounding back into the tip so the rows still sum, because a split that does not add up is a bar argument waiting to happen. The flashlight has light, strobe, and SOS modes, and the SOS is real ITU Morse timing: 220 millisecond units, three-unit dashes, hand-sequenced dots and dashes.",
        "The phrasebook covers 20 essential phrases in 9 languages with tap-to-copy and tap-to-hear. The survival guide is 57 plainly written offline articles with a stop-word-stripping search, including such timeless advice as not chasing the snake that just bit you for a photo.",
      ],
    },
    {
      id: "data-flow",
      heading: "One conversion, offline and online",
      body: [
        "Offline first launch: the currency screen mounts, the rate store finds no memory or cache, normalizes the bundled snapshot, and converts through a USD pivot: amount divided by the source rate, times the target rate. A locale-tolerant parser handles both comma and dot decimals, because Android keyboards enjoy chaos, and an earlier naive parse could be off by a factor of a thousand on money. That one got fixed with prejudice.",
        "Online, the same mount triggers a silent refresh: if the table is stale, one 8-second-capped fetch updates memory and cache, results recompute live, and the footer flips to live rates. The trip budget tool reuses the exact same store and conversion path, so an expense logged in yen converts with the same honesty rules as the converter.",
      ],
    },
    {
      id: "security",
      heading: "Privacy and the Pro gate",
      body: [
        "There is no account and no analytics, and the camera permission exists solely to switch on the torch: the store listing and permission copy both promise no photos, ever, and the code never opens a preview. Android permissions that Play flags as risky are explicitly blocked in the app config.",
        "The Pro unlock is guarded by a three-way gate: billing must be enabled, a platform RevenueCat key must exist, and only then can a purchase grant the entitlement. On the static web build neither condition holds, so Pro simply cannot be granted there, even by hand-editing local storage. RevenueCat itself is lazy-loaded so development builds without native billing modules run untouched.",
      ],
    },
    {
      id: "challenges",
      heading: "Challenges and honest tradeoffs",
      body: [
        "Cross-platform hardware is where the fun lives. The web has no LED, so the flashlight falls back to a max-brightness white screen. The compass on some devices throws on the fused heading API, so a raw magnetometer path smooths the vector, not the angle, because averaging angles across the 359-to-0 wrap does exciting things to a compass needle.",
        "The bundled data is kept deliberately small: 30 rates in the bundle rather than all 162, with the full catalog resolved through a few kilobytes of name-and-flag metadata. And the SOS screen refuses to let the phone sleep, because a sleep timer killing your distress signal is the kind of bug you only get to ship once.",
      ],
    },
    {
      id: "outcomes",
      heading: "Outcomes",
      body: [
        "Roamkit is feature-complete for v1: ten live tools plus the survival guide, a coherent design system, and a web build on Vercel from the same codebase. The production Android build is in Google Play review with real billing enabled and testers onboard.",
        "The offline-first architecture proved itself in the details: one shared rate store powers two tools, network usage dropped to roughly one call per day, and every screen can tell you exactly how much to trust the number it just showed you.",
      ],
    },
  ],
  diagram: {
    caption: "Reads never wait on the network; refresh happens quietly in the background.",
    groups: [
      { id: "app", label: "One Expo codebase", nodeIds: ["app", "tools", "device"] },
      { id: "rates", label: "Offline-first rates", nodeIds: ["store", "bundled", "cache", "feed"] },
    ],
    nodes: [
      {
        id: "app",
        label: "Expo app",
        tech: "iOS + Android + web",
        icon: "Smartphone",
        accent: "ember",
        col: 0,
        row: 1,
        detail: {
          what: "Expo Router file-based screens, a tool-grid home, and a shared dark navy design system.",
          why: "One codebase, three platforms. The tool catalog is data, so a new tool is an entry plus a route.",
        },
      },
      {
        id: "tools",
        label: "Tool grid",
        tech: "10 tools + survival guide",
        icon: "Compass",
        accent: "ember",
        col: 1,
        row: 0,
        detail: {
          what: "Currency, units, tip and split, world clock, phrasebook, flashlight and SOS, sun times, compass, trip budget, survival.",
          why: "Everything answers offline: ratio math, the built-in IANA timezone data, static phrases, and almanac astronomy need no network.",
        },
      },
      {
        id: "device",
        label: "Device APIs",
        tech: "torch, GPS, TTS, sensors",
        icon: "Flashlight",
        accent: "aqua",
        col: 1,
        row: 2,
        detail: {
          what: "LED torch via the camera module, fused heading plus magnetometer, GPS for sun times, speech synthesis for phrases.",
          why: "The camera permission exists only to flip the torch on. No photos, no preview, and the privacy copy says so.",
        },
      },
      {
        id: "rc",
        label: "RevenueCat",
        tech: "$4.99 one-time",
        icon: "Coins",
        accent: "iris",
        col: 0,
        row: 2,
        detail: {
          what: "The Pro unlock: trip budget, compass, full currency catalog, and phrasebook audio beyond the free languages.",
          why: "One-time purchase, no subscription. A three-way gate means the web build can never hand out Pro for free.",
          protocol: "native in-app billing via RevenueCat",
        },
      },
      {
        id: "store",
        label: "Rate store",
        tech: "three-tier fallback",
        icon: "RefreshCw",
        accent: "ember",
        col: 2,
        row: 1,
        detail: {
          what: "Returns the best available rate table instantly and refreshes silently when online and stale.",
          why: "Reads never touch the network. Staleness is 12 hours or the feed's own next-update time, and concurrent screens share one request.",
        },
      },
      {
        id: "bundled",
        label: "Bundled snapshot",
        tech: "ships in the app",
        icon: "Package",
        accent: "aqua",
        col: 3,
        row: 0,
        detail: {
          what: "30 curated USD-based rates compiled into the JS bundle itself.",
          why: "First launch in airplane mode still converts correctly, labeled honestly with the snapshot date.",
        },
      },
      {
        id: "cache",
        label: "AsyncStorage cache",
        tech: "last known rates",
        icon: "HardDrive",
        accent: "aqua",
        col: 3,
        row: 1,
        detail: {
          what: "The most recent successful fetch, persisted on-device.",
          why: "Yesterday's real rates beat a spinner. The footer says 'saved rates' so nobody is misled.",
        },
      },
      {
        id: "feed",
        label: "Rate feed",
        tech: "open.er-api.com",
        icon: "Globe",
        accent: "neutral",
        col: 3,
        row: 2,
        detail: {
          what: "A free, keyless USD-based exchange rate API, fetched with an 8-second timeout.",
          why: "No API key means nothing to leak and nothing to expire. Any failure just falls back a tier.",
          protocol: "HTTPS GET, roughly once a day",
        },
      },
    ],
    edges: [
      { from: "app", to: "tools", label: "tool catalog" },
      { from: "app", to: "device", label: "hardware" },
      { from: "app", to: "rc", label: "Pro unlock" },
      { from: "tools", to: "store", label: "convert()" },
      { from: "store", to: "bundled", label: "first launch", kind: "data" },
      { from: "store", to: "cache", label: "last known", kind: "data" },
      { from: "store", to: "feed", label: "silent refresh", kind: "async" },
    ],
  },
  stack: ["React Native", "Expo", "Expo Router", "AsyncStorage", "RevenueCat", "EAS", "react-native-web", "Vercel"],
  results: [
    { value: "10", label: "Tools, all working offline" },
    { value: "57", label: "Offline survival guide articles" },
    { value: "~1/day", label: "Network calls after the rate store refactor" },
    { value: "$4.99", label: "One-time Pro. No subscription, no ads" },
  ],
  chat: {
    suggestedQuestions: [
      "How does offline-first currency conversion work?",
      "How does the flashlight SOS actually signal?",
      "How does one codebase ship to three platforms?",
    ],
    extraKnowledge: [
      "Numbers: 30 bundled currencies, 162 in the full catalog, 20 phrases in 9 languages across 4 categories, 27 world clock cities, 25 units across 4 categories, 57 survival articles in 11 categories.",
      "SOS timing: one Morse unit is 220 ms, dashes are exactly 3 units, letter gaps 2, word gaps 4. Strobe runs at 120 ms. The screen stays awake during SOS on purpose.",
      "Conversion is USD-pivoted: amount divided by the source rate times the target rate. The locale-tolerant amount parser exists because a naive comma-to-dot replace once made conversions wrong by around 1000x.",
      "Pro gating: fully locked tools are trip budget and compass; phrasebook audio is free for English, Spanish, and Hindi; adding currencies beyond the curated 30 is Pro.",
      "The compass smooths the raw magnetometer x and y vector with a low-pass filter instead of smoothing the angle, which avoids the wraparound problem at north.",
      "Free tier: currency, units, tip and split, world clock, phrasebook, flashlight and SOS, sun times, and the survival guide.",
    ].join("\n"),
  },
  seo: {
    schemaType: "CreativeWork",
    description:
      "Deep dive into Roamkit, an offline-first travel toolkit built with Expo: a three-tier exchange rate store, real hardware tools, and ten utilities that all work in airplane mode.",
  },
};
