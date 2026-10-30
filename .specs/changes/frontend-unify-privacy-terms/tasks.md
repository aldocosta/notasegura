# Tasks: frontend-unify-privacy-terms

## Implementation (Frontend)

- [ ] `frontend/src/components/TrustPage.tsx`: add the optional prop `level?: 2 | 3` (default `2`) to `TrustSection`, and add `TrustPart` as described in `design.md` (Decision: Page structure with parts).
- [ ] `frontend/src/lib/site.ts`: remove the `/termos` entry from `TRUST_PAGES` and rename the `/privacidade` label to "Privacidade e Termos" (Decision: Links and labels).
- [ ] `frontend/src/app/(site)/privacidade/page.tsx`: build the unified page as described in `design.md` (Decision: Page content).
- [ ] Delete `frontend/src/app/(site)/termos/page.tsx` and its directory.
- [ ] `frontend/next.config.ts`: add `redirects()` with `{ source: "/termos", destination: "/privacidade#termos", permanent: true }` (Decision: Redirect in `next.config.ts`).
- [ ] `frontend/src/app/(site)/sobre/page.tsx`: replace the two links to `/privacidade` and `/termos` with one link "Política de Privacidade e Termos de Uso" to `/privacidade` (Decision: Links and labels).

## Tests (written by Frontend, executed by Tester)

Existing assertions change only where the requirement changed (four trust pages become three, the labels "Privacidade" and "Termos" become "Privacidade e Termos"). Do not weaken any other assertion.

### Unit: `frontend/src/components/TrustPage.test.tsx`

- [ ] `it('renders a part with an anchor and an icon')` — render `<TrustPart id="termos" title="Termos de Uso" icon={IconScale}><p>Texto.</p></TrustPart>`; `container.querySelector('#termos')` is a `section` that contains `getByRole('heading', { level: 2, name: 'Termos de Uso' })`; the heading's `parentElement` contains an `svg`; the section has `aria-labelledby` equal to the heading `id`.
- [ ] `it('renders a section heading at level 3')` — render `<TrustSection title="Seção" icon={IconLock} level={3}>`; `getByRole('heading', { level: 3, name: 'Seção' })` exists, its `parentElement` contains an `svg`, and `queryByRole('heading', { level: 2 })` is `null`.
- [ ] Keep `it('renders an icon next to a section heading')` unchanged (default level stays `h2`).

### Unit: `frontend/src/app/(site)/privacidade/page.test.tsx`

- [ ] Keep `it('discloses advertising cookies')`, `it('states the 30-day maximum')`, and `it('discloses data handling')` unchanged.
- [ ] `it('has the unified title')` — `getByRole('heading', { level: 1 })` has the text "Política de Privacidade e Termos de Uso"; the exported `metadata.title` equals "Política de Privacidade e Termos de Uso".
- [ ] `it('shows the privacy part before the terms part')` — `container.querySelector('#privacidade')` contains the `h2` "Política de Privacidade"; `container.querySelector('#termos')` contains the `h2` "Termos de Uso"; `privacy.compareDocumentPosition(terms) & Node.DOCUMENT_POSITION_FOLLOWING` is truthy.
- [ ] `it('links to both parts before the privacy part')` — the links with `href` `#privacidade` and `#termos` exist, and for each, `link.compareDocumentPosition(privacyPart) & Node.DOCUMENT_POSITION_FOLLOWING` is truthy.
- [ ] `it('discloses the terms of use')` — the `textContent` of `#termos` contains "conteúdo ilegal", "malware", "no estado em que se encontra", and "República Federativa do Brasil"; `#termos` contains a link with `href` `/contato`.
- [ ] `it('does not link to /termos')` — no link on the page has `href` `/termos`.

### Unit: `frontend/src/app/(site)/trust-pages.test.tsx`

- [ ] Remove the `Termos` import and the `["Termos", Termos]` entries from both lists, so that the parametrized tests run on `Sobre`, `Privacidade`, and `Contato`.
- [ ] Rename `it('shows an icon next to every h2 on /privacidade')` to `it('shows an icon next to every h2 and h3 on /privacidade')`; it collects the headings of level 2 and level 3, expects at least 2 `h2` and at least 9 `h3`, and expects an `svg` in each heading's `parentElement`.

### Unit: `frontend/src/lib/site.test.ts`

- [ ] Rename `it('lists the four trust pages')` to `it('lists the three trust pages')` — `hrefs` equal `["/sobre", "/privacidade", "/contato"]`; `labels` equal `["Sobre", "Privacidade e Termos", "Contato"]`.
- [ ] `it('lists the main menu links')` — `NAV_LINKS.map(l => [l.label, l.href])` equals `[["Sobre", "/sobre"], ["Privacidade e Termos", "/privacidade"], ["Contato", "/contato"]]`.

### Unit: `frontend/src/components/SiteFooter.test.tsx`

- [ ] Rename `it('links to the four trust pages')` to `it('links to the three trust pages')` — expected links `[["Sobre", "/sobre"], ["Privacidade e Termos", "/privacidade"], ["Contato", "/contato"]]`; add: `queryByRole('link', { name: 'Termos', exact: true })` is `null` and no link has `href` `/termos`.

