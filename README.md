# Shipyard — Sishir Phuyal

Personal portfolio site. Branded **Shipyard** ("software that ships").

Built with **Next.js 15** (App Router), **Tailwind CSS**, **Framer Motion**, and
**TypeScript**. Dark, minimal, fully responsive.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

> Do not run `npm run build` while the dev server is running — they share the
> `.next` directory and the build will corrupt the dev runtime. Stop the dev
> server first.

## Build

```bash
npm run build
npm run start
```

## Editing content

All content (profile, projects, experience, education, services, links) lives in
a single source of truth:

```
src/lib/content.ts
```

Add a project, change the bio, or update links by editing that file — no
component changes needed.

## Structure

```
src/
  app/            # Next.js App Router (layout, page, global styles)
  components/
    sections/     # Hero, Projects, Experience, About, Education, Services, Contact
    shared/       # Top nav, footer
  lib/            # content.ts (data), motion.ts (animations), utils.ts
public/           # favicon, résumé PDF
```
