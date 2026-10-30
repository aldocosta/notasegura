# Tasks: frontend-adsense-readiness

## Configuration (Frontend)

- [x] `frontend/src/lib/site.ts`: add `getSiteUrl()`, `getAdsenseClient()`, `getAdsensePublisherId()`, `getContactEmail()`, and `TRUST_PAGES` as described in `design.md` (Decision: Site configuration module).

### Unit: `frontend/src/lib/site.test.ts` (Vitest, `vi.stubEnv`, `vi.unstubAllEnvs()` in `afterEach`)

- [x] `it('returns the site URL without a trailing slash')` — with `NEXT_PUBLIC_SITE_URL="https://notasegura.example/"`, `getSiteUrl()` equals `"https://notasegura.example"`.
- [x] `it('defaults the site URL to localhost')` — with the variable unset, `getSiteUrl()` equals `"http://localhost:3005"`.
- [x] `it('accepts a valid AdSense client ID')` — with `NEXT_PUBLIC_ADSENSE_CLIENT="ca-pub-1234567890123456"`, `getAdsenseClient()` equals that value and `getAdsensePublisherId()` equals `"pub-1234567890123456"`.
- [x] `it.each(['', 'pub-1234567890123456', 'ca-pub-123', 'ca-pub-12345678901234AB'])('rejects the client ID %s')` — `getAdsenseClient()` and `getAdsensePublisherId()` are `null`.
- [x] `it('returns null for an unset or blank contact email')` — with `""` and with `"   "`, `getContactEmail()` is `null`; with `" contato@example.com "` it equals `"contato@example.com"`.
- [x] `it('lists the four trust pages')` — `TRUST_PAGES.map(p => p.href)` equals `['/sobre', '/privacidade', '/termos', '/contato']` and the labels equal `['Sobre', 'Privacidade', 'Termos', 'Contato']`.

## Layout and navigation (Frontend)

- [x] `frontend/src/components/SiteHeader.tsx`: link "Nota Segura - BR" to `/`, with the classes of the current home header.
- [x] `frontend/src/components/SiteFooter.tsx`: `nav` with `aria-label="Rodapé"` that renders one `next/link` per `TRUST_PAGES` entry and the line "© {current year} Nota Segura - BR". Use design tokens from `docs/DESIGN-nerdwallet.md`; wrap links on narrow screens.
- [x] `frontend/src/app/layout.tsx`: render `SiteHeader`, `children`, and `SiteFooter`; change `metadata.title` to `{ default: "Nota Segura - BR", template: "%s | Nota Segura - BR" }`.
- [x] Move `frontend/src/app/page.tsx` and `frontend/src/app/page.test.tsx` to `frontend/src/app/(site)/`. Remove the inline `<header>` from the moved page.
- [x] `frontend/src/app/n/[id]/NoteViewClient.tsx`: remove the inline `<header>`.
- [x] `frontend/src/app/n/[id]/page.tsx`: export `metadata = { robots: { index: false, follow: false } }`.

### Unit: `frontend/src/components/SiteFooter.test.tsx`

- [x] `it('links to the four trust pages')` — for each of "Sobre", "Privacidade", "Termos", "Contato", `getByRole('link', { name })` has the `href` `/sobre`, `/privacidade`, `/termos`, `/contato`.
- [x] `it('shows the current year')` — the footer text contains `String(new Date().getFullYear())`.

### Unit: `frontend/src/components/SiteHeader.test.tsx`

- [x] `it('links the brand to the home page')` — `getByRole('link', { name: 'Nota Segura - BR' })` has `href` `/`.

## AdSense code (Frontend)

- [x] `frontend/src/components/AdsenseScript.tsx`: return `null` when `getAdsenseClient()` is `null`; else return `next/script` with the `src`, `crossOrigin="anonymous"`, and `strategy="afterInteractive"` from `design.md`.
- [x] `frontend/src/app/(site)/layout.tsx`: render `AdsenseScript` and `children`; export `generateMetadata()` that returns `{ other: { "google-adsense-account": client } }` when the client ID is valid, else `{}`.

### Unit: `frontend/src/components/AdsenseScript.test.tsx`

- [x] `it('renders nothing without a client ID')` — with `NEXT_PUBLIC_ADSENSE_CLIENT` unset, `render(<AdsenseScript />).container` is empty and `document.querySelector('script[src*="adsbygoogle"]')` is `null`.
- [x] `it('renders nothing with an invalid client ID')` — same assertions with `"pub-123"`.

### Unit: `frontend/src/app/(site)/layout.test.ts`

- [x] `it('adds the google-adsense-account meta for a valid client ID')` — with `"ca-pub-1234567890123456"`, `await generateMetadata()` equals `{ other: { 'google-adsense-account': 'ca-pub-1234567890123456' } }`.
- [x] `it('adds no meta without a valid client ID')` — with the variable unset and with `"pub-123"`, `await generateMetadata()` has no `other` key.

## Crawler files (Frontend)

