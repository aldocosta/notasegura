# Proposal: rate-limit-configurable

## Intent

The create rate limit is fixed in code at 10 requests per IP per 60-second window.
The frontend E2E suites create 12 notes in one run, so the last requests get HTTP 429 and the suites fail when the run falls inside one window.
The operator needs to set the limit and the window per environment: a high limit for local E2E runs, the default in production.

## User Stories

### Story: reliable-test-runs

As a developer, I want to raise the create limit in my test environment, so that the E2E suites pass on every run and a failure points to a real bug.

### Story: tunable-abuse-protection

As the operator, I want to tune the create limit without a code change, so that I can react to abuse or to growth.

## Scope

**In scope:**

- Environment variables `RATE_LIMIT_CREATE_MAX` and `RATE_LIMIT_WINDOW_SECONDS`, with the current values 10 and 60 as defaults.
- Boot failure with a clear message when a value is not a positive integer.
- Pass-through of both variables in `docker-compose.yml`, with the defaults.
- Documentation in `backend/AGENTS.md` and in `frontend/AGENTS.md` (how to run the E2E suites with a high limit).
- Unit and E2E tests.

**Out of scope:**

- Rate limits on other endpoints.
- The order of the rate-limit guard and request validation.
- Changes to the E2E suites.
- `backend/.env.example` (owned by `backend-env-config`).

## Approach

A pure function parses and validates the two variables.
`RateLimitModule` provides the result as an options object through `ConfigService`.
`RateLimitStore` reads the limit and the window from the options instead of the constants.
The constants stay as the defaults.
