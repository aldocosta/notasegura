# Tasks: Rate Limiting

## Contract types

- [ ] Add rate limit record type with ip, endpoint, windowStart, count, expiresAt.
- [ ] Add rate limit constants: 10 req/min create, 30 req/min read, 60s window, collection name rate_limits.

## Store

- [ ] Add Mongoose schema for rate_limits with TTL index on expiresAt (60s).
- [ ] Add RateLimitStore with check-and-increment method. Returns { allowed, retryAfter }.
- [ ] Add unit tests for store logic.

## Guard

- [ ] Add RateLimitGuard implementing CanActivate. Checks store, throws 429 with Retry-After if exceeded.
- [ ] Exempt /api/health from rate limiting.
- [ ] Register guard globally via APP_GUARD.
- [ ] Add integration test: 11th create request returns 429.
- [ ] Add integration test: health check is not rate limited.
- [ ] Add integration test: Retry-After header present on 429.

## Wiring

- [ ] Register RateLimitModule in AppModule.
- [ ] Configure trust proxy in main.ts based on TRUST_PROXY env var.
- [ ] Add TRUST_PROXY to env config documentation.

## Verification

- [ ] Run backend tests.
- [ ] Run tsc --noEmit.