- [x] `frontend/src/app/robots.ts`: rules and sitemap as described in `design.md` (Decision: robots, sitemap, and ads.txt).
- [x] `frontend/src/app/sitemap.ts`: home and `TRUST_PAGES` URLs on `getSiteUrl()`.
- [x] `frontend/src/app/ads.txt/route.ts`: `GET` handler as described in `design.md`.

### Unit: `frontend/src/app/robots.test.ts`

- [x] `it('blocks notes and the API for every crawler')` — `robots().rules` contains an entry with `userAgent: '*'` and an entry with `userAgent: 'Mediapartners-Google'`; each has `allow: '/'` and a `disallow` that contains `'/n/'` and `'/api/'`.
- [x] `it('points to the sitemap on the site URL')` — with `NEXT_PUBLIC_SITE_URL="https://notasegura.example"`, `robots().sitemap` equals `"https://notasegura.example/sitemap.xml"`.

### Unit: `frontend/src/app/sitemap.test.ts`

- [x] `it('lists exactly the home and the trust pages')` — with `NEXT_PUBLIC_SITE_URL="https://notasegura.example"`, `sitemap().map(e => e.url)` equals `['https://notasegura.example', 'https://notasegura.example/sobre', 'https://notasegura.example/privacidade', 'https://notasegura.example/termos', 'https://notasegura.example/contato']`.
- [x] `it('lists no note URL')` — no `url` contains `'/n/'`.

### Unit: `frontend/src/app/ads.txt/route.test.ts`

- [x] `it('serves the Google line for a valid client ID')` — with `"ca-pub-1234567890123456"`, `await GET()` has status 200, `content-type` starting with `text/plain`, and body `"google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n"`.
- [x] `it('returns 404 without a client ID')` — with the variable unset, the status is 404.
- [x] `it('returns 404 for an invalid client ID')` — with `"ca-pub-12AB"`, the status is 404.

## Trust pages and 404 (Frontend)

- [x] `frontend/src/app/(site)/sobre/page.tsx`: content per `design.md` (Decision: Trust page content); `metadata.title` "Sobre".
- [x] `frontend/src/app/(site)/privacidade/page.tsx`: every disclosure of the "Privacy policy disclosures" requirement, matched to the backend data facts in `design.md` Context; `metadata.title` "Política de Privacidade".
- [x] `frontend/src/app/(site)/termos/page.tsx`: content per `design.md`; `metadata.title` "Termos de Uso".
- [x] `frontend/src/app/(site)/contato/page.tsx`: `mailto:` link from `getContactEmail()` only when it is not `null`; `metadata.title` "Contato".
- [x] `frontend/src/app/not-found.tsx`: `h1` "Página não encontrada", one paragraph, link "Voltar para o início" to `/`.

### Unit: `frontend/src/app/(site)/trust-pages.test.tsx`

- [x] `it.each([Sobre, Privacidade, Termos, Contato])('renders one h1 and at least three paragraphs')` — `getAllByRole('heading', { level: 1 })` has length 1 and `container.querySelectorAll('p')` has at least 3 elements with non-empty `textContent`.

### Unit: `frontend/src/app/(site)/privacidade/page.test.tsx`

- [x] `it('discloses advertising cookies')` — the text matches `/cookies/i` and `/Google/`; `getByRole('link', ...)` elements include `href` `https://adssettings.google.com/` and `https://www.aboutads.info/`.
- [x] `it('discloses data handling')` — the text matches `/frase secreta/i`, `/texto claro/i`, `/criptografad/i`, `/visualiza/i`, `/\bIP\b/`, `/conta/i`, and `/LGPD/`; a link has `href` `/contato`.

### Unit: `frontend/src/app/(site)/contato/page.test.tsx`

- [x] `it('shows the configured email')` — with `NEXT_PUBLIC_CONTACT_EMAIL="contato@example.com"`, `getByRole('link', { name: 'contato@example.com' })` has `href` `mailto:contato@example.com`.
- [x] `it('renders no mailto link without an email')` — with the variable unset, `container.querySelector('a[href^="mailto:"]')` is `null`.

### Unit: `frontend/src/app/not-found.test.tsx`

- [x] `it('explains the error and links home')` — `getByRole('heading', { name: 'Página não encontrada' })` exists and `getByRole('link', { name: 'Voltar para o início' })` has `href` `/`.

## Build configuration (Frontend)

