# Change Order

Last reviewed: 2026-10-30 (`note-limits-30-days-50-views` proposed)

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

## Reasons

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
- `note-limits-30-days-50-views`
