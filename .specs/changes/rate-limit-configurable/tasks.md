# Tasks: rate-limit-configurable

## Default limit (Backend)

- [x] `backend/src/platform/rate-limit/rate-limit.constants.ts`: change `RATE_LIMIT_CREATE_MAX` from 10 to 60. Keep `RATE_LIMIT_WINDOW_SECONDS` at 60.

## Options (Backend)

- [x] `backend/src/platform/rate-limit/rate-limit.options.ts`: add `RATE_LIMIT_OPTIONS`, `RateLimitOptions`, and `parseRateLimitOptions` as described in `design.md`.

### Unit: `backend/src/platform/rate-limit/rate-limit.options.spec.ts`

- [x] `it('uses 60 and 60 when the variables are unset')` — `parseRateLimitOptions(() => undefined)` equals `{ createMax: 60, windowSeconds: 60 }`.
- [x] `it('uses the defaults for empty values')` — with both values `''`, the result equals `{ createMax: 60, windowSeconds: 60 }`.
- [x] `it('reads positive integers')` — with `RATE_LIMIT_CREATE_MAX='20'` and `RATE_LIMIT_WINDOW_SECONDS='120'`, the result equals `{ createMax: 20, windowSeconds: 120 }`.
- [x] `it.each(['0', '-1', '1.5', 'abc', '10abc'])('rejects RATE_LIMIT_CREATE_MAX=%p')` — the call throws an error whose message contains `RATE_LIMIT_CREATE_MAX`.
- [x] `it.each(['0', '-5', 'x'])('rejects RATE_LIMIT_WINDOW_SECONDS=%p')` — the call throws an error whose message contains `RATE_LIMIT_WINDOW_SECONDS`.

## Wiring (Backend)

- [x] `backend/src/platform/rate-limit/rate-limit.module.ts`: provide `RATE_LIMIT_OPTIONS` with a `ConfigService` factory.
- [x] `backend/src/platform/rate-limit/rate-limit.store.ts`: inject `RATE_LIMIT_OPTIONS`; replace `RATE_LIMIT_CREATE_MAX` and `RATE_LIMIT_WINDOW_SECONDS` with `createMax` and `windowSeconds`. Keep the constants exported in `rate-limit.constants.ts` as defaults.

### Unit: `backend/src/platform/rate-limit/rate-limit.store.spec.ts`

- [x] Update the store construction to pass `{ createMax: 60, windowSeconds: 60 }` as the options.
- [x] Rename `it('keeps the create limit at 10 requests per 60 seconds')` to `it('keeps the create limit at 60 requests per 60 seconds')` and assert `RATE_LIMIT_CREATE_MAX` is `60` and `RATE_LIMIT_WINDOW_SECONDS` is `60`.
- [x] In the existing test whose mocked `findOne` returns `{ count: 10 }` to reach the limit, change the count to `60`. Keep its other assertions.
- [x] `it('denies the request after the configured maximum')` — with options `{ createMax: 2, windowSeconds: 60 }` and a mocked model whose `findOne` returns `{ count: 2 }`, `checkAndIncrement` returns `allowed: false`.
- [x] `it('computes Retry-After from the configured window')` — with options `{ createMax: 1, windowSeconds: 120 }` and `findOne` returning `{ count: 1 }`, `retryAfter` is between 1 and 120.

## Configuration and docs

- [x] `docker-compose.yml`: add `RATE_LIMIT_CREATE_MAX` and `RATE_LIMIT_WINDOW_SECONDS` to `backend.environment` as described in `design.md`.
- [x] `backend/AGENTS.md`: add both variables, their defaults (60 and 60), and the boot failure rule.
- [x] `frontend/AGENTS.md`: in the commands or environment section, state that the E2E suites need `RATE_LIMIT_CREATE_MAX=100 docker compose up -d mongo backend`.

## E2E: `backend/test/rate-limit-config.e2e-spec.ts` (each `describe` builds its own app after setting `process.env`, and restores the env in `afterAll`)

- [x] `describe('with RATE_LIMIT_CREATE_MAX=2')` → `it('returns 429 on the 3rd create')` — 2 `POST /api/notes` with a valid body return 201; the 3rd returns 429 with a `retry-after` header.
- [x] `describe('with RATE_LIMIT_CREATE_MAX=70')` → `it('accepts 70 creates in one window')` — 70 `POST /api/notes` with a valid body all return 201.
- [x] `describe('with RATE_LIMIT_CREATE_MAX=0')` → `it('fails to boot')` — `Test.createTestingModule({ imports: [AppModule] }).compile()` followed by `app.init()` rejects with an error whose message contains `RATE_LIMIT_CREATE_MAX`.

Clear the `rate_limits` collection in `beforeEach`, so that earlier suites do not affect the counts.

## E2E: `backend/test/notes.e2e-spec.ts` (default limit)

- [x] Rename `it('returns 429 with Retry-After after 10 creates from one IP')` to `it('returns 429 with Retry-After after 60 creates from one IP')`. The loop sends 60 `POST /api/notes` with a valid body, each returns 201; the 61st returns 429 with a `retry-after` header.

## E2E isolation

All E2E suites share one Mongo database, one client IP, and the `POST:/api/notes` counter.

- [x] `backend/test/jest-e2e.json`: set `"maxWorkers": 1`, so that suites do not consume each other's counter in parallel.
- [x] `backend/test/notes.e2e-spec.ts`: clear the `rate_limits` collection in `beforeEach`, after `app.init()`.
- [x] `backend/test/app.e2e-spec.ts`: close the app in `afterEach`, so that Jest exits.

## Validation (Tester)

- [x] `cd backend && npm run lint && npx tsc --noEmit && npm test && npm run build`
- [x] `cd backend && npm run test:e2e` (Mongo running)
- [x] `RATE_LIMIT_CREATE_MAX=100 docker compose up -d --build mongo backend`, then run `cd frontend && npx playwright test e2e/smoke.spec.ts e2e/comprehensive.spec.ts` two times in a row within 60 seconds; both runs pass.
- [x] `RATE_LIMIT_CREATE_MAX=0 docker compose up -d backend`; capture `docker compose logs backend` and confirm the message contains `RATE_LIMIT_CREATE_MAX`; then restore with `docker compose up -d backend`.
