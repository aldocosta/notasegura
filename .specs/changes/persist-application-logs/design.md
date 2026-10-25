# Design: Persist Application Logs

## Context

The backend is NestJS 11 with Mongoose. `backend/src/main.ts` installs a `ConsoleLogger` only. No log collection exists. `backend/AGENTS.md` documents that stdout logger.

The active change `nestjs-logging` promised a MongoDB TTL of 90 days. Its tasks are open. Its design sends `AppLogger` to Nest `Logger` and sends only the exception filter to MongoDB. That split is how a spec can mention TTL while the running process logs only to stdout. This change does not implement `nestjs-logging`. It replaces that contract.

Assumptions:

- MongoDB is already required for notes. Logging uses the same cluster and a separate collection.
- "90 days" means 7776000 seconds. It does not mean a calendar month.
- The note id is the secret link. A log that stores it keeps the link for 90 days.
- The passphrase may arrive as a query parameter on `GET /api/notes/:id`.
- A successful read returns note plaintext in the response body. A successful create returns the note id in the response body.

## Decisions

### Decision: Log only requests and errors

**Chosen:** Two mandatory documents, and no other required emission.

- `kind: request` — one per completed HTTP request. Fields: `occurredAt`, `method`, `route`, `status`, `durationMs`.
- `kind: error` — one per completed request with status 400 or higher. Fields: `occurredAt`, `method`, `route`, `status`, `message`. Add `stack` only when status is 500 or higher.

Known error statuses in this API are 400, 401, 404, 410, and 500. The rule is status, not the exception class. A success stores no `error` document. `LOG_LEVEL` does not suppress either document.

**Rationale:** The user asked for request logs and error logs. A generic "accepted event" store does not say what the application must emit.

**Alternatives considered:**

- Log every use-case start and end: out of scope. Those calls can include note contents.
- Log only unhandled exceptions: misses 401, 404, and 410, which are the incidents an operator must see.
- Let `LOG_LEVEL=error` drop request logs: the user required request logs.

### Decision: One completion writer

**Chosen:** A global interceptor writes both documents after the status is known, and awaits each insert. The exception filter attaches the error and sends the original HTTP response. It does not insert a second document.

**Rationale:** Two writers would double the error document or skip the request document on failure.

**Alternatives considered:**

- Exception filter inserts the error and the interceptor inserts the request: two write-sites, and a missed await drops the error document.
- Middleware that logs the raw URL on the way in: the status is not known yet, and the raw URL contains the note id and the query passphrase.

### Decision: MongoDB TTL index of 90 days

**Chosen:** Collection `application_logs`. TTL index on `occurredAt` with `expireAfterSeconds` 7776000. The field is a BSON date. No application cron. No capped collection. No second expiry field.

**Rationale:** The user requires database retention of 90 days, and requires a test that proves the expiry rule exists. MongoDB applies a TTL index without an application job. The test reads `listIndexes()` on a real server and fails if the index is missing or the limit is not 7776000.

**Alternatives considered:**

- Application cron: the last spec could claim "TTL" while no index existed. A cron also violates the prohibition on an application retention job.
- Capped collection: retention is by size, not by 90 days.
- `expireAfterSeconds: 0` plus an `expiresAt` field: two fields to drift. One index on `occurredAt` is enough.

### Decision: Console remains a copy

**Chosen:** `MongoLogger` writes the document, then forwards the same event to `ConsoleLogger`.

**Rationale:** Local development still needs a terminal. The copy is not the contract.

**Alternatives considered:**

- Remove stdout: worse local feedback, and not required by the user.
- Stdout only in development: production incidents would then depend on a single sink. The database sink is required in every environment.

### Decision: Route template and redaction before insert

**Chosen:** Build `route` from the matched route pattern, including the global prefix `api`. Examples: `/api/notes`, `/api/notes/:id`, `/api/health`. An unmatched path uses the template `unmatched`. Never store `originalUrl`, `url`, `req.query`, `req.body`, or the response body.

