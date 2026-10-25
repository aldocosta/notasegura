# Design: Rate Limiting

## Context

The backend is NestJS 11 with MongoDB. There is no rate limiting. The logging system (persist-application-logs) is in place and uses MongoDB. The health check endpoint exists at /api/health.

## Decisions

### Decision: Fixed window counter in MongoDB

**Chosen:** Store a counter document per (IP, endpoint) with a window start time and count. TTL index removes expired windows.

**Rationale:** Simple, persistent, no new infrastructure. Fixed window is standard for most APIs.

**Alternatives considered:**
- Sliding window: more accurate but more complex.
- In-memory: loses state on restart, doesn't scale.
- Redis: adds new infrastructure.

### Decision: NestJS guard

**Chosen:** A guard registered globally via APP_GUARD. It checks the rate limit before the controller runs. Returns 429 with Retry-After when exceeded.

**Rationale:** Standard NestJS pattern. Applies to all routes uniformly. Health check is exempt via metadata.

### Decision: Market-standard limits

**Chosen:** 10 requests per minute on POST /api/notes only.

**Rationale:** Standard for anonymous API endpoints. Create is more expensive (crypto + DB write). GET is exempt because maxViews already limits reads per note.

### Decision: Exempt health check

**Chosen:** The guard skips /api/health.

**Rationale:** Health checks must not be rate-limited for monitoring.

### Decision: Resolve client IP behind proxies

**Chosen:** Use `req.ip` with Express `trust proxy` enabled when `TRUST_PROXY` env is set. When unset, use `req.ip` directly (no proxy trust).

**Rationale:** The frontend may call the backend through a reverse proxy, API gateway, or load balancer. In those cases the real client IP is in `X-Forwarded-For`. Enabling `trust proxy` makes Express resolve `req.ip` from that header. When the backend is called directly, `req.ip` is the socket address. `TRUST_PROXY` is configurable so the operator controls which proxies are trusted. The frontend does not need to send any header.

**Alternatives considered:**
- Read `X-Forwarded-For` manually: duplicates Express built-in logic and risks trusting spoofed headers.
- Always trust proxy: allows IP spoofing when the backend is exposed directly.

## Architecture

```text
HTTP request
  -> RateLimitGuard
       -> resolve client IP (req.ip, with trust proxy if configured)
       -> check (IP, endpoint) counter in MongoDB
       -> if exceeded: 429 + Retry-After
       -> if ok: increment counter, proceed
  -> controller
  -> RequestCompletionInterceptor (logging)

rate_limits collection:
  { ip, endpoint, windowStart, count, expiresAt }
  TTL index on expiresAt (60 seconds)
```

## Risks

- **MongoDB latency on every request**: mitigated by single document lookup/update.
- **Clock skew**: fixed window uses server time. Acceptable for POC.
- **IP spoofing via X-Forwarded-For**: trust proxy is not enabled. Use req.ip.

## Verification Waivers

(none)

## Spec Changes

(none)

## Baseline Errors

(none)
