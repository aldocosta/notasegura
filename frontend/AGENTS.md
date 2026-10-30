# Frontend (Next.js)

## Commands
- dev: `npm run dev`
- build: `npm run build`
- start: `npm run start`
- lint: `npm run lint`

## Stack
Next.js 16 (App Router), React 19, Tailwind CSS 4 (`@tailwindcss/turbopack`), TypeScript. Design tokens in `docs/DESIGN-nerdwallet.md`.

## Design reference

Frontend must follow `docs/DESIGN-nerdwallet.md` (colors, typography, components, responsive rules). See root AGENTS.md matrix.

## UI constraints
- Minimalist and responsive.
- Reserve space for future ads/add-ons, max 8% of screen area.
- Avoid clutter.

## Environment

Build-time values: Next.js inlines `NEXT_PUBLIC_*` variables during `next build`, so changing them requires a rebuild. In Docker they are build args (`frontend/Dockerfile`, `docker-compose.yml` `frontend.build.args`). See `.env.example`; readers live in `src/lib/site.ts`.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public site URL used by `robots.txt` and `sitemap.xml`. Default `http://localhost:3005`. |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense client ID (`ca-pub-` + 16 digits). Enables the AdSense script and `google-adsense-account` meta on `(site)` pages and serves `/ads.txt`. Invalid or empty disables both. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact email shown as a `mailto:` link on `/contato`. Empty hides the link. |

AdSense code only loads in `src/app/(site)/layout.tsx`; the note page (`/n/[id]`) and the 404 page stay outside that group and must never load it.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
