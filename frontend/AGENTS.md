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
" > /home/aldo/Documents/Projects/Maestri/notasegura/frontend/AGENTS.md && echo ok

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
