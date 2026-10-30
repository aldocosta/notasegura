# Design: frontend-adsense-readiness

## Context

- Google publishes no minimum page count, domain age, or traffic for AdSense. It requires original content, policy compliance, a privacy disclosure for advertising cookies, and a site that is live, navigable, and crawlable.
- Google rejects sites as "insufficient content" or "under construction", and it forbids ads on screens without publisher content or on screens for alerts, navigation, or other behavioral purposes. The note page is such a screen.
- The note page fetches the note on load, and each fetch consumes a view. The AdSense crawler (`Mediapartners-Google`) executes JavaScript. If it opens a note link, it consumes a view or destroys the note.
- `Mediapartners-Google` ignores the `User-Agent: *` group in `robots.txt`. It obeys only a group that names it.
- The home page is a client component (`"use client"`). Next.js prerenders it, so its text is in the server HTML.
- Next.js 16 inlines `NEXT_PUBLIC_*` variables at build time. The Docker image is built once, so these values must be build arguments.
- Backend data facts that the privacy policy must match:
  - Notes: ciphertext, IV, tag, salt, expiry date, view count, and max views. A TTL index deletes them at expiry.
  - Rate limit: client IP per endpoint and per 60-second window. A TTL index deletes it.
  - Application logs: method, route, status, duration, and error message. No IP, no note text. A TTL index deletes them.

## Decisions

### Decision: Route group for AdSense code

**Chosen:** Move the home page and the trust pages into `src/app/(site)/`. The `(site)/layout.tsx` renders the AdSense `Script` and the `google-adsense-account` meta tag when the client ID is valid. `src/app/n/[id]/` and `src/app/not-found.tsx` stay outside the group.

**Rationale:** The server decides which pages load AdSense code. The note page never receives the script, so Auto ads cannot place an ad on it. URLs do not change, because route groups do not add a path segment.

**Alternatives considered:**

- Script in the root layout with a client-side `usePathname()` check: the decision happens in the browser, the server HTML differs from the final DOM, and a bug exposes the note page.
- Script in each page: duplicated code, and a new page can forget it.

### Decision: Shared header and footer in the root layout

**Chosen:** Create `src/components/SiteHeader.tsx` (link "Nota Segura - BR" to `/`) and `src/components/SiteFooter.tsx` (links "Sobre", "Privacidade", "Termos", "Contato", and the line "© {current year} Nota Segura - BR"). Render both in `src/app/layout.tsx`. Remove the inline headers from `src/app/(site)/page.tsx` and `src/app/n/[id]/NoteViewClient.tsx`.

**Rationale:** One place guarantees the navigation on every page, including the note page and the 404 page. A footer has no ads, so it is safe on the note page.

**Alternatives considered:**

- Footer only in `(site)/layout.tsx`: the note page and the 404 page lose the trust links.

### Decision: Site configuration module

**Chosen:** Create `src/lib/site.ts` with functions that read `process.env` at call time:

- `getSiteUrl()`: `NEXT_PUBLIC_SITE_URL` without a trailing slash; default `http://localhost:3005`.
- `getAdsenseClient()`: `NEXT_PUBLIC_ADSENSE_CLIENT` when it matches `/^ca-pub-\d{16}$/`, else `null`.
- `getAdsensePublisherId()`: `getAdsenseClient()` without the `ca-` prefix, else `null`.
- `getContactEmail()`: trimmed `NEXT_PUBLIC_CONTACT_EMAIL`, else `null`.
- `TRUST_PAGES`: the list of `{ href, label }` for the four trust pages, used by the footer and the sitemap.

**Rationale:** One source of truth for the footer, the sitemap, and the ad code. Call-time reads let unit tests use `vi.stubEnv`.

**Alternatives considered:**

- Constants in source code: the owner must edit code to change the domain or the client ID.

### Decision: robots, sitemap, and ads.txt

**Chosen:**

- `src/app/robots.ts` returns two rules, `{ userAgent: "*" }` and `{ userAgent: "Mediapartners-Google" }`, each with `allow: "/"` and `disallow: ["/n/", "/api/"]`, and `sitemap: ${getSiteUrl()}/sitemap.xml`.
- `src/app/sitemap.ts` returns `getSiteUrl()` and `${getSiteUrl()}${href}` for each entry of `TRUST_PAGES`.
- `src/app/ads.txt/route.ts` exports `GET`. It returns `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n` with `Content-Type: text/plain; charset=utf-8`, or HTTP 404 when `getAdsensePublisherId()` is `null`. `f08c47fec0942fa0` is Google's fixed certification authority ID.
- `src/app/n/[id]/page.tsx` exports `metadata = { robots: { index: false, follow: false } }`.

**Rationale:** Next.js metadata files are the supported way to produce `robots.txt` and `sitemap.xml`. `Disallow: /n/` in both groups is the main protection for notes. The `noindex` tag is a second barrier for crawlers that ignore `robots.txt`.

**Alternatives considered:**

- Static files in `public/`: they cannot read the configured site URL or client ID.

### Decision: AdSense script tag

**Chosen:** In `(site)/layout.tsx`, render a React 19 `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={client}" crossOrigin="anonymous" />`, and export `generateMetadata` that returns `other: { "google-adsense-account": client }` when the client ID is valid.

