# Tasks: note-limits-30-days-50-views

## Backend validation

- [x] `backend/src/modules/notes/presentation/create-note.dto.ts`: change `@Max(7)` on `expiresInDays` to `@Max(30)`, and `@Max(10)` on `maxViews` to `@Max(50)`.

### Unit: `backend/src/modules/notes/presentation/create-note.dto.spec.ts` (new; use `plainToInstance` and `validate` from `class-validator`)

- [x] `it('accepts 30 days and 50 views')` — `validate` on `{ text: 'hi', expiresInDays: 30, maxViews: 50 }` returns no errors.
- [x] `it('rejects expiresInDays above 30')` — with `expiresInDays: 31`, the errors contain one error whose `property` is `expiresInDays`.
- [x] `it('rejects maxViews above 50')` — with `maxViews: 51`, the errors contain one error whose `property` is `maxViews`.
- [x] `it.each([['expiresInDays', 0], ['maxViews', 0]])('rejects %s=%p')` — the errors contain one error whose `property` is the named field.

### Unit: `backend/src/modules/notes/application/create-note.use-case.spec.ts`

- [x] `it('sets expiresAt 30 days after creation')` — with `jest.useFakeTimers().setSystemTime(new Date('2026-01-01T00:00:00Z'))`, `execute({ text: 'hi', expiresInDays: 30, maxViews: 50 })` persists a note whose `expiresAt` equals `new Date('2026-01-31T00:00:00Z')` and whose `maxViews` is `50`. Restore real timers in `afterEach`.

### E2E: `backend/test/notes.e2e-spec.ts`

- [x] Add `it('creates a note with 30 days and 50 views')` — `POST /api/notes` with `{ text: 'hello', expiresInDays: 30, maxViews: 50 }` returns `201`.
- [x] Rename `it('rejects expiresInDays above 7')` to `it('rejects expiresInDays above 30')` and send `expiresInDays: 31`; assert `400`.
- [x] Rename `it('rejects maxViews above 10')` to `it('rejects maxViews above 50')` and send `maxViews: 51`; assert `400`.

## Frontend form and texts

- [x] `frontend/src/app/(site)/page.tsx`: set the days input to `max={30}` and its label to "Expiração (dias 1-30)"; set the views input to `max={50}` and its label to "Máximo de visualizações (1-50)".
- [x] `frontend/src/app/(site)/page.tsx`: in the "Como funciona" step 1 text, change "(1-7)" to "(1-30)" and "(1-10)" to "(1-50)".
- [x] `frontend/src/app/(site)/sobre/page.tsx`: change "de 1 a 7" to "de 1 a 30" and "de 1 a 10" to "de 1 a 50".
- [x] `frontend/src/app/(site)/privacidade/page.tsx`: change "no máximo 7 dias após a criação" to "no máximo 30 dias após a criação".

### Unit: `frontend/src/app/(site)/page.test.tsx`

- [x] `it('limits the days input to 1-30')` — the input inside the label that contains "Expiração" has `min="1"` and `max="30"`, and the label text contains `1-30`.
- [x] `it('limits the views input to 1-50')` — the input inside the label that contains "Máximo de visualizações" has `min="1"` and `max="50"`, and the label text contains `1-50`.
- [x] `it('states the new limits in Como funciona')` — the text of `#como-funciona` contains `(1-30)` and `(1-50)`, and does not contain `(1-7)` or `(1-10)`.

### Unit: `frontend/src/app/(site)/sobre/page.test.tsx` (new)

- [x] `it('states the 30-day and 50-view limits')` — the page text contains `de 1 a 30` and `de 1 a 50`, and does not contain `de 1 a 7` or `de 1 a 10`.

### Unit: `frontend/src/app/(site)/privacidade/page.test.tsx`

- [x] `it('states the 30-day maximum')` — the page text contains `no máximo 30 dias após a criação` and does not contain `7 dias`.

### E2E: `frontend/e2e/comprehensive.spec.ts`

- [x] In `test('validation errors 400')`, change the `badViews` payload to `maxViews: 51`, and add `badDaysMax` with `expiresInDays: 31`; assert `400` for both.

## Docs

- [x] `AGENTS.md` (root), section Notes: change "1–7 days, 1–10 views" to "1–30 days, 1–50 views".
- [x] `backend/AGENTS.md`: change "expiresInDays 1-7, maxViews 1-10" to "expiresInDays 1-30, maxViews 1-50".
- [x] `docs/poc.md`: change the maximums to 30 days and 50 views in both places.

## Validation (Tester)

- [x] `cd backend && npm run lint && npx tsc --noEmit && npm test && npm run build`
- [x] `cd backend && npm run test:e2e` (Mongo running)
- [x] `cd frontend && ./validate.sh` (backend running on :3001 for Playwright)
