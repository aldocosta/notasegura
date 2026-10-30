# Design: rate-limit-configurable

## Context

- `RateLimitStore.checkAndIncrement` reads `RATE_LIMIT_CREATE_MAX` (10) and `RATE_LIMIT_WINDOW_SECONDS` (60) from `rate-limit.constants.ts`.
- `ConfigModule` is global and reads `.env.development` and `.env`. `NotesModule` already reads `NOTE_DEFAULT_PASSPHRASE` through a `ConfigService` factory.
- `backend/test/notes.e2e-spec.ts` expects HTTP 429 after 10 creates. `backend/test/setup-env.ts` does not set the rate-limit variables, so the E2E run uses the defaults.
- `rate-limit.store.spec.ts` asserts that the constants equal 10 and 60.
- The requirement "Create Rate Limit" of the unsynced change `rate-limiting` states the fixed values 10 and 60. This change does not modify it, so it does not wait for `rate-limiting` to sync.

## Decisions

### Decision: Default limit of 60 per minute

**Chosen:** `RATE_LIMIT_CREATE_MAX` in `rate-limit.constants.ts` changes from 10 to 60. `RATE_LIMIT_WINDOW_SECONDS` stays 60. The tests that assert the old default change to the new value: the constant assertion in `rate-limit.store.spec.ts` and the 429 test in `backend/test/notes.e2e-spec.ts`.

**Rationale:** The user asked for 60 requests per minute. One request per second on average still blocks bulk abuse from one IP.

**Alternatives considered:**

- 60 requests per second (window of 1 second): 3600 per minute per IP, which removes the abuse protection.
- Keep 10 as default and set 60 only through the environment: the default stack and production would keep the low limit.

### Decision: Options parsed by a pure function

**Chosen:** Add `backend/src/platform/rate-limit/rate-limit.options.ts` with:

- `export const RATE_LIMIT_OPTIONS = Symbol('RATE_LIMIT_OPTIONS')`;
- `export interface RateLimitOptions { createMax: number; windowSeconds: number }`;
- `export function parseRateLimitOptions(get: (key: string) => string | undefined): RateLimitOptions`. An unset or empty value gives the default constant. A value that does not match `/^[1-9]\d*$/` throws `Error('<NAME> must be a positive integer')`.

`RateLimitModule` provides `RATE_LIMIT_OPTIONS` with `useFactory: (config: ConfigService) => parseRateLimitOptions((k) => config.get<string>(k))`. `RateLimitStore` injects it with `@Inject(RATE_LIMIT_OPTIONS)` and uses `createMax` and `windowSeconds`.

**Rationale:** The pure function is easy to test. The factory runs at boot, so an invalid value stops the app before it accepts traffic, like `NOTE_DEFAULT_PASSPHRASE`.

**Alternatives considered:**

- Read `process.env` in the store: hidden configuration, and the error appears only on the first request.
- `ConfigModule` validation schema (Joi or class-validator): a new dependency and a global change, which overlaps `backend-env-config`.

### Decision: Compose pass-through

**Chosen:** In `docker-compose.yml`, under `backend.environment`, add `RATE_LIMIT_CREATE_MAX: ${RATE_LIMIT_CREATE_MAX:-60}` and `RATE_LIMIT_WINDOW_SECONDS: ${RATE_LIMIT_WINDOW_SECONDS:-60}`. For the frontend E2E suites, start the backend with `RATE_LIMIT_CREATE_MAX=100 docker compose up -d mongo backend`.

**Rationale:** The default stack behaves as production. The developer raises the limit only for test runs.

## Risks

- **Spec conflict at sync**: after this change syncs, the baseline "Create Rate Limit" still says "at most 10" and "60 seconds". Mitigation: when `rate-limiting` and this change sync, reword "Create Rate Limit" to "at most the configured maximum (default 60)" and "after the configured window (default 60 seconds)". That rewording is a requirement change and needs the user's approval at sync time.
- **E2E tests that need a fresh app**: tests with a non-default limit must build their own Nest app with the variables set, so that the default suites keep the default limit.
- **Slower default 429 test**: the 429 test in `notes.e2e-spec.ts` now sends 61 requests. The test keeps the default Jest timeout unless it fails on time; then the timeout goes up for that test only.
