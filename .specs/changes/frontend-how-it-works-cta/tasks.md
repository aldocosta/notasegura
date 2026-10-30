# Tasks: frontend-how-it-works-cta

## Implementation (Frontend)
- [x] `frontend/src/app/page.tsx`: add `id="criar-nota"` to the section that contains the "Criar uma nota" heading.
- [x] `frontend/src/app/page.tsx`: add `aria-label="Texto da nota"` to the note textarea.
- [x] `frontend/src/app/page.tsx`: at the end of the `#como-funciona` card (after the "Dica" paragraph), add the anchor "Criar 1 Nota" with `href="#criar-nota"`, smooth `scrollIntoView({ behavior: "smooth", block: "start" })` on `#criar-nota`, and `focus({ preventScroll: true })` on the textarea, styled per `design.md`.
- [x] `frontend/vitest.config.ts`: add `resolve.alias` `"@"` → `./src` so unit tests can import `src/app/page.tsx`.

## Tests (written by Frontend, executed by Tester)

### Unit: `frontend/src/app/page.test.tsx` (Vitest + Testing Library, mock `@/lib/api`, stub `Element.prototype.scrollIntoView` with `vi.fn()`)
- [x] `it('renders the "Criar 1 Nota" link inside the "Como funciona" section')` — `within(container.querySelector('#como-funciona')).getByRole('link', { name: 'Criar 1 Nota' })` exists and has attribute `href="#criar-nota"`.
- [x] `it('places "Criar 1 Nota" as the last interactive element of the card')` — the last element matching `a, button` inside `#como-funciona` has text content `Criar 1 Nota`.
- [x] `it('has a #criar-nota section containing the create note form')` — `document.getElementById('criar-nota')` is not null and contains the heading `getByRole('heading', { name: 'Criar uma nota' })`.
- [x] `it('scrolls smoothly to the form when "Criar 1 Nota" is clicked')` — after `fireEvent.click`, the `scrollIntoView` mock was called once with `{ behavior: 'smooth', block: 'start' }`, and `mock.contexts[0]` is the `#criar-nota` element.
- [x] `it('focuses the note textarea after clicking "Criar 1 Nota"')` — after the click, `document.activeElement` is `getByRole('textbox', { name: 'Texto da nota' })`.
- [x] `it('keeps "Como Funciona!" scrolling to #como-funciona')` (regression) — clicking `getByRole('link', { name: 'Como Funciona!' })` calls `scrollIntoView` with context `#como-funciona`.

### E2E: `frontend/e2e/how-it-works-cta.spec.ts` (Playwright)
- [x] `test('"Criar 1 Nota" scrolls back to the create note form')` — go to `/`, click link "Como Funciona!", expect `#como-funciona` `toBeInViewport()`; click link "Criar 1 Nota", expect `#criar-nota` `toBeInViewport()` and textbox "Texto da nota" `toBeFocused()`.
- [x] `test('"Criar 1 Nota" is full width on mobile')` — with viewport `{ width: 375, height: 812 }`, the bounding box width of link "Criar 1 Nota" equals the width of its parent card content box (tolerance ±2px).
- [x] `test('"Criar 1 Nota" is reachable by keyboard')` — focus link "Criar 1 Nota" via `locator.focus()`, press `Enter`, expect textbox "Texto da nota" `toBeFocused()`.

### Regression
- [x] Existing `frontend/e2e/smoke.spec.ts` and `frontend/e2e/comprehensive.spec.ts` "UI flows" still pass unchanged.

## Validation (Tester)
- [x] `cd frontend && npm run lint && npx tsc --noEmit && npm test && npm run build`
- [x] `cd frontend && npx playwright test e2e/how-it-works-cta.spec.ts e2e/smoke.spec.ts`

## Update 2026-10-30 (Frontend)
- [x] `frontend/src/app/(site)/page.tsx`: move the `#como-funciona` section above the `#criar-nota` section. Change no content or class.
- [x] `frontend/src/app/(site)/page.tsx`: change the CTA label to `Criar a primeira nota`.
- [x] `frontend/src/app/(site)/page.test.tsx`: replace the name "Criar 1 Nota" with "Criar a primeira nota" in every test (requirement change, assertions otherwise unchanged).
- [x] `frontend/src/app/(site)/page.test.tsx`: add `it('places Como funciona before the form')` — `document.getElementById('como-funciona').compareDocumentPosition(document.getElementById('criar-nota'))` has the bit `Node.DOCUMENT_POSITION_FOLLOWING`.
- [x] `frontend/e2e/how-it-works-cta.spec.ts`: replace the name "Criar 1 Nota" with "Criar a primeira nota"; rename the first test to `'"Criar a primeira nota" scrolls to the create note form'`.
- [x] `frontend/e2e/how-it-works-cta.spec.ts`: add `test('Como funciona is above the form')` — at 375 x 812 and at 1280 x 800, the bounding box `y` of `#como-funciona` is smaller than that of `#criar-nota`.

## Validation of the update (Tester)
- [x] `cd frontend && npm run lint && npx tsc --noEmit && npm test && npm run build`
- [x] `cd frontend && npx playwright test e2e/how-it-works-cta.spec.ts e2e/header-nav.spec.ts e2e/brand-and-trust-visuals.spec.ts e2e/adsense-readiness.spec.ts`, then `e2e/smoke.spec.ts e2e/comprehensive.spec.ts` with backend and Mongo, started at second 55 to 57.
