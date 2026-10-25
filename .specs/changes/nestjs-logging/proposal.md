# Proposal: NestJS Logging

> Superseded on 2026-10-24 by `persist-application-logs`. Do not apply this change. Do not sync it. The user rejected it because the TTL was specified here and never implemented, and because this design still sends the injectable logger to stdout.

## Intent

The backend has no structured logging or error capture in production, which makes debugging incidents difficult. This change adds a NestJS-standard logging system that captures unhandled errors globally, persists log entries to MongoDB with a three-month retention, and exposes an injectable logger for point-in-time logging anywhere in the codebase.

## User Stories

### Story: debug-production-incident

As a developer, I want structured logs and captured errors persisted for three months, so that I can investigate production incidents after the fact.

## Scope

**In scope:**

- Global exception filter that captures unhandled errors
- Persistence of log entries to MongoDB with TTL of three months
- Injectable logger service usable in any class
- NestJS built-in `Logger` as the standard

**Out of scope:**

- Frontend logging
- Log aggregation or external services (e.g., Sentry, Datadog)
- Log querying UI

## Approach

Use `Logger` from `@nestjs/common` as the standard. Create a global exception filter that records unhandled errors. Persist entries through a Mongoose model with a TTL index. Provide an injectable service wrapping the logger for point-in-time use.

## Open Questions

- None

## Resolved Questions

- 2026-10-24 Logging scope is backend only, standard NestJS Logger, Mongo persistence with 3-month TTL: decided with the user.
```