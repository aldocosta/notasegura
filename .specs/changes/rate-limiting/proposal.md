# Proposal: Rate Limiting

## Intent

There is no protection against abuse of the create endpoint. A single client can flood the service with note creation. This change adds per-IP rate limiting backed by MongoDB, with market-standard limits and a 429 response.

## User Stories

### Story: fair-usage

As an operator, I want per-IP rate limits on note creation, so that one client cannot exhaust the service.

### Story: client-feedback

As a person sharing a note, I want a clear 429 response with retry timing when I exceed the limit, so that I know when to retry.

## Scope

**In scope:**

- Per-IP rate limiting on POST /api/notes only.
- Market-standard limit: 10 requests per minute on create.
- GET /api/notes/:id is exempt: the note view limit (maxViews) already protects against abuse.
- HTTP 429 response with Retry-After header.
- Persistent storage in MongoDB with automatic expiry.
- Health check endpoint exempt from rate limiting.
- Integration with the existing request logging.

**Out of scope:**

- User-based or token-based limiting (no auth exists).
- Distributed rate limiting across multiple instances (single instance for POC).
- Rate limit dashboard or admin API.
- Custom limits per client.

## Approach

Use a fixed-window counter stored in MongoDB. Each (IP, endpoint) pair has a document with a window start time, a count, and an expiry. The TTL index removes expired windows automatically. A NestJS guard checks the counter before the controller handles the request. When the count exceeds the limit, return 429 with Retry-After.

Limits: 10 req/min on POST, 30 req/min on GET. Health check is exempt.

## Open Questions

- None

## Resolved Questions

- 2026-10-24 Rate limit scope and storage: per-IP, market-standard limits (10/min create, 30/min read), MongoDB-backed, 429 with Retry-After, health check exempt. Decided with the user.
