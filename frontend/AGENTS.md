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
| `NEXT_PUBLIC_SITE_URL` | Public site URL used by `robots.txt`, `sitemap.xml`, `metadataBase` (canonical and Open Graph URLs), and the JSON-LD URLs. Default `http://localhost:3005`. |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense client ID (`ca-pub-` + 16 digits). Enables the AdSense script and `google-adsense-account` meta on `(site)` pages and serves `/ads.txt`. Invalid or empty disables both. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact email shown as a `mailto:` link on `/contato`. Empty hides the link. |

Algorithm articles (`/algoritmos/<id>`) live as data in `src/lib/algorithms/articles/`, one file per playground algorithm; `src/lib/algorithms/index.test.ts` enforces their sections, length, and required facts.

Guides (`/guias/<slug>`: comparisons and practical guides) live as data in `src/lib/guides/articles/`, one file per guide, listed in order in `GUIDES` (`src/lib/guides/index.ts`); `src/lib/guides/index.test.ts` enforces their sections, comparison tables, length, citations, and required facts. Guides state only the product facts of the backend (server-side AES-256-GCM over HTTPS, not end-to-end).

SEO helpers live in `src/lib/seo.ts`: `siteMetadata` (root layout, `metadataBase` from `NEXT_PUBLIC_SITE_URL`), `pageMetadata` (canonical URL, Open Graph, Twitter on content pages), and the JSON-LD builders (`articleJsonLd`, `breadcrumbJsonLd`) rendered with `src/components/JsonLd.tsx`.

Share images are generated with `ImageResponse` by `shareImage` (`src/lib/share-image.tsx`) in three `opengraph-image.tsx` files: `src/app/`, `src/app/algoritmos/[id]/`, and `src/app/guias/[slug]/`. The two dynamic ones stay outside the `(site)` group, because Next.js adds a hash suffix to metadata routes inside a route group; so the algorithm and guide pages pass their image to `pageMetadata` explicitly. Their colors come from `BRAND_COLORS` (`src/lib/brand.ts`), which `src/lib/brand.test.ts` keeps equal to the `--color-*` tokens of `globals.css`.

AdSense code only loads in `src/app/(site)/layout.tsx`; the note page (`/n/[id]`) and the 404 page stay outside that group and must never load it.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
