# Tasks: frontend-header-nav

## Implementation (Frontend)

- [x] `frontend/src/lib/site.ts`: add `NAV_LINKS` as described in `design.md`.
- [x] `frontend/src/components/SiteNav.tsx`: client menu as described in `design.md` (Decision: Client `SiteNav` inside the server header, Decision: Visual).
- [x] `frontend/src/components/SiteHeader.tsx`: render the brand link and `SiteNav` inside `nav aria-label="Principal"`.
- [x] Scope any existing unit or E2E selector that breaks because of the duplicate link names to its `nav` landmark. Do not change any assertion.

## Menu items update (2026-10-30, Frontend)

- [x] `frontend/src/lib/site.ts`: remove the entry "Como funciona" from `NAV_LINKS`.
- [x] `frontend/src/lib/site.test.ts`: `it('lists the main menu links')` expects `[['Sobre', '/sobre'], ['Privacidade', '/privacidade'], ['Termos', '/termos'], ['Contato', '/contato']]`.
- [x] `frontend/src/components/SiteNav.test.tsx`: expect four links; remove "Como funciona" from the list of links checked for no `aria-current`.
- [x] `frontend/e2e/header-nav.spec.ts`: expect four links; delete `test('Como funciona goes to the home section')`.
- [x] `frontend/e2e/header-nav.spec.ts`: add `test('menu has no Como funciona link')` — on `/`, `nav[aria-label="Principal"]` has no link named "Como funciona".

## Tests (written by Frontend, executed by Tester)

### Unit: `frontend/src/lib/site.test.ts`

- [x] `it('lists the main menu links')` — `NAV_LINKS.map(l => [l.label, l.href])` equals `[['Como funciona', '/#como-funciona'], ['Sobre', '/sobre'], ['Privacidade', '/privacidade'], ['Termos', '/termos'], ['Contato', '/contato']]`.

### Unit: `frontend/src/components/SiteNav.test.tsx` (`vi.mock('next/navigation')` with a configurable `usePathname`)

- [x] `it('renders the five links in order')` — inside `getByRole('navigation', { name: 'Principal' })` (render via `SiteHeader`), the links have the names and `href` values of `NAV_LINKS`, in order.
- [x] `it('marks the current page')` — with `usePathname` returning `/privacidade`, link "Privacidade" has `aria-current="page"` and the other four links have no `aria-current`.
- [x] `it('marks nothing on the home page')` — with `/`, no link has `aria-current`.
- [x] `it('toggles the mobile menu')` — button "Menu" has `aria-expanded="false"` and `aria-controls="menu-principal"`; after `fireEvent.click`, `aria-expanded="true"` and `#menu-principal` is in the document; after a second click, `aria-expanded="false"`.
- [x] `it('closes on Escape and returns focus')` — open the menu, `fireEvent.keyDown(document, { key: 'Escape' })`; the button has `aria-expanded="false"` and is `document.activeElement`.
- [x] `it('closes when a link is clicked')` — open the menu, click link "Sobre" inside `#menu-principal`; the button has `aria-expanded="false"`.

### E2E: `frontend/e2e/header-nav.spec.ts` (Playwright; block `https://pagead2.googlesyndication.com/**`)

- [x] `test('desktop shows the menu on every page')` — viewport `{ width: 1280, height: 800 }`; for `/`, `/privacidade`, `/n/abc123`, `/pagina-que-nao-existe`: the five links inside `nav[aria-label="Principal"]` are visible, and button "Menu" is not visible.
- [x] `test('current page is marked')` — on `/termos`, link "Termos" in `nav[aria-label="Principal"]` has `aria-current="page"`.
- [x] ~~`test('Como funciona goes to the home section')`~~ (removed on 2026-10-30) — viewport 1280 x 800; on `/termos`, click "Como funciona" in the main menu; expect URL `/#como-funciona` and `#como-funciona` `toBeInViewport()`.
- [x] `test('mobile menu opens, navigates, and closes')` — viewport `{ width: 375, height: 812 }`; on `/`, button "Menu" has `aria-expanded="false"` and link "Sobre" in the main menu is not visible; click "Menu", expect `aria-expanded="true"` and "Sobre" visible; click "Sobre", expect URL `/sobre` and `aria-expanded="false"`.
- [x] `test('mobile menu closes on Escape')` — viewport 375 x 812; open the menu, press `Escape`; the button has `aria-expanded="false"` and is focused.
- [x] `test('mobile has no horizontal scroll')` — viewport 375 x 812; on `/` with the menu closed and open, `document.documentElement.scrollWidth <= window.innerWidth`.

### Regression

- [x] `frontend/e2e/adsense-readiness.spec.ts`, `frontend/e2e/how-it-works-cta.spec.ts`, `frontend/e2e/smoke.spec.ts`, and `frontend/e2e/comprehensive.spec.ts` pass, with only selector scoping changed.

## Validation (Tester)

- [x] Stop any process on port 3005, then `cd frontend && npm run lint && npx tsc --noEmit && npm test && npm run build`.
- [x] `cd frontend && npx playwright test e2e/header-nav.spec.ts e2e/adsense-readiness.spec.ts e2e/how-it-works-cta.spec.ts` (and `e2e/smoke.spec.ts e2e/comprehensive.spec.ts` with backend and Mongo running; start the run at second 55 to 57 of a minute to avoid the create rate limit).