- [x] `frontend/Dockerfile`: add `ARG` and `ENV` for `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ADSENSE_CLIENT`, and `NEXT_PUBLIC_CONTACT_EMAIL` in the build stage, before `npm run build`.
- [x] `docker-compose.yml`: add `frontend.build.args` for the three variables: `NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL:-}`, `NEXT_PUBLIC_ADSENSE_CLIENT: ${NEXT_PUBLIC_ADSENSE_CLIENT:-}`, `NEXT_PUBLIC_CONTACT_EMAIL: ${NEXT_PUBLIC_CONTACT_EMAIL:-aldocostasantos@gmail.com}`.
- [x] `frontend/.env.example`: list the three variables with `NEXT_PUBLIC_CONTACT_EMAIL=aldocostasantos@gmail.com` and the other two empty, each with a one-line comment. Add `!.env.example` after `.env*` in `frontend/.gitignore` so the file is committed.
- [x] `.github/workflows/deploy.yml`: pass `NEXT_PUBLIC_SITE_URL` (`https://` + `vars.SITE_ADDRESS` or the droplet sslip.io host), `NEXT_PUBLIC_ADSENSE_CLIENT` (`vars.ADSENSE_CLIENT`), and `NEXT_PUBLIC_CONTACT_EMAIL` (`vars.CONTACT_EMAIL`, default `aldocostasantos@gmail.com`) as `build-args` of the frontend image.
- [x] `frontend/playwright.config.ts`: add `webServer.env` with `NEXT_PUBLIC_SITE_URL: "https://notasegura.example"`, `NEXT_PUBLIC_ADSENSE_CLIENT: "ca-pub-1234567890123456"`, and `NEXT_PUBLIC_CONTACT_EMAIL: "contato@example.com"`.
- [x] `frontend/AGENTS.md`: add an "Environment" section that lists the three variables, their purpose, and that they are build-time values.

## E2E: `frontend/e2e/adsense-readiness.spec.ts` (Playwright, uses the `webServer.env` values)

Browser tests on content pages block `https://pagead2.googlesyndication.com/**` with `page.route(..., r => r.fulfill({ status: 200, body: '' }))`. HTML checks use `request.get()`, which does not execute JavaScript.

- [x] `test('trust pages serve prose without JavaScript')` — for each of `/sobre`, `/privacidade`, `/termos`, `/contato`: `request.get(path)` has status 200, and the body contains one `<h1` and at least three `<p` tags.
- [x] `test('footer navigates between trust pages')` — go to `/termos`, click link "Privacidade" in `nav[aria-label="Rodapé"]`, expect URL `/privacidade` and a visible `h1`.
- [x] `test('header and footer appear on home, note, and 404 pages')` — for `/`, `/n/abc123`, and `/pagina-que-nao-existe`: link "Nota Segura - BR" has `href` `/`, and the footer has the four trust links.
- [x] `test('trust pages fit a mobile viewport')` — with viewport `{ width: 375, height: 812 }`, for each trust page, `document.documentElement.scrollWidth <= window.innerWidth`.
- [x] `test('content pages carry the AdSense code')` — for `/` and `/privacidade`, the `request.get` body contains `adsbygoogle.js?client=ca-pub-1234567890123456` and `name="google-adsense-account" content="ca-pub-1234567890123456"`.
- [x] `test('note and 404 pages carry no AdSense code')` — for `/n/abc123` and `/pagina-que-nao-existe`, the body contains neither `adsbygoogle` nor `google-adsense-account`.
- [x] `test('note page is not indexed')` — the body of `/n/abc123` contains `<meta name="robots" content="noindex, nofollow"`.
- [x] `test('robots.txt blocks notes for all crawlers')` — `/robots.txt` has status 200; the text has a `User-Agent: *` group and a `User-Agent: Mediapartners-Google` group, each with `Allow: /`, `Disallow: /n/`, and `Disallow: /api/`; the text contains `Sitemap: https://notasegura.example/sitemap.xml`.
- [x] `test('sitemap lists the five public pages')` — `/sitemap.xml` has status 200 and exactly five `<loc>` values, equal to the list in the "Sitemap" requirement.
- [x] `test('ads.txt is served')` — `/ads.txt` has status 200, `content-type` starting with `text/plain`, and body `google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n`.
- [x] `test('unknown path returns 404')` — `request.get('/pagina-que-nao-existe')` has status 404; in the browser, the page shows "Página não encontrada" and link "Voltar para o início" with `href` `/`.
- [x] `test('contact page shows the email')` — on `/contato`, link "contato@example.com" has `href` `mailto:contato@example.com`.

## Regression

- [x] `frontend/src/app/(site)/page.test.tsx` passes unchanged after the move, except for its relative import paths.
- [x] `frontend/e2e/smoke.spec.ts`, `frontend/e2e/comprehensive.spec.ts`, and `frontend/e2e/how-it-works-cta.spec.ts` pass unchanged.

## Validation (Tester)

- [x] Stop any process on port 3005, then run `cd frontend && npm run lint && npx tsc --noEmit && npm test && npm run build`.
- [x] `cd frontend && npx playwright test e2e/adsense-readiness.spec.ts e2e/smoke.spec.ts e2e/comprehensive.spec.ts e2e/how-it-works-cta.spec.ts` (backend and Mongo running for the smoke and comprehensive suites).
- [x] Docker: `NEXT_PUBLIC_SITE_URL=https://notasegura.example NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-1234567890123456 NEXT_PUBLIC_CONTACT_EMAIL=contato@example.com docker compose build frontend && docker compose up -d`; capture `curl -s localhost:3000/ads.txt`, `curl -s localhost:3000/robots.txt`, and `curl -s localhost:3000/ | grep -c google-adsense-account` (expect the Google line, both robots groups, and `1`); then `docker compose down`.
