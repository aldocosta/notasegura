# Design: NestJS Logging

## Context

The backend runs on NestJS with MongoDB. There is no centralized logging or error capture. Production debugging relies on console output, which is ephemeral.

## Decisions

### Decision: Use built-in NestJS Logger

**Chosen:** Use `Logger` from `@nestjs/common`.

**Rationale:** Standard, no extra dependency, integrates with Nest bootstrap and exception handling.

**Alternatives considered:**

- Winston: more features but adds dependency and configuration.
- Pino: faster but requires adapter integration.

### Decision: MongoDB TTL for retention

**Chosen:** Mongoose model with a TTL index of 90 days (three months).

**Rationale:** Automatic cleanup, no manual purge job.

**Alternatives considered:**

- Fixed collection size: less predictable retention.
- Manual cron: extra operational burden.

## Architecture

Global exception filter captures unhandled errors and writes to the log collection. An injectable `AppLogger` service wraps `Logger` for point-in-time calls.

```text
ExceptionFilter -> LogService -> MongoDB (TTL 90d)
Any class -> AppLogger -> Logger
```

## Risks

- **Log volume growth**: mitigated by TTL index and scoped logging.
- **Sensitive data in logs**: mitigated by avoiding request bodies in error logs.

## Verification Waivers

(none)

## Spec Changes

(none)
```