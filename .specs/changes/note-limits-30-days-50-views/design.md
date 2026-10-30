# Design: note-limits-30-days-50-views

## Context

- `backend/src/modules/notes/presentation/create-note.dto.ts` validates `expiresInDays` with `@Min(1) @Max(7)` and `maxViews` with `@Min(1) @Max(10)`. An invalid value gives HTTP 400.
- `CreateNoteUseCase` computes `expiresAt` as now plus `expiresInDays` days. It has no upper limit of its own.
- The note schema has a TTL index on `expiresAt`, so MongoDB removes a note at its expiry date for any lifetime.
- `frontend/src/app/(site)/page.tsx` has two number inputs with `max={7}` and `max={10}`, the labels "Expiração (dias 1-7)" and "Máximo de visualizações (1-10)", and the "Como funciona" text "(1-7)" and "(1-10)".
- `/sobre` states "de 1 a 7" and "de 1 a 10". `/privacidade` states "no máximo 7 dias após a criação".
- Tests that assert the old limits: `backend/test/notes.e2e-spec.ts` (`expiresInDays: 8` and `maxViews: 11` give 400) and `frontend/e2e/comprehensive.spec.ts` (`maxViews: 11` gives 400).

## Decisions

### Decision: Change the limits in place

**Chosen:** Change the numbers in `CreateNoteDto`, in the form, and in the texts. Do not add shared constants or configuration.

**Rationale:** The limits are product rules, not per-environment settings. Each limit appears once in the backend and once in the form.

**Alternatives considered:**

- Environment variables, like the rate limit: the frontend form and texts would need the values at build time, and no environment needs other values.
- One shared constants module for backend and frontend: the two projects do not share code.

## Risks

- **Scenario in `backend-modular-refactor`**: its delta spec has the scenario "Invalid payload" with `expiresInDays` equal to `8` and status `400`. After this change, `8` is valid. This change does not edit that spec. The user decides how to handle it.
- **Longer storage**: notes stay in the database for up to 30 days instead of 7. The privacy page states the new maximum.
