# Tasks: frontend-brand-and-trust-visuals

## Graphics (Frontend)

- [x] `frontend/src/components/icons.tsx`: icon set as described in `design.md` (Decision: Icon set).
- [x] `frontend/src/components/Logo.tsx`: `LogoMark` and `Logo` as described in `design.md` (Decisions: Logo artwork, Logo components).
- [x] `frontend/src/app/icon.svg`: the symbol with literal colors. Delete `frontend/src/app/favicon.ico`.

### Unit: `frontend/src/components/Logo.test.tsx`

- [x] `it('hides the mark from assistive technology')` — `render(<LogoMark />)`; the `svg` has `aria-hidden="true"` and `focusable="false"`.
- [x] `it('renders the wordmark with the BR badge')` — `render(<Logo />)`; the text contains "Nota Segura" and an element with text "BR".
- [x] `it('omits the wordmark when asked')` — `render(<Logo showWordmark={false} />)`; no text "Nota Segura".
- [x] `it('uses white on the inverse tone')` — `render(<LogoMark tone="inverse" />)`; the sheet shape has `fill` `#ffffff` or `currentColor` with a white `color` class, and the keyhole uses the primary color.

### Unit: `frontend/src/components/icons.test.tsx`

- [x] `it.each(Object.entries(icons))('%s is decorative')` — each icon renders one `svg` with `aria-hidden="true"` and `viewBox="0 0 24 24"`.

## Placement (Frontend)

- [x] `frontend/src/components/SiteHeader.tsx`: replace the text link with `<Link href="/" aria-label="Nota Segura - BR"><Logo /></Link>`.
- [x] `frontend/src/components/SiteFooter.tsx`: render `Logo` at the start of the footer.
- [x] `frontend/src/app/not-found.tsx`: render `LogoMark size={64}` above the `h1`.

### Unit: `frontend/src/components/SiteHeader.test.tsx`

- [x] Keep `it('links the brand to the home page')` unchanged.
- [x] `it('shows the logo in the brand link')` — the link named "Nota Segura - BR" contains an `svg` and the text "BR".

### Unit: `frontend/src/components/SiteFooter.test.tsx`

- [x] `it('shows the logo')` — the footer contains an `svg` with `aria-hidden="true"` and the text "Nota Segura".

### Unit: `frontend/src/app/not-found.test.tsx`

- [x] `it('shows the logo symbol')` — the rendered page contains an `svg`.

## Trust pages (Frontend)

- [x] `frontend/src/components/TrustPage.tsx`: hero, highlights, and `TrustSection` icon and tone, as described in `design.md` (Decision: Trust page layout).
- [x] `frontend/src/app/(site)/sobre/page.tsx`: hero icon, lead, highlights, and section icons from the table in `design.md`. Keep the section text.
- [x] `frontend/src/app/(site)/privacidade/page.tsx`: same, with the passphrase section as `tone="mint"`. Keep the section text and links.
- [x] `frontend/src/app/(site)/termos/page.tsx`: same. Keep the section text.
- [x] `frontend/src/app/(site)/contato/page.tsx`: same, plus the contact card with "Enviar e-mail" (Decision: Contact call to action); "O que não conseguimos fazer" as `tone="mint"`.

### Unit: `frontend/src/components/TrustPage.test.tsx`

- [x] `it('renders the hero with icon, title, and lead')` — the element `[data-hero]` contains the `h1`, an `svg`, and the lead text.
- [x] `it('renders one tile per highlight')` — with three highlights, `getAllByRole('listitem')` inside the highlights list has length 3, and each contains an `svg` and its title.
- [x] `it('renders an icon next to a section heading')` — `TrustSection` with `title` and `icon` renders an `svg` in the same row as the `h2`.
- [x] `it('renders the mint tone')` — `TrustSection tone="mint"` has the class `bg-mint-50`.

### Unit: `frontend/src/app/(site)/trust-pages.test.tsx`

- [x] Keep `it.each(...)('renders one h1 and at least three paragraphs')` unchanged.
- [x] `it.each([Sobre, Privacidade, Termos, Contato])('shows a hero and at least three highlights')` — `[data-hero]` exists and contains the `h1`; the highlights list has at least 3 items.
- [x] `it.each([Sobre, Privacidade, Termos, Contato])('hides every svg')` — every `svg` has `aria-hidden="true"`.
- [x] `it('shows an icon next to every h2 on /privacidade')` — for each `h2`, its parent row contains an `svg`.

### Unit: `frontend/src/app/(site)/contato/page.test.tsx`

- [x] Keep the existing tests unchanged.
- [x] `it('shows the Enviar e-mail button')` — with `NEXT_PUBLIC_CONTACT_EMAIL="contato@example.com"`, link "Enviar e-mail" has `href` `mailto:contato@example.com`.
- [x] `it('hides the button without an email')` — with the variable unset, no link named "Enviar e-mail".

## E2E: `frontend/e2e/brand-and-trust-visuals.spec.ts` (Playwright; block `https://pagead2.googlesyndication.com/**`)

- [x] `test('header logo on every page')` — for `/`, `/sobre`, `/n/abc123`, `/pagina-que-nao-existe`: link "Nota Segura - BR" (exact) has `href` `/` and contains a visible `svg`.
- [x] `test('404 shows the logo in content and footer')` — on `/pagina-que-nao-existe`, `main svg` and `footer svg` are visible.
- [x] `test('site icon is the logo')` — `request.get('/icon.svg')` has status 200 and `content-type` starting with `image/svg+xml`; the body of `request.get('/')` contains `rel="icon"` and `href="/icon.svg`; `request.get('/favicon.ico')` has status 404.
- [x] `test('trust pages show hero and highlights')` — for each trust page: `[data-hero] h1` is visible and the highlights list has at least 3 visible items.
- [x] `test('highlights stack on mobile and align on desktop')` — on `/privacidade`: at 375 x 812, the first two tiles have different `y` and equal `x` (±2px); at 1280 x 800, the three tiles have equal `y` (±2px).
- [x] `test('trust pages fit a mobile viewport')` — at 375 x 812, for each trust page, `scrollWidth <= innerWidth`.
- [x] `test('contact button opens mail')` — on `/contato`, link "Enviar e-mail" has `href` `mailto:contato@example.com`.

### Regression

- [x] `frontend/e2e/adsense-readiness.spec.ts`, `frontend/e2e/header-nav.spec.ts`, `frontend/e2e/how-it-works-cta.spec.ts`, `frontend/e2e/smoke.spec.ts`, and `frontend/e2e/comprehensive.spec.ts` pass unchanged.

## Validation (Tester)

- [x] Stop any dev server on port 3005, then `cd frontend && npm run lint && npx tsc --noEmit && npm test && npm run build`.
- [x] `cd frontend && npx playwright test e2e/brand-and-trust-visuals.spec.ts e2e/header-nav.spec.ts e2e/adsense-readiness.spec.ts e2e/how-it-works-cta.spec.ts`.
- [x] With backend and Mongo running, start `npx playwright test e2e/smoke.spec.ts e2e/comprehensive.spec.ts` at second 55 to 57 of a minute.
- [x] Capture screenshots of `/sobre`, `/privacidade`, `/termos`, `/contato`, and the header at 375 x 812 and 1280 x 800 into `frontend/test-results/brand-visuals/` for the owner's review.