`LogStore.append` is the only insert. Before insert it removes, from every field, the passphrase, the note id, note plaintext, ciphertext, key material, and credential header values supplied on that request. A 4xx message is the stable public message already thrown, such as `Passphrase required or invalid`. It must not include the submitted passphrase.

**Rationale:** `GET /api/notes/:id?passphrase=` puts both secrets in the URL. The create response puts the note id in the body. Logging either value stores the secret for 90 days.

**Alternatives considered:**

- Store the raw path and redact only the body: the note id and the query passphrase remain in the document.
- Redact only known object keys: a string route can still contain the id. The writer must not receive the raw URL.

### Decision: Log storage failure does not change the HTTP response

**Chosen:** `LogStore.append` catches a store error, writes that error to the process error stream, and resolves without throwing. The exception filter still sends the original HTTP error. A note use case still returns its own result.

**Rationale:** Note sharing is the product. Logging must not take it down.

**Alternatives considered:**

- Fail the request when the insert fails: a MongoDB blip would break note creation.
- Swallow the storage failure: operators would not see that logs were lost.

### Decision: Prove the index on a real MongoDB

**Chosen:** Integration tests use `mongodb-memory-server`. They assert the TTL index and read documents through a second connection. They must not mock `listIndexes` or the model index definition.

**Rationale:** A mocked schema test can pass with no index. That is the failure mode of the previous spec.

**Alternatives considered:**

- Docker MongoDB on port 27017: already used for development, but tests then depend on a running container.
- Unit test of a constant only: does not prove the index exists on the collection.

## Architecture

```text
HTTP request
  -> controller / use case
  -> exception filter attaches the error and sends the original HTTP response
  -> request-completion interceptor
       -> one request document
       -> one error document only when status >= 400
            -> route template
            -> redaction
            -> LogStore.append (await)
            -> ConsoleLogger copy
  -> response already determined

application_logs.occurredAt TTL index (7776000 seconds)
```

Document fields:

| Field | Rule |
| --- | --- |
| `kind` | `request` or `error`. |
| `occurredAt` | BSON date. Event time. TTL field. |
| `method` | HTTP method. |
| `route` | Route template. No parameter values. `unmatched` when no route matched. |
| `status` | Final HTTP status. |
| `durationMs` | Request documents only. |
| `message` | Error documents only. Public message. No secret. |
| `stack` | Error documents only, and only when status is 500 or higher. |

Module layout:

- `infrastructure/logging`: schema, store, route template, redaction.
- `presentation/logging`: completion interceptor, exception filter, module wiring.

Logging is not a note use case. It does not enter `domain/`. This change does not add a general component logger.

## Risks

- **Log volume**: mitigated by the 90-day TTL and by logging only the request record plus an error record when the status is 400 or higher.
- **Secrets in the URL**: mitigated by storing the route template and by never reading the raw URL or the query string into the document.
- **Insert latency on the request path**: accepted. The write is awaited so the document exists when the operation completes. The collection is insert-only.
- **TTL monitor delay**: MongoDB deletes expired documents on a background monitor, often within 60 seconds after expiry. The contract is the expiry rule, not a synchronous delete at the exact second.
- **Superseded change applied by mistake**: mitigated by `ORDER.md` and by the banner on `nestjs-logging`.

## Verification Waivers

- **Requirement:** Log Retention
  **Reason:** The live MongoDB TTL monitor is not deterministic inside a test timeout. A test cannot wait 90 days, and it cannot force the monitor to delete one document at a 90-day boundary without changing the server clock.
  **Manual evidence:** `backend/src/infrastructure/logging/application-log.schema.spec.ts` asserts a TTL index on `application_logs.occurredAt` with `expireAfterSeconds` 7776000. That test is the evidence that the expiry rule is installed. This waiver covers only the live monitor timing.
  **Recorded:** 2026-10-24

## Spec Changes

- **Change:** logging: replace the generic accepted-event record with one request document per HTTP request and one error document per status of 400 or higher, and exclude the note id, query string, and both bodies.
  **Source:** user decision on 2026-10-24
  **Rationale:** The previous delta required a store and did not name the events the operator needs.
  **Approved by user:** 2026-10-24

## Baseline Errors

(none)
