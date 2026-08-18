import type { ProjectReport } from "@/lib/reports/types";

export const REPORT: ProjectReport = {
  slug: "chalk",
  title: "Chalk",
  tagline: "Turn any lecture into chapters, notes, and quizzes you can actually study from.",
  year: "2026",
  role: "Solo: product, full-stack and AI pipeline",
  treatment: "full",
  intro:
    "Chalk is an AI lecture-capture platform, live at chalkrecap.com. Record a class, upload a file, or paste a video link, and it hands back a clickable table of contents, study notes, per-chapter quizzes, spaced-repetition flashcards, and a tutor you can ask questions. It launches from Canvas and Moodle, imports straight out of Zoom and Webex, and ships an Android app alongside the web. Under the hood it is a serverless media pipeline that survives being killed mid-job, which is a fun property to need.",
  sections: [
    {
      id: "overview",
      heading: "Overview",
      body: [
        "Chalk is a monorepo with a Next.js 16 web app that carries the entire backend (82 API routes) and an Expo app that is a pure client of it. Storage is Neon serverless Postgres plus Vercel Blob for media, auth is a custom JWT system, billing is Stripe, and transcription runs on Groq's Whisper with OpenAI as the fallback.",
        "The core promise: a two-hour lecture goes in, and a navigable library item comes out, with chapters that jump the video to the right second. Around that core sit the things a real course needs: binders that pull several documents into one study set, LMS launch from Canvas and Moodle, meeting imports from Zoom and Webex, and engagement analytics that show an instructor where the class actually stumbled.",
      ],
      image: {
        src: "/work/chalk-library.jpg",
        alt: "The Chalk library: saved sessions as cards, each tagged with how it arrived and how many chapters it produced",
        caption:
          "The library. Each card carries the badge for how that lecture arrived, from a link or an upload, and the chapter count the pipeline produced.",
      },
    },
    {
      id: "problem",
      heading: "The problem",
      body: [
        "Lecture recordings are where studying goes to die. A two-hour video with no structure means scrubbing around hoping to spot the whiteboard changing. Notes apps do not know what was said, and transcription tools give you a wall of text with no map.",
        "Students need the lecture broken into topics, summarized, and quizzable, without doing any of that work themselves. That is a pipeline problem, not a note-taking problem.",
      ],
    },
    {
      id: "architecture",
      heading: "The processing pipeline",
      body: [
        "Every lecture takes one of three doors in. Uploads go straight from the browser to Vercel Blob using short-lived tokens, because serverless request bodies cap out long before video sizes do. Live recordings stream in as segments that get stitched into one file. YouTube links never download video at all: Chalk pulls the video's own caption track and skips transcription entirely, then plays the video through YouTube's embed.",
        "Then the orchestrator takes over: extract mono 16 kHz audio with ffmpeg, transcribe with Whisper, and hand the transcript to gpt-4o to segment into chapters. Processing runs inside Next.js after(), which keeps working after the response is sent, and an atomic database claim stops two instances from processing the same lecture twice.",
      ],
      image: {
        src: "/work/chalk-upload.png",
        alt: "Chalk's upload screen, one of the ways a lecture enters the pipeline",
        caption: "One of five doors in. Uploads go straight from the browser to blob storage, never through the function.",
      },
    },
    {
      id: "stack-choices",
      heading: "Why this stack",
      body: [
        "Neon's serverless Postgres driver speaks HTTP, which fits functions that appear and vanish constantly. The schema lives in code as a versioned migration array with idempotent DDL, because two racing instances both have to be safe to run the bootstrap. Vercel Blob stores raw media, stitched recordings, exported clips, and thumbnails.",
        "ffmpeg ships as a static binary and gets spawned directly as a CLI, no wrapper library, which means fewer moving parts and no binary-path weirdness on Windows. Auth is deliberately homegrown but small: bcrypt password hashing, HS256 JWTs signed with jose, delivered as an HttpOnly cookie for web and a bearer header for mobile, with a token version claim so plan changes and forced sign-outs propagate within about two minutes.",
      ],
    },
    {
      id: "cost",
      heading: "Routing models by what the work actually is",
      body: [
        "Chalk started on two pinned OpenAI models and got expensive, so the model layer became a routing decision instead of a constant. Transcription is the single biggest line in the bill, because it runs on every minute of every upload and cannot be skipped. Groq serves the same Whisper weights behind an OpenAI-compatible API at roughly a tenth of the price and, critically, still returns per-segment timestamps, which the entire pipeline is built on. OpenAI's own cheaper transcription model was disqualified for exactly that reason: it emits no segment timestamps at all. Without a Groq key everything falls back to whisper-1, so the cheap path was safe to deploy before the key existed.",
        "Language work splits the same way, by whether the task is a judgment call or mechanical. Chaptering, transcript refinement, and translation are structural: find the topic shifts, copy a verbatim quote, emit the same number of lines back. Those run on a cheap tier at six to eight times less. The calls a user actually judges the product on, ask-the-video, the tutor, study packs, and deep dives, stay on the strong model. Every model call is metered at one chokepoint in the OpenAI client wrapper, so the usage ledger cannot drift as features get added, and a global spend circuit breaker can stop the expensive paths cold.",
      ],
      image: {
        src: "/work/chalk-ask.jpg",
        alt: "The details panel: an ask-the-video box above a generated full-lecture summary and takeaway bullets",
        caption:
          "Both of these are the expensive tier, and deliberately so. Ask-the-video and the whole-lecture summary are what a reader judges the product on, so they keep the strong model while the mechanical work moves down.",
      },
    },
    {
      id: "services",
      heading: "Fighting the model, politely",
      body: [
        "Two whole subsystems exist because language models are unreliable narrators. First, timestamps: gpt-4o drifts up to 100 seconds when asked for chapter start times, so Chalk instead asks it to return a verbatim quote from where the chapter begins, then finds that quote in the real transcript to resolve the true time. Second, coverage: the model nondeterministically stops chaptering partway through, so a refill loop re-asks for the uncovered tail up to four times.",
        "Quizzes get a two-pass treatment to kill the AI-quiz smell: a first pass drafts questions in a professor voice with misconception-based wrong answers, then a second pass acts as an exam editor and rewrites anything lazy or guessable. There is also a per-chapter deep dive, a whole-lecture quiz, and an ask-the-video feature that answers free-form questions with clickable timestamp citations.",
      ],
      image: {
        src: "/work/chalk-chapters.jpg",
        alt: "The generated chapter list, each entry with a resolved timestamp and a one-line summary, plus regenerate and edit controls",
        caption:
          "Every timestamp here was resolved by finding the model's verbatim quote in the real transcript, not by trusting the time it gave. Regenerate and edit exist because the model is a draft, not an oracle.",
      },
    },
    {
      id: "studying",
      heading: "From one lecture to actually studying",
      body: [
        "A table of contents is where studying starts, not where it ends, so the product grew a study layer. Study-pack flashcards run on an SM-2-lite spaced-repetition scheduler with four grades, and the scheduling math is pure and dependency-free precisely so the server and the client can share one source of truth: the server persists the next state, and the grade buttons show you the real next interval before you pick. Review state is per viewer, so a signed-in student and an anonymous browser each keep their own schedule.",
        "Binders extend the same idea past a single video: pull several documents into one study set, with PDF and DOCX extraction, a cheap-tier cleanup and OCR pass for scanned pages, then per-document digests, a combined study guide, quizzes, and ask across the whole set. There is also a transcript translation mode for lectures delivered in a language the reader does not follow, built on the same structural contract as refinement, where line count and timestamps are untouchable because seeking, auto-follow, and search all hang off them.",
        "For instructors there is engagement analytics: what students actually watched and which questions the class kept missing. The read model is owner-only and deliberately excludes the owner's own passes, so a teacher previewing their own lecture never skews the class picture. The waveform on the player used to be decorative, a hash of the lecture id shaped into sine curves, identical for an hour of speech or an hour of silence. It now measures real loudness second by second with ffmpeg, so you can see the quiet stretches before scrubbing into them.",
      ],
      image: {
        src: "/work/chalk-flashcards.jpg",
        alt: "The study pack: a flashcard prompt with a due counter, alongside key terms, quiz, and insights tabs",
        caption:
          "Twelve cards due off one recording. The scheduler is pure and shared with the client, so the grade buttons can show the real next interval before you pick one.",
      },
    },
    {
      id: "distribution",
      heading: "Meeting courses where they already live",
      body: [
        "Students do not start their day at chalkrecap.com, they start in an LMS, so Chalk implements LTI 1.3 properly: a JWKS endpoint, signed launch, and deep linking, so an instructor can drop a Chalk lecture into Canvas or Moodle as a normal course item. Lectures also arrive from Zoom and Webex through full OAuth connections with webhooks, so a recorded class can flow in without anyone re-uploading it.",
        "Every one of those import paths is a retry risk, because webhooks fire more than once and OAuth callbacks get replayed. Imports are keyed idempotently against a unique constraint, so a duplicate delivery resolves to the lecture that already exists instead of paying to transcribe the same meeting twice.",
      ],
    },
    {
      id: "data-flow",
      heading: "One lecture, end to end",
      body: [
        "The browser mints an upload token, pushes the video straight to Blob, creates the lecture row, and pokes the process route. The pipeline downloads to temp storage, checks the duration cap, meters the user's transcription minutes, extracts audio, and transcribes. Files over ten minutes are split into chunks that transcribe four at a time, and every finished chunk is checkpointed to the database.",
        "That checkpointing matters because serverless functions get 300 seconds. If a run dies mid-transcription, the sweeper restarts it and it resumes from the saved chunks instead of paying Whisper twice. Lectures over 90 minutes get map-reduce chaptering in 30-minute windows. When segmentation lands, the lecture flips to ready, an overview generates from the chapter outline, and the viewer shows the clickable TOC.",
      ],
      image: {
        src: "/work/chalk-transcript.jpg",
        alt: "The lecture viewer: player on the left, timestamped transcript on the right with refine and translate controls",
        caption:
          "The far end of the pipeline. Every line keeps its timestamp, which is what makes seeking, search, and chapter resolution possible, and why refine and translate are held to returning the exact same line count.",
      },
    },
    {
      id: "security",
      heading: "Security, quotas, and money",
      body: [
        "Ownership checks live server-side in every route, including anonymous demo lectures that are scoped to a per-browser id. Admin routes sit behind a role gate. Rate limiting is a fixed-window limiter in Postgres that fails open on database trouble, backed by hard ceilings: 2 GB uploads, 4 hour media, 30 minute caps for anonymous users.",
        "Whisper is the expensive step, so it is metered like a utility: free accounts get 300 transcription minutes a month, Pro gets 1500, and top-up packs exist for heavy semesters. Charging is idempotent per lecture, so retries never double-bill. Stripe handles the Pro subscription and one-time credit purchases through a signature-verified webhook that is the only code allowed to grant Pro.",
      ],
    },
    {
      id: "challenges",
      heading: "Challenges and honest tradeoffs",
      body: [
        "The 300-second function ceiling shaped almost everything: the after() processing model, per-chunk checkpoints, claim locks with timeouts, and a daily cron sweeper that revives anything silent for six minutes and gives up after three attempts. There is no queue service because the checkpoints plus the sweeper turned out to be enough, and that is one less thing to run.",
        "YouTube added its own drama by bot-checking datacenter IPs, so the importer requests captions the way a phone would, and the mobile app can even fetch captions client-side on its residential IP and hand them to the server. Chalk also has strong opinions about prose: every model response is banned from using em dashes, enforced in the prompt and then scrubbed with a regex, belt and suspenders. Raw transcripts are exempt because those are the speaker's words, not ours.",
      ],
    },
    {
      id: "outcomes",
      heading: "Outcomes",
      body: [
        "Chalk is live at chalkrecap.com, running on Vercel with the web app and an Expo client sharing one backend of 82 API routes. Android is in beta and iOS is next. Intake comes from recording, upload, video links, Zoom, and Webex; distribution goes back out through Canvas and Moodle over LTI 1.3. On top sit chapters, notes, quizzes, spaced-repetition study packs, binders, deep dives, clip export, translation, and ask-the-video.",
        "The pipeline holds up on real inputs: four-hour lectures chunk, checkpoint, and chapter without babysitting, and the accounting stays correct even when the platform kills the process mid-job. The cost work matters as much as the reliability work, since a study tool that loses money on every upload is not a product. Routing transcription to Groq and the mechanical language work to a cheap tier cut the dominant per-hour costs by roughly an order of magnitude and six to eight times respectively, without touching the calls users judge the product on.",
      ],
      image: {
        src: "/work/chalk-mobile.jpg",
        alt: "Three Android screens: the session library, a 28 chapter table of contents, and the binders tab holding course document sets",
        caption:
          "The same backend on a phone. The Expo client is a pure API consumer, so a feature shipped on the web is a screen away on Android rather than a second implementation.",
      },
    },
  ],
  diagram: {
    caption: "Three ways in, one pipeline, one library.",
    groups: [
      { id: "clients", label: "Clients", nodeIds: ["web", "mobile"] },
      { id: "pipeline", label: "Pipeline", nodeIds: ["blob", "process", "ffmpeg", "whisper", "gpt"] },
      { id: "platform", label: "Platform", nodeIds: ["db", "stripe", "cron", "youtube"] },
    ],
    nodes: [
      {
        id: "web",
        label: "Web app",
        tech: "Next.js 16",
        icon: "AppWindow",
        accent: "aqua",
        col: 0,
        row: 0,
        detail: {
          what: "Marketing, library, the lecture viewer with clickable chapters, and all 36 API routes.",
          why: "One Next.js app is the whole backend, so the mobile app gets a full API for free.",
        },
      },
      {
        id: "mobile",
        label: "Mobile app",
        tech: "Expo + React Native",
        icon: "Smartphone",
        accent: "aqua",
        col: 0,
        row: 1,
        detail: {
          what: "A native client for recording, importing, and studying, with tokens in SecureStore.",
          why: "Pure client of the web API. Bonus: its residential IP can fetch YouTube captions when the server gets bot-checked.",
          protocol: "REST with Authorization: Bearer JWT",
        },
      },
      {
        id: "blob",
        label: "Vercel Blob",
        tech: "client-direct upload",
        icon: "Upload",
        accent: "iris",
        col: 1,
        row: 0,
        detail: {
          what: "Stores raw uploads, recording segments, stitched files, clips, and thumbnails.",
          why: "Browsers upload straight to Blob with short-lived tokens because function bodies cap at 4.5 MB and lectures do not.",
          protocol: "tokened PUT from the browser",
        },
      },
      {
        id: "process",
        label: "Pipeline orchestrator",
        tech: "after() + claim lock",
        icon: "Workflow",
        accent: "iris",
        col: 1,
        row: 1,
        detail: {
          what: "Claims a lecture atomically, routes it down the upload, recording, or link branch, and tracks status.",
          why: "Next.js after() keeps work alive past the response without a queue service; the DB claim stops double processing.",
        },
      },
      {
        id: "ffmpeg",
        label: "ffmpeg",
        tech: "static binary",
        icon: "Video",
        accent: "ember",
        col: 2,
        row: 0,
        detail: {
          what: "Extracts mono 16 kHz audio, splits 10-minute chunks, stitches recording segments, trims clips.",
          why: "Spawned directly as a CLI for fewer moving parts. Audio lives only in temp storage and is never persisted.",
        },
      },
      {
        id: "whisper",
        label: "Whisper",
        tech: "Groq, OpenAI fallback",
        icon: "Mic",
        accent: "iris",
        col: 3,
        row: 0,
        detail: {
          what: "Transcribes chunks four at a time with segment timestamps, checkpointing each chunk to Postgres.",
          why: "Groq serves the same weights at roughly a tenth the price and still returns per-segment timestamps, which the whole pipeline depends on. Without a Groq key it falls back to whisper-1.",
          protocol: "OpenAI-compatible audio.transcriptions, verbose_json",
        },
      },
      {
        id: "gpt",
        label: "Language models",
        tech: "tiered by task",
        icon: "Sparkles",
        accent: "iris",
        col: 3,
        row: 1,
        detail: {
          what: "Segments the transcript into chapters, writes notes and overviews, drafts and edits quizzes, powers the tutor and ask-the-video.",
          why: "Mechanical work (chaptering, refine, translate) runs on a cheap tier at 6-8x less; the calls users judge the product on stay on the strong model. Chapter times resolve by matching verbatim quotes against the transcript, because asked directly the model drifts up to 100 seconds.",
          protocol: "chat completions, JSON mode",
        },
      },
      {
        id: "youtube",
        label: "YouTube import",
        tech: "captions only",
        icon: "Youtube",
        accent: "ember",
        col: 0,
        row: 2,
        detail: {
          what: "Pulls a video's own caption track for imported links. The video itself is never downloaded.",
          why: "Captions skip Whisper entirely, and playback happens through YouTube's embed, which keeps costs near zero.",
        },
      },
      {
        id: "db",
        label: "Neon Postgres",
        tech: "serverless driver",
        icon: "Database",
        accent: "neutral",
        col: 2,
        row: 2,
        detail: {
          what: "Users, lectures, transcripts, chapters, quizzes, chunk checkpoints, rate limits, and the billing ledger.",
          why: "An HTTP driver suits functions that appear and vanish. Migrations are idempotent because racing instances must both be safe.",
        },
      },
      {
        id: "stripe",
        label: "Stripe",
        tech: "Pro + top-ups",
        icon: "CreditCard",
        accent: "neutral",
        col: 3,
        row: 2,
        detail: {
          what: "Pro subscription plus one-time transcription credit packs, granted only by the verified webhook.",
          why: "The webhook is the single writer that can grant Pro, and a ledger table makes credit grants idempotent.",
          protocol: "Checkout + signature-verified webhooks",
        },
      },
      {
        id: "cron",
        label: "Cron sweeper",
        tech: "daily + on-load",
        icon: "Timer",
        accent: "neutral",
        col: 1,
        row: 2,
        detail: {
          what: "Revives pipelines silent for six minutes, gives up after three attempts, salvages abandoned recordings.",
          why: "With a 300-second function ceiling, six silent minutes provably means a killed run. The sweeper is the safety net that replaces a queue.",
        },
      },
    ],
    edges: [
      { from: "web", to: "blob", label: "direct upload", kind: "data" },
      { from: "mobile", to: "web", label: "REST API" },
      { from: "web", to: "process", label: "process" },
      { from: "youtube", to: "process", label: "caption track", kind: "data" },
      { from: "blob", to: "ffmpeg", label: "media", kind: "data" },
      { from: "process", to: "ffmpeg", label: "extract audio" },
      { from: "ffmpeg", to: "whisper", label: "10 min chunks", kind: "data" },
      { from: "whisper", to: "gpt", label: "transcript", kind: "data" },
      { from: "gpt", to: "db", label: "chapters + notes", kind: "data" },
      { from: "process", to: "db", label: "status + checkpoints", kind: "data" },
      { from: "cron", to: "process", label: "revive stalled", kind: "async" },
      { from: "web", to: "stripe", label: "upgrade" },
    ],
  },
  stack: ["Next.js 16", "React 19", "TypeScript", "Groq + OpenAI", "Neon Postgres", "Vercel Blob", "ffmpeg", "Stripe", "LTI 1.3", "Expo", "Tailwind v4"],
  results: [
    { value: "82", label: "API routes in one backend" },
    { value: "5", label: "Ways in: record, upload, link, Zoom, Webex" },
    { value: "~10x", label: "Cheaper transcription after routing to Groq" },
    { value: "Live", label: "In production at chalkrecap.com" },
  ],
  links: { live: "https://chalkrecap.com" },
  chat: {
    suggestedQuestions: [
      "How does Chalk survive serverless timeouts mid-lecture?",
      "Why does it match quotes instead of trusting timestamps?",
      "How does Chalk route models to keep costs down?",
    ],
    extraKnowledge: [
      "Quotas: free accounts get 300 Whisper minutes per month and 3 deep dives; Pro gets 1500 minutes. Credit packs: 300 minutes for 3 dollars, 900 for 9. Anonymous demo users are capped at 30 minute uploads and roughly 6 minute recordings.",
      "Chunking: audio splits at 10 minutes with stream-copy, and each chunk's true start time is derived by probing cumulative durations because copy mode splits on frame boundaries. Transcription concurrency is 4.",
      "Chaptering: lectures over 90 minutes use map-reduce windows of 30 minutes with concurrency 2. The ask-the-video feature feeds up to 90K characters of transcript and cites timestamps that seek the player.",
      "Auth: 30-day HS256 JWTs. Tokens are trusted for 60 seconds, then revalidated against the user row, and a token version claim lets an admin force sign-out everywhere within about two minutes.",
      "The lecture status flow is uploaded, extracting, transcribing, segmenting, ready, with failed as the give-up state after three sweep attempts.",
      "Model routing: transcription runs on Groq's whisper-large-v3-turbo with OpenAI whisper-1 as the fallback when GROQ_API_KEY is unset. Chaptering, transcript refinement, and translation run on gpt-4.1-mini; binder cleanup and scanned-page OCR run on gpt-4o-mini; ask, tutor, study packs, and deep dives stay on gpt-4o. CHAPTER_MODEL and TRANSCRIBE_MODEL override without a redeploy. Every call is metered at one chokepoint in the OpenAI client wrapper, and a global spend circuit breaker can halt the expensive paths.",
      "Integrations: LTI 1.3 with a JWKS endpoint, signed launch, and deep linking for Canvas and Moodle. Zoom and Webex connect over OAuth with webhooks, and imports are keyed idempotently against a unique constraint so a replayed webhook resolves to the existing lecture instead of transcribing twice.",
      "Study layer: study-pack flashcards use an SM-2-lite scheduler with four grades (again, hard, good, easy). The math is pure and shared between server and client so the grade buttons show the real next interval. Review state is per viewer. Binders are premium multi-document study sets with PDF and DOCX extraction, per-document digests, a combined guide, quizzes, and ask across the set.",
      "Engagement analytics show an instructor what students watched and which questions the class missed. The read model is owner-only and excludes the owner's own passes. Player waveforms measure real per-second loudness with ffmpeg rather than the seeded sine curves they used to draw.",
      "Chalk bans em dashes in every AI response, enforced in the prompt and scrubbed with a regex afterward. Raw Whisper transcripts are exempt because those are the speaker's words.",
    ].join("\n"),
  },
  seo: {
    schemaType: "SoftwareApplication",
    description:
      "Deep dive into Chalk, an AI lecture-capture tool: a crash-tolerant serverless pipeline that turns recordings, uploads, and YouTube links into chapters, notes, quizzes, and an ask-the-video tutor.",
  },
};
