# Tasks: Persist Application Logs

## Contract types

- [ ] Add the log record type with `kind` (`request` or `error`), `occurredAt`, `method`, `route`, `status`, and optional `durationMs`, `message`, and `stack`.
- [ ] Add the retention constant `7776000` and the collection name `application_logs` in one module.

## Pure rules

- [ ] Add the route-template function. It keeps parameter names and drops parameter values, the query string, and the raw URL.
- [ ] Add the redaction function for passphrase, note plaintext, ciphertext, key material, note id, request body, response body, query string, and credential headers.
- [ ] Add unit tests for the route template of `POST /api/notes`, `GET /api/notes/:id`, and an unmatched path.
- [ ] Add unit tests that redaction removes a passphrase, a note id, note plaintext, and a query string from a record.

## Store

- [ ] Add the Mongoose schema for `application_logs` with a TTL index on `occurredAt` and `expireAfterSeconds` 7776000.
- [ ] Add `mongodb-memory-server` as a backend devDependency.
- [ ] Add `LogStore.append` that redacts, inserts, and awaits the insert. Mandatory `request` and `error` records bypass `LOG_LEVEL`.
- [ ] Add `application-log.schema.spec.ts` against a real MongoDB. Assert `listIndexes()` shows a TTL index on `occurredAt` with `expireAfterSeconds` 7776000. Do not mock the index.
- [ ] Add an integration test that a stored document remains readable after the writing connection closes.

## Request and error emission

- [ ] Add one request-completion writer. It awaits one `request` insert after the response status is known. It awaits one `error` insert only when the status is 400 or higher. It does not insert a second error document from the exception filter.
- [ ] Add an integration test that a successful note creation stores exactly one `request` document and no `error` document, and that the document does not contain the returned note id or the request body.
- [ ] Add an integration test that a note read with a passphrase query and a note id stores a `request` document whose route is the template, with neither secret in the document.
- [ ] Add an integration test that a 401 stores exactly one `error` document, with a message and without a stack trace or the passphrase.
- [ ] Add an integration test that an unhandled exception stores exactly one `error` document with the stack trace, and still stores exactly one `request` document.
- [ ] Add an integration test that `LOG_LEVEL` excluding `log` and `error` still stores the request document and the error document.
- [ ] Add an integration test that a store rejection during note creation does not change the HTTP response and writes the storage failure to the process error stream.
- [ ] Add an integration test that the request document is stored when stdout is discarded.

## Wiring

- [ ] Register the logging module and the completion writer as a global interceptor. Attach thrown errors for the completion writer. Do not add a general component logger in this change.
- [ ] Update the Logging section in `backend/AGENTS.md`. State that every HTTP request writes one sanitized `request` document, every status of 400 or higher also writes one `error` document, both go to `application_logs` with a 90-day TTL, and stdout is only a copy.
- [ ] Do not implement `nestjs-logging`.

## Verification

- [ ] Run the new backend unit and integration tests, including `application-log.schema.spec.ts`.
