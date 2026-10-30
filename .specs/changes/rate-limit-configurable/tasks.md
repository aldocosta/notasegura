# Tasks: rate-limit-configurable

## Options (Backend)

- [ ] `backend/src/platform/rate-limit/rate-limit.options.ts`: add `RATE_LIMIT_OPTIONS`, `RateLimitOptions`, and `parseRateLimitOptions` as described in `design.md`.

### Unit: `backend/src/platform/rate-limit/rate-limit.options.spec.ts`

- [ ] `it('uses 10 and 60 when the variables are unset')` — `parseRateLimitOptions(() => undefined)` equals `{ createMax: 10, windowSeconds: 60 }`.
- [ ] `it('uses the defaults for empty values')` — with both values `''`, the result equals `{ createMax: 10, windowSeconds: 60 }`.
- [ ] `it('reads positive integers')` — with `RATE_LIMIT_CREATE_MAX='20'` and `RATE_LIMIT_WINDOW_SECONDS='120'`, the result equals `{ createMax: 20, windowSeconds: 120 }`.
- [ ] `it.each(['0', '-1', '1.5', 'abc', '10abc'])('rejects RATE_LIMIT_CREATE_MAX=%p')` — the call throws an error whose message contains `RATE_LIMIT_CREATE_MAX`.
- [ ] `it.each(['0', '-5', 'x'])('rejects RATE_LIMIT_WINDOW_SECONDS=%p')` — the call throws an error whose message contains `RATE_LIMIT_WINDOW_SECONDS`.

## Wiring (Backend)

- [ ] `backend/src/platform/rate-limit/rate-limit.module.ts`: provide `RATE_LIMIT_OPTIONS` with a `ConfigService` factory.
- [ ] `backend/src/platform/rate-limit/rate-limit.store.ts`: inject `RATE_LIMIT_OPTIONS`; replace `RATE_LIMIT_CREATE_MAX` and `RATE_LIMIT_WINDOW_SECONDS` with `createMax` and `windowSeconds`. Keep the constants exported in `rate-limit.constants.ts` as defaults.

### Unit: `backend/src/platform/rate-limit/rate-limit.store.spec.ts`

- [ ] Update the store construction to pass `{ createMax: 10, windowSeconds: 60 }` as the options. Keep every existing assertion.
- [ ] `it('denies the request after the configured maximum')` — with options `{ createMax: 2, windowSeconds: 60 }` and a mocked model whose `findOne` returns `{ count: 2 }`, `checkAndIncrement` returns `allowed: false`.
- [ ] `it('computes Retry-After from the configured window')` — with options `{ createMax: 1, windowSeconds: 120 }` and `findOne` returning `{ count: 1 }`, `retryAfter` is between 1 and 120.

## Configuration and docs

- [ ] `docker-compose.yml`: add `RATE_LIMIT_CREATE_MAX` and `RATE_LIMIT_WINDOW_SECONDS` to `backend.environment` as described in `design.md`.
- [ ] `backend/AGENTS.md`: add both variables, their defaults, and the boot failure rule.
- [ ] `frontend/AGENTS.md`: in the commands or environment section, state that the E2E suites need `RATE_LIMIT_CREATE_MAX=100 docker compose up -d mongo backend`.

## E2E: `backend/test/rate-limit-config.e2e-spec.ts` (each `describe` builds its own app after setting `process.env`, and restores the env in `afterAll`)

- [ ] `describe('with RATE_LIMIT_CREATE_MAX=2')` → `it('returns 429 on the 3rd create')` — 2 `POST /api/notes` with a valid body return 201; the 3rd returns 429 with a `retry-after` header.
- [ ] `describe('with RATE_LIMIT_CREATE_MAX=20')` → `it('accepts 20 creates in one window')` — 20 `POST /api/notes` with a valid body all return 201.
- [ ] `describe('with RATE_LIMIT_CREATE_MAX=0')` → `it('fails to boot')` — `Test.createTestingModule({ imports: [AppModule] }).compile()` followed by `app.init()` rejects with an error whose message contains `RATE_LIMIT_CREATE_MAX`.

Clear the `rate_limits` collection in `beforeEach`, so that earlier suites do not affect the counts.

### Regression

- [ ] `it('returns 429 with Retry-After after 10 creates from one IP')` in `backend/test/notes.e2e-spec.ts` passes unchanged with the defaults.

## Validation (Tester)

- [ ] `cd backend && npm run lint && npx tsc --noEmit && npm test && npm run build`
- [ ] `cd backend && npm run test:e2e` (Mongo running)
- [ ] `RATE_LIMIT_CREATE_MAX=100 docker compose up -d --build mongo backend`, then run `cd frontend && npx playwright test e2e/smoke.spec.ts e2e/comprehensive.spec.ts` two times in a row within 60 seconds; both runs pass.
- [ ] `RATE_LIMIT_CREATE_MAX=0 docker compose up -d backend`; capture `docker compose logs backend` and confirm the message contains `RATE_LIMIT_CREATE_MAX`; then restore with `docker compose up -d backend`.