**Rationale:** This is the exact tag that AdSense asks the owner to paste. React 19 renders an `async` script in the server HTML, hoists it into `<head>`, and deduplicates it. `async` keeps it out of the critical path of the note form. The meta tag lets AdSense verify the site even if the script is blocked.

**Alternatives considered:**

- `next/script` with `strategy="afterInteractive"`: in the App Router it emits only `<link rel="preload" as="script">` in the server HTML and injects the `<script>` on the client, so the server HTML has no AdSense script tag. Replaced on 2026-10-30 after implementation showed this.
- `next/script` with `strategy="beforeInteractive"`: it must live in the root layout, so the note page would load it.

### Decision: Trust page content

**Chosen:** Server components with static pt-BR text, each with `export const metadata` (title and description). The root layout uses `title.template: "%s | Nota Segura - BR"`. Content outline:

- `/sobre`: what the site does, who runs it ("Nota Segura - BR"), why it is free, and how ads fund it.
- `/privacidade`: every item of the "Privacy policy disclosures" requirement, matched to the backend data facts in Context; last update date.
- `/termos`: acceptable use (no illegal content, no malware, no abuse), no warranty, service availability, a note that the operator does not read notes, cannot recover them, and cannot decrypt notes protected by a passphrase, and Brazilian law as the governing law; last update date.
- `/contato`: the `mailto:` link from `getContactEmail()`, what to report (abuse, privacy requests), and a reply time of up to 5 business days.

**Rationale:** Static server components put the full text in the server HTML. The text is factual and short. It is not editorial content, which is out of scope.

**Alternatives considered:**

- Markdown or MDX files: a new dependency for four pages.

### Decision: Privacy text matches real retention and decryption

**Chosen:** The privacy policy states that note data stays until the expiry date, also when the note is consumed earlier, and that a consumed note can no longer be opened. It states that only passphrase-protected notes cannot be decrypted by the operator, because notes without a passphrase use the server key `NOTE_DEFAULT_PASSPHRASE`.

**Rationale:** The policy must describe what the backend does. A false claim harms trust and can breach the LGPD.

**Alternatives considered:**

- Delete notes when they are consumed: a backend change, out of scope.
- Encrypt so that the operator can never read any note: a crypto change, out of scope.

### Decision: Not found page

**Chosen:** `src/app/not-found.tsx` with an `h1` "Página não encontrada", one paragraph, and a link "Voltar para o início" to `/`.

**Rationale:** Next.js serves `not-found.tsx` with HTTP 404 for unknown paths. Being outside `(site)`, it does not load AdSense code.

### Decision: Build-time configuration in Docker

**Chosen:** In `frontend/Dockerfile`, add `ARG NEXT_PUBLIC_SITE_URL`, `ARG NEXT_PUBLIC_ADSENSE_CLIENT`, and `ARG NEXT_PUBLIC_CONTACT_EMAIL` with matching `ENV` lines in the build stage, before `npm run build`. In `docker-compose.yml`, pass them under `frontend.build.args` from the host environment. `NEXT_PUBLIC_CONTACT_EMAIL` defaults to `aldocostasantos@gmail.com`; the other two default to empty. `frontend/.env.example` documents the three variables for local development.

**Rationale:** Values set only at runtime do not reach the inlined code.

## Architecture

```text
src/app/
├── layout.tsx            SiteHeader + {children} + SiteFooter; title template
├── not-found.tsx         404, no AdSense
├── robots.ts             robots.txt
├── sitemap.ts            sitemap.xml
├── ads.txt/route.ts      ads.txt
├── (site)/
│   ├── layout.tsx        AdSense Script + google-adsense-account meta (if configured)
│   ├── page.tsx          home (moved from app/page.tsx)
│   ├── page.test.tsx     moved with the page
│   ├── sobre/page.tsx
│   ├── privacidade/page.tsx
│   ├── termos/page.tsx
│   └── contato/page.tsx
├── n/[id]/               note page, noindex, no AdSense
└── api/[...path]/        backend proxy (unchanged)
src/components/SiteHeader.tsx, SiteFooter.tsx
src/lib/site.ts           env readers + TRUST_PAGES
```

## Risks

- **Playwright reuses a running dev server** (`reuseExistingServer: true`): a server started without the test variables makes the new E2E tests fail. Mitigation: the Tester stops any server on port 3005 before the run.
- **The E2E browser loads the real AdSense script** with a fake client ID: Mitigation: the E2E tests that open content pages in a browser block `pagead2.googlesyndication.com` with `page.route` and fulfill with an empty body.
- **Existing E2E selectors**: `smoke.spec.ts` and `comprehensive.spec.ts` may target the header that moves. Mitigation: keep the header text "Nota Segura - BR"; run both suites as regression.
- **Policy text is not legal advice**: Mitigation: the owner reviews the text of `/privacidade` and `/termos` before applying to AdSense.
- **Consent for EEA, UK, and Switzerland**: Google requires a certified consent platform for those visitors. Mitigation: the owner enables the Google consent message in AdSense "Privacy & messaging"; no code in this change.
- **`next/script` in jsdom**: rendering the group layout in Vitest is not reliable. Mitigation: unit tests cover `site.ts`; E2E tests read the raw server HTML for the script and the meta tag.