### Unit: `frontend/src/components/SiteNav.test.tsx`

- [ ] The link-order test expects three links with the names and `href` values of `NAV_LINKS`, in order.
- [ ] `it('marks the current page')` — with `usePathname` returning `/privacidade`, the link "Privacidade e Termos" has `aria-current="page"`; "Sobre" and "Contato" have no `aria-current`.

### Unit: `frontend/src/app/sitemap.test.ts`

- [ ] The listed-pages test expects exactly four URLs: `https://notasegura.example`, `https://notasegura.example/sobre`, `https://notasegura.example/privacidade`, `https://notasegura.example/contato`; no URL contains `/termos`.

### Unit: `frontend/src/app/(site)/sobre/page.test.tsx`

- [ ] `it('links to the unified privacy and terms page')` — a link named "Política de Privacidade e Termos de Uso" has `href` `/privacidade`; no link has `href` `/termos`.

### Unit: `frontend/next.config.test.ts` (new)

- [ ] `it('redirects /termos permanently to the terms part')` — `await nextConfig.redirects!()` equals `[{ source: "/termos", destination: "/privacidade#termos", permanent: true }]`.

### E2E: `frontend/e2e/privacy-terms-unified.spec.ts` (new; Playwright; block `https://pagead2.googlesyndication.com/**`)

- [ ] `test('terms URL redirects permanently')` — `request.get('/termos', { maxRedirects: 0 })`; status is 308; header `location` ends with `/privacidade#termos`.
- [ ] `test('old terms link lands on the terms part')` — viewport 1280 x 800; `page.goto('/termos')`; URL matches `/\/privacidade#termos$/`; `getByRole('heading', { level: 2, name: 'Termos de Uso' })` is `toBeInViewport()`.
- [ ] `test('unified page serves both parts without JavaScript')` — `request.get('/privacidade')`; status 200; the HTML has exactly one `<h1`, contains `id="privacidade"`, `id="termos"`, "Política de Privacidade e Termos de Uso", and does not contain `href="/termos"`.
- [ ] `test('anchor links jump to each part')` — on `/privacidade`, click the link with `href` `#termos`; URL ends with `#termos` and the `h2` "Termos de Uso" is in the viewport; click the link with `href` `#privacidade`; the `h2` "Política de Privacidade" is in the viewport.
- [ ] `test('menu and footer show three trust links')` — viewport 1280 x 800; on `/`, `nav[aria-label="Principal"]` and `nav[aria-label="Rodapé"]` each have exactly the links "Sobre" (`/sobre`), "Privacidade e Termos" (`/privacidade`), and "Contato" (`/contato`), in order, all visible.
- [ ] `test('header fits at 640px')` — viewport 640 x 800; on `/`, the three links in `nav[aria-label="Principal"]` are visible and `document.documentElement.scrollWidth <= window.innerWidth`.
- [ ] `test('unified page has no horizontal scroll on mobile')` — viewport 375 x 812; on `/privacidade` with the menu closed and open, `document.documentElement.scrollWidth <= window.innerWidth`.

### E2E: update existing specs

- [ ] `frontend/e2e/adsense-readiness.spec.ts`: `TRUST_PAGES` becomes `["/sobre", "/privacidade", "/contato"]`; `FOOTER_LINKS` becomes `[["Sobre", "/sobre"], ["Privacidade e Termos", "/privacidade"], ["Contato", "/contato"]]`; `test('footer navigates between trust pages')` starts on `/sobre` and clicks "Privacidade e Termos"; the sitemap test expects the four URLs listed in the sitemap unit task and no `/termos`.
- [ ] `frontend/e2e/brand-and-trust-visuals.spec.ts`: `TRUST_PAGES` becomes `["/sobre", "/privacidade", "/contato"]`.
- [ ] `frontend/e2e/header-nav.spec.ts`: the expected links become `[["Sobre", "/sobre"], ["Privacidade e Termos", "/privacidade"], ["Contato", "/contato"]]`; `test('current page is marked')` opens `/privacidade` and expects "Privacidade e Termos" in `nav[aria-label="Principal"]` to have `aria-current="page"`.

### Regression

- [ ] `frontend/e2e/how-it-works-cta.spec.ts`, `frontend/e2e/smoke.spec.ts`, and `frontend/e2e/comprehensive.spec.ts` pass without changes.

## Validation (Tester)

- [ ] Stop any process on port 3005, then `cd frontend && npm run lint && npx tsc --noEmit && npm test && npm run build`.
- [ ] `cd frontend && npx playwright test e2e/privacy-terms-unified.spec.ts e2e/adsense-readiness.spec.ts e2e/brand-and-trust-visuals.spec.ts e2e/header-nav.spec.ts e2e/how-it-works-cta.spec.ts` (and `e2e/smoke.spec.ts e2e/comprehensive.spec.ts` with backend and Mongo running).
- [ ] Browser check (portal): open `/termos`, confirm the landing on the "Termos de Uso" part; check the header at 640px and the menu at 375px.
