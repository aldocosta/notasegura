# Proposal: frontend-guides-and-seo

## Intent

The site has 25 algorithm articles, but each one explains a single algorithm.
Visitors often search for a choice ("AES or ChaCha20?", "SHA-256 or MD5?") or for a task ("how to send a password safely"), and the site has no page that answers these questions.
Search engines and social networks also get little help from the pages: there is no canonical URL, no structured data, and no share image.
This change adds comparison pages and practical guides that link the existing articles to the product, and it adds the technical SEO that the content pages need.

## User Stories

### Story: choose-between-algorithms

As a visitor, I want a page that compares two or more algorithms side by side and recommends one, so that I can choose the right algorithm without reading every article.

### Story: protect-a-secret-in-practice

As a visitor, I want short practical guides about everyday tasks, such as sending a password or storing passwords, so that I know what to do and when a self-destructing note helps.

### Story: find-the-content

As a visitor who uses a search engine or a social network, I want each page to show a correct title, description, and image, and to link to related pages, so that I find the answer I searched for and the pages around it.

## Scope

**In scope:**

- A guide index at `/guias` and eight guide pages at `/guias/<slug>`: four comparisons and four practical guides, in pt-BR.
- A comparison table in each comparison guide.
- The link "Guias" (`/guias`) in the main menu, after "Algoritmos".
- Links between the content: from each guide to the algorithms that it cites and to two other guides; from each algorithm page to the guides that cite it; from `/algoritmos` to `/guias`.
- A visible breadcrumb on the algorithm pages and the guide pages.
- A canonical URL and Open Graph and Twitter metadata on the content pages.
- Generated share images (Open Graph): one default image for the site, one image for each algorithm page, and one image for each guide page.
- Structured data (JSON-LD): `Article` on the algorithm pages and the guide pages, and `BreadcrumbList` on these pages and on the two index pages.
- A publication date for each algorithm article and each guide.
- The nine new URLs in `/sitemap.xml`.
- Unit and E2E tests, including the updates of the existing menu and sitemap tests that this change requires.

**Out of scope:**

- A canonical URL and page-specific metadata on the home page. The home page is a client component and cannot export metadata; this needs a separate change.
- Changes to the footer. The footer keeps the three trust links.
- New algorithms or changes to the playground.
- Translations, comments, a search box, or an RSS feed.
- Backend changes.

## Approach

The guide text lives in TypeScript modules under `frontend/src/lib/guides/`, like the algorithm articles, so that one test can check the structure, the word count, and the required facts of every guide.
The guide pages are server components, prerendered with `generateStaticParams`, in the `(site)` group, so the full text is in the server HTML and the pages carry the AdSense code.
The SEO helpers (metadata, JSON-LD) are pure functions in `frontend/src/lib/seo.ts`, so they can be tested without rendering a page.
The share images use the `opengraph-image` file convention with `ImageResponse` from `next/og`, so no image file is stored in the repository.

## Resolved Questions

- 2026-10-31 Scope: comparisons, practical guides, and technical SEO go in one change. Decided with the user.
