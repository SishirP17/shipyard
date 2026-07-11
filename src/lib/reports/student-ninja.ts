import type { ProjectReport } from "@/lib/reports/types";

// LIGHT report: an archived 2023 project, kept honest to what shipped.
export const REPORT: ProjectReport = {
  slug: "student-ninja",
  title: "Student Ninja",
  tagline: "Turn a pile of syllabi into a calendar that nags you at the right time.",
  year: "2023",
  role: "Solo",
  treatment: "light",
  intro:
    "Student Ninja was my first real end-to-end build: a Django app that parses uploaded class schedules out of Excel and PDF files, turns them into an interactive calendar, and emails reminders before things are due. Archived now, but it is where the full-stack habit started.",
  sections: [
    {
      id: "overview",
      heading: "Overview",
      body: [
        "Every semester starts the same way: five syllabi in five formats, deadlines scattered through paragraphs and tables, and no single view of what is due when. Student Ninja ate the files and produced one calendar.",
        "It was a Django web app with a JavaScript calendar front end, file parsing on upload, task management, and a background job system for email reminders.",
      ],
    },
    {
      id: "problem",
      heading: "The problem",
      body: [
        "Deadlines lived in documents, not in tools. Copying them into a calendar app by hand took an evening and got stale the first time a professor moved a date.",
        "The fix: parse the documents students already have, and make the reminders automatic so forgetting requires effort.",
      ],
    },
    {
      id: "build",
      heading: "The build",
      body: [
        "Uploads were parsed server-side into structured events that auto-populated an interactive calendar rendered with JavaScript. Tasks could be added, edited, and checked off alongside the parsed schedule.",
        "Reminders ran through Django background tasks on a Celery and Crontab setup, sending emails ahead of due dates. Getting scheduled jobs, parsing, and a web UI working together was my first taste of real systems plumbing, and I have been chasing that feeling since.",
      ],
    },
    {
      id: "outcomes",
      heading: "Outcomes",
      body: [
        "Deployed and used through my own semesters, then archived in 2023 as coursework ended.",
        "As a first full build it covered an honest amount of ground: file parsing, data modeling, a dynamic front end, and scheduled background jobs. The projects since have better architecture, but this one proved the loop: idea, build, ship, iterate.",
      ],
    },
  ],
  diagram: {
    caption: "From syllabus files to scheduled nagging.",
    nodes: [
      {
        id: "upload",
        label: "Schedule upload",
        tech: "Excel + PDF",
        icon: "Upload",
        accent: "iris",
        col: 0,
        row: 0,
        detail: {
          what: "Students upload the schedule files they already have.",
          why: "Meeting users at their documents beats asking them to retype deadlines.",
        },
      },
      {
        id: "django",
        label: "Django app",
        tech: "parser + calendar",
        icon: "Server",
        accent: "iris",
        col: 1,
        row: 0,
        detail: {
          what: "Parses files into structured events, serves the interactive JavaScript calendar, and manages tasks.",
          why: "Django's batteries-included model meant auth, ORM, and admin came free while the parsing got the attention.",
        },
      },
      {
        id: "worker",
        label: "Celery worker",
        tech: "Crontab schedule",
        icon: "Timer",
        accent: "ember",
        col: 2,
        row: 0,
        detail: {
          what: "Background jobs that check upcoming deadlines and queue reminder emails.",
          why: "Reminders have to fire whether or not anyone has the site open. That is a job for a worker, not a request.",
          protocol: "scheduled background tasks",
        },
      },
      {
        id: "email",
        label: "Email reminders",
        tech: "automated",
        icon: "Mail",
        accent: "aqua",
        col: 3,
        row: 0,
        detail: {
          what: "Due-date reminders delivered to the student's inbox before deadlines hit.",
          why: "The inbox is the one place students already check daily. Push where the user already is.",
        },
      },
    ],
    edges: [
      { from: "upload", to: "django", label: "parse" },
      { from: "django", to: "worker", label: "due dates", kind: "async" },
      { from: "worker", to: "email", label: "send reminders", kind: "async" },
    ],
  },
  stack: ["Django", "Python", "JavaScript", "HTML/CSS", "Celery"],
  results: [
    { value: "2023", label: "Archived after real semester use" },
    { value: "1st", label: "Full end-to-end build: parse, schedule, remind" },
    { value: "0", label: "Deadlines retyped by hand" },
  ],
  seo: {
    schemaType: "CreativeWork",
    description:
      "Student Ninja: a Django app that parsed Excel and PDF class schedules into an interactive calendar with automated Celery email reminders. An early end-to-end build.",
  },
};
