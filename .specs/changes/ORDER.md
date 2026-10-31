# Change Order

Last reviewed: 2026-10-30 (`frontend-algorithm-pages` proposed)

This file lists the active changes whose order matters, and why.
Refer to a change by its directory name, never by its position in a list.
Update this file when a change is proposed, archived, or reordered.
Delete this file when the remaining changes can apply and sync in any order.

## Sequence

| Change | Starts after |
| --- | --- |
| `backend-modular-refactor` | `backend-safenote` applied, `backend-logging` applied, `persist-application-logs` applied, `rate-limiting` applied |
| `frontend-how-it-works-cta` | (none) |
| `frontend-adsense-readiness` | `frontend-how-it-works-cta` applied |
| `frontend-header-nav` | `frontend-adsense-readiness` applied |
| `frontend-brand-and-trust-visuals` | `frontend-header-nav` applied |
| `note-limits-30-days-50-views` | (none) |
| `frontend-unify-privacy-terms` | `frontend-brand-and-trust-visuals` applied, `note-limits-30-days-50-views` applied |
| `frontend-crypto-playground` | (none) |
| `frontend-algorithm-pages` | `frontend-crypto-playground` applied, `frontend-unify-privacy-terms` applied |

## Reasons

### `frontend-algorithm-pages`

- **After `frontend-crypto-playground` (capability):** the pages reuse `ALGORITHMS` and `CryptoPlayground`, and this change edits the playground and its tests.
- **After `frontend-unify-privacy-terms` (rework):** this change edits `NAV_LINKS`, `sitemap.ts`, and the menu and sitemap tests in the state that `frontend-unify-privacy-terms` leaves them. In the other order, the menu would still list "Termos" and the sitemap `/termos`.

### `frontend-unify-privacy-terms`

- **After `frontend-brand-and-trust-visuals` (rework):** this change edits `TrustPage.tsx`, the trust pages, `TRUST_PAGES`, and the menu, which `frontend-adsense-readiness`, `frontend-header-nav`, and `frontend-brand-and-trust-visuals` create in that order. Applying it earlier would merge `/termos` into a page that does not have its final layout yet.
- **After `note-limits-30-days-50-views` (rework):** that change edits the text of `privacidade/page.tsx` and its test. This change moves the same text into the unified page; in the other order, the 30-day text would be edited on a moved file.

### `frontend-brand-and-trust-visuals`

- **After `frontend-header-nav` (rework):** both edit `SiteHeader.tsx`. The menu update in `frontend-header-nav` lands first, so the logo does not rework the header twice.

### `frontend-header-nav`

- **After `frontend-adsense-readiness` (capability):** the menu goes into `SiteHeader` and reuses `TRUST_PAGES`, which `frontend-adsense-readiness` adds.

### `frontend-adsense-readiness`

- **After `frontend-how-it-works-cta` (rework):** this change moves `frontend/src/app/page.tsx` and `frontend/src/app/page.test.tsx` into `frontend/src/app/(site)/` and removes the inline header. Applying `frontend-how-it-works-cta` after the move would recreate the files at the old path.

### `backend-modular-refactor`

- **After `backend-safenote` (rework):** the refactor moves the note entity, ports, use cases, controller, and DTO to `src/modules/notes/`. Applying `backend-safenote` after the refactor would recreate the old `src/domain/` and `src/application/` paths.
- **After `backend-logging` (rework):** the refactor moves the logging code to `src/platform/logging/`. Applying `backend-logging` after the refactor would target files that no longer exist.
- **After `persist-application-logs` (rework):** the refactor moves the log schema, log store, and interceptor. Applying that change after the refactor would target the old paths.
- **After `rate-limiting` (rework):** the refactor moves the guard, store, and schema to `src/platform/rate-limit/`. Applying `rate-limiting` after the refactor would recreate `src/application/rate-limit/` and `src/presentation/rate-limit/`.

## Shared requirements

- `frontend`: `Trust pages`: `frontend-adsense-readiness`, `frontend-unify-privacy-terms`.
- `frontend`: `Site navigation`: `frontend-adsense-readiness`, `frontend-unify-privacy-terms`.
- `frontend`: `Sitemap`: `frontend-adsense-readiness`, `frontend-unify-privacy-terms`, `frontend-algorithm-pages`.
- `frontend`: `Main menu in the header`: `frontend-header-nav`, `frontend-unify-privacy-terms`, `frontend-algorithm-pages`.
- `frontend`: `Responsive main menu`: `frontend-header-nav`, `frontend-unify-privacy-terms`, `frontend-algorithm-pages`.
- `frontend`: `Trust page layout`: `frontend-brand-and-trust-visuals`, `frontend-unify-privacy-terms`.

## Not scheduled

| Change | Starts when |
| --- | --- |
| `nestjs-logging` | Do not start. Superseded by `persist-application-logs` on 2026-10-24. Do not apply it. Do not sync it. |

## Independent

- `backend-env-config`
- `frontend-safenote`
- `frontend-feature`
- `backend-invalid-note-id`
- `rate-limit-configurable`
