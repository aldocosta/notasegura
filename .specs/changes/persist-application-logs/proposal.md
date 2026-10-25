# Proposal: Persist Application Logs

## Intent

Operators cannot investigate a SafeNote incident after the process exits. The current logger writes only to stdout. The change `nestjs-logging` describes a 90-day MongoDB TTL, but it was not implemented, and its design still sends the injectable logger to stdout. This change makes a durable database record the contract, and it makes the 90-day expiry rule verifiable.

## User Stories

### Story: investigate-incident

As an operator, I want one sanitized request log for every HTTP request and one error log for every failed request, kept in the database for 90 days after the writing process has stopped, so that I can investigate a SafeNote incident without a live console and without reading the secret.

This story ladders to the north star. SafeNote is gone after its lifetime, so an operator cannot recover the secret from the note. The operator still needs the service record of what failed.

### Story: sharing-stays-up

As a person sharing a note, I want the note request to keep its result when log storage fails, so that a logging fault does not block temporary sharing.

## Scope

**In scope:**

- Exactly one request log for every completed HTTP request. It records method, route template, status, and duration.
- Exactly one error log for every completed request whose status is 400 or higher. It records method, route template, status, and a safe message. A status of 500 or higher also records the stack trace.
- These two records are stored even when `LOG_LEVEL` would hide `log` or `error`.
- Retention of 90 days enforced by the database expiry rule, not by an application job.
- A test that reads the real index and fails when the 90-day expiry rule is missing.
- Exclusion of passphrase, note plaintext, ciphertext, key material, note id, request body, response body, query string, and credential headers.
- A console copy may remain. A console line does not satisfy the contract.
- Failure of log storage does not change the HTTP response of the note request.

**Out of scope:**

- Frontend logging.
- Log aggregation or external services.
- A log query UI.
- Applying or syncing `nestjs-logging`.
- Changing note expiry.
- An audit log of note contents.
- Use-case start and end logs.
- A general component logger as a required emission path.
- A new correlation or tracing system.

## Approach

Write the two mandatory records from one request-completion path, after the status is known. Insert them through one store port and wait for the insert. Do not log the raw URL, the query string, the request body, or the response body. The note id is a secret link, so the route field keeps the parameter name `:id`. Model retention as a TTL index on the event time with `expireAfterSeconds` of 7776000. Do not add a cron. Tests call the real HTTP endpoints and read MongoDB. A mock of the index is not evidence.

## Open Questions

- None

## Resolved Questions

- 2026-10-24 Where logs live, and whether to rewrite `nestjs-logging`: create a new change. Stdout may remain a copy and does not satisfy the contract. Retention is 90 days and a test must read the TTL index. `nestjs-logging` is superseded and must not be applied or synced. Decided with the user.
- 2026-10-24 Which events are logged: every completed HTTP request writes one sanitized request log. Every request whose status is 400 or higher also writes one error log. The note id, query string, request body, and response body are sensitive and are not stored. These records are not suppressed by `LOG_LEVEL`. Use-case start and end logs are out of scope. Decided with the user.
