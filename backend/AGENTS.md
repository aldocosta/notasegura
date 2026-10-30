# Backend (NestJS + Clean Architecture)

## Architecture model (reference)

Clean Architecture + DDD (rich domain entities) with use cases and repository pattern:
- business capabilities live in `src/modules/<capability>/` with inner `domain/`, `application/`, `infrastructure/`, `presentation/`.
- technical capabilities live in `src/platform/` (logging, rate-limit, health, errors).
- ports (`NoteRepository`, `CryptoService`) live in the module `domain/` directory.
- use cases throw domain errors (`NoteNotFound`, `NoteExpired`, `InvalidPassphrase`); HTTP mapping happens in `presentation/notes-error.filter.ts`.

Repository pattern: `NoteRepository` port in domain, `MongooseNoteRepository` adapter in infrastructure.
DDD: entities encapsulate invariants/behavior; not anemic models.

Dependencies point inward. NestJS DI wires implementations to interfaces.

Layer layout:
```
src/
  modules/notes/{domain,application,infrastructure,presentation}/
  platform/{errors,logging,rate-limit,health}/
```

Use cases:
- CreateNoteUseCase.execute(input) → validates constraints, encrypts, persists, returns { id, url }.
- GetNoteUseCase.execute(id, passphrase?) → fetches, checks expiry/views, decrypts, increments views, deletes if consumed.

Error contract: 400 validation, 404 not found, 410 expired/consumed, 401 passphrase required/invalid.

Constraints: expiresInDays 1-30, maxViews 1-50. Passphrase optional, part of encryption key (never stored in clear).

## Node version
- Use Node v24.13.0 (latest installed): `nvm use v24.13.0` (Node >=22 required; @nestjs/config v12 is ESM-only).

## Commands
- dev: `npm run start:dev`
- build: `npm run build`
- test: `npm test` (jest, `src/**/*.spec.ts`)
- single test: `npm test -- path/to/file.spec.ts`
- e2e: `npm run test:e2e`
- lint: `npm run lint`
- format: `npm run format`

## Stack
NestJS 11, Mongoose/MongoDB, TypeScript. Clean architecture (use cases + ports/adapters).

## Logging
- Use NestJS `Logger` with per-class context (not `console.log`).
- Levels: error, warn, log, debug, verbose. Prod: log+; dev: debug+ via `LOG_LEVEL` env.
- Structured JSON in prod; pretty in dev.
- Log at boundaries: request in/out, use-case start/end, errors with stack trace.
- Never log secrets, passphrases, encrypted payloads, or PII.
- Every HTTP request writes one sanitized `request` document to `application_logs`; every status >= 400 also writes one `error` document. Both use a 90-day TTL. stdout is only a copy.

## Testing
- Unit tests: `.spec.ts` next to the class they test (e.g., `crypto.service.spec.ts`).
- E2E tests: `test/*.e2e-spec.ts` using supertest against the real app.
- Test real behavior, not mocks. Mock only external boundaries (Mongo, crypto).
- Cover: use cases (business logic), controllers (HTTP contracts), guards, interceptors.
- At minimum: every use case has unit tests; every endpoint has at least one e2e test.
- Coverage target: 80% lines for `src/modules` and `src/platform`.
- Structural rules enforced by `src/architecture.spec.ts`.
- Regression suite: `test/notes.e2e-spec.ts`.
- Run: `npm test` (unit) and `npm run test:e2e` (e2e).
- Do not weaken tests to make them pass; report failures.

## Notes
- Mongo connection via env (MONGODB_URI).
- Jest rootDir `src`; ts-jest transform.
## Env config
- Copy `.env.example` to `.env.development` (gitignored) for local dev.
- `ConfigModule` loads `.env.development` then `.env`.
- Vars: MONGODB_URI, NOTE_DEFAULT_PASSPHRASE (required), PORT, NODE_ENV, LOG_LEVEL, TRUST_PROXY.
- NOTE_DEFAULT_PASSPHRASE encrypts notes created without a user passphrase. Changing it makes those notes unreadable.
- Rate limit on `POST /api/notes` (per IP, fixed window): `RATE_LIMIT_CREATE_MAX` (default 60) and `RATE_LIMIT_WINDOW_SECONDS` (default 60). Parsed in `src/platform/rate-limit/rate-limit.options.ts`; a value that is not a positive integer stops the app at boot with an error naming the variable.
