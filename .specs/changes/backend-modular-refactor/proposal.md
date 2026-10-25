# Proposal: Backend Modular Refactor

## Intent

The backend groups code by technical layer at the root of `src/`. Every business capability is split across `src/domain/`, `src/application/`, `src/infrastructure/`, and `src/presentation/`. Adding one capability forces edits in four directories, and the single business capability of the product is the only part of the codebase without its own boundary.

This change inverts the axes. Each business capability becomes one module directory that holds its own layers. Technical capabilities move to a separate platform area. The HTTP contract does not change.

## User Stories

### Story: predictable-change

As a developer, I want a new business capability to live in a single directory, so that adding it does not require edits in four top-level layer directories.

### Story: enforceable-boundaries

As a developer, I want the module boundaries to be checked by an automated test, so that the structure does not erode back into a layer-first layout.

### Story: unchanged-behavior

As a person sharing a note, I want the API to behave the same after the reorganization, so that existing links and clients keep working.

## Scope

**In scope:**

- Move the notes capability to `src/modules/notes/` with `domain/`, `application/`, `infrastructure/`, and `presentation/` inside the module.
- Move the repository port and the crypto port to the module `domain/` directory. The AGENTS.md statement that ports live in `application/` is superseded.
- Replace Nest HTTP exceptions in use cases with domain errors. Add one HTTP exception filter in `src/platform/errors/`.
- Move logging, rate limiting, and health to `src/platform/`. Platform capabilities stay flat. They do not get the four-layer template.
- Delete the root layer directories `src/domain/`, `src/application/`, `src/infrastructure/`, and `src/presentation/`.
- Delete dead code: `LoggingExceptionFilter`, `getNormalizedPath`, `RATE_LIMIT_READ_MAX`, and the duplicated interceptor registration.
- Keep `AppController`, `AppService`, and `GET /`. The route stays `200` with `Hello World!`.
- Add `src/architecture.spec.ts` to enforce layout, dependency direction, cross-module isolation, and framework isolation.
- Add `test/notes.e2e-spec.ts` as a regression suite for the preserved HTTP contract.
- Move existing spec files with their subjects. No assertion changes, except import paths.
- Remove the swallowed lint failure in `backend/validate.sh`.
- Update `backend/AGENTS.md`, the root `AGENTS.md`, and `backend/README.md` to match the new layout.

**Out of scope:**

- Atomic view counting. The read-modify-write race on `maxViews` stays as it is.
- Deletion of a note after the last view. TTL deletion stays the only deletion path.
- `410 Gone` for an expired or consumed note. The current `404` stays.
- Passphrase transport. The passphrase stays in the query string.
- `400` for a malformed note id. The current behavior stays.
- Read rate limiting. Only `POST /api/notes` stays limited.
- CORS policy, security headers, environment validation, Terminus health, and shutdown hooks. Environment validation belongs to `backend-env-config`.
- New features, new endpoints, and frontend changes.

The defects listed in "Out of scope" get a follow-up change named `backend-contract-fixes`.

## Approach

Use vertical slices with layers inside each slice. The module boundary is the NestJS module boundary, so the framework checks isolation at runtime through dependency injection. `src/modules/<capability>/` holds `domain/`, `application/`, `infrastructure/`, and `presentation/`, plus one module file at the module root that binds ports to adapters.

Platform capabilities do not have domain rules. They are framework glue. Each one stays flat in one directory: `src/platform/logging/`, `src/platform/rate-limit/`, `src/platform/health/`, and `src/platform/errors/`.

Make the error boundary explicit. Use cases throw domain errors. The notes module maps its own domain errors to HTTP. A platform filter maps every other error to `500`. The response body stays byte-identical to the current Nest default for the same status.

Each platform concern keeps the Nest primitive that matches its place in the request lifecycle. Logging stays an interceptor. Rate limiting stays a guard. Error mapping stays an exception filter. Health stays a controller. This change does not rewrite any of them as middleware.

Keep every observable behavior. The refactor moves files and changes wiring. It does not change status codes, response bodies, headers, encryption output shape, TTL indexes, or log records.

## Resolved Questions

- 2026-10-25 Layer-first layout at the root of `src/`: the project replaces it with vertical slices. Each business capability gets one module directory, and its layers live inside that directory. Decided with the user.
- 2026-10-25 Contract defects in this change: they stay out. The follow-up change `backend-contract-fixes` owns the view-count race, deletion after the last view, `410` versus `404`, the passphrase in the query string, and `500` for a malformed note id. The user delegated the choice. Decided with the user.
- 2026-10-25 Module path: `src/modules/<capability>/`. Decided with the user.
- 2026-10-25 Platform shape and Nest primitives: `src/platform/` stays flat. Logging stays an interceptor, rate limiting stays a guard, error mapping stays an exception filter, and health stays a controller. Middleware does not replace them. The user asked whether middleware or interceptors could replace the platform slices. Decided with the user.
- 2026-10-25 Root route: `GET /` stays. `AppController` and `AppService` stay. The response stays `200` with `Hello World!`. Decided with the user.
- 2026-10-25 Shared kernel: no `src/shared/` in this change. A module may import `src/platform/` and another module's public entry point. Any other cross-module import fails the architecture test. Add a shared folder only when a second business module needs one. Decided with the user.
