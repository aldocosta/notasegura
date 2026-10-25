# Delta for Logging

## ADDED Requirements

### Requirement: Request Log

The system SHALL store exactly one `application_logs` document of kind `request` for every completed HTTP request, including a failed request, and that document remains readable after the writing process has stopped, includes the event time, the HTTP method, the route template, the status, and the duration, uses parameter names instead of parameter values, is stored even when `LOG_LEVEL` excludes `log`, and is not replaced by a console line.

Serves: investigate-incident

#### Scenario: Successful request stored

- **GIVEN** a note creation request completes with success
- **WHEN** the response has been sent
- **THEN** `application_logs` contains exactly one `request` document for that request with the method, the route template, the status, and the duration, and that document remains readable after the writing process has stopped

#### Scenario: Secret request stored without secrets

- **GIVEN** a note read request carries a note id in the path and a passphrase in the query
- **WHEN** the response has been sent
- **THEN** the `request` document uses the route template and does not contain the note id, the passphrase, the query string, the request body, or the response body

#### Scenario: Stdout discarded

- **GIVEN** the process writes no console log
- **WHEN** an HTTP request completes
- **THEN** `application_logs` still contains the `request` document for that request

#### Scenario: Level filter ignored

- **GIVEN** `LOG_LEVEL` does not include `log`
- **WHEN** an HTTP request completes
- **THEN** `application_logs` still contains the `request` document for that request

### Requirement: Error Log

The system SHALL store exactly one `application_logs` document of kind `error` when a completed HTTP request has status 400 or higher, and no `error` document when the status is below 400, and that document includes the event time, the HTTP method, the route template, the status, and a message without a secret, includes the stack trace only when the status is 500 or higher, and is stored even when `LOG_LEVEL` excludes `error`.

Serves: investigate-incident

#### Scenario: Client error stored

- **GIVEN** a request completes with status 401
- **WHEN** the response has been sent
- **THEN** `application_logs` contains exactly one `error` document for that request with the method, the route template, the status, and a message, and that document does not contain a stack trace or the submitted passphrase

#### Scenario: Server error stored

- **GIVEN** a request triggers an unhandled exception
- **WHEN** request handling ends with status 500
- **THEN** `application_logs` contains exactly one `error` document for that request with the failure message and the stack trace

#### Scenario: Success has no error document

- **GIVEN** a request completes with a status below 400
- **WHEN** the response has been sent
- **THEN** `application_logs` contains no `error` document for that request

#### Scenario: Error level filter ignored

- **GIVEN** `LOG_LEVEL` does not include `error`
- **WHEN** a request completes with status 500
- **THEN** `application_logs` still contains the `error` document for that request

### Requirement: Secret Exclusion

The system SHALL NOT store a passphrase, note plaintext, ciphertext, key material, note identifier, request body, response body, query string, or credential header in an `application_logs` document.

Serves: investigate-incident

#### Scenario: Secrets absent from both records

- **GIVEN** a failed note read includes a passphrase, a note id, and would expose note plaintext on success
- **WHEN** the request and error documents are stored
- **THEN** neither document contains the passphrase, the note id, the note plaintext, the ciphertext, the key material, the request body, the response body, or the query string

### Requirement: Log Retention

The system SHALL keep an `application_logs` document readable until it is 90 days old, and not after that age, by a database expiry rule that does not use an application scheduled job.

Serves: investigate-incident

#### Scenario: Record inside retention

- **GIVEN** a document in `application_logs` whose age is less than 90 days
- **WHEN** the collection is queried
- **THEN** the document is present

#### Scenario: Record past retention

- **GIVEN** a document in `application_logs` whose age is greater than 90 days
- **WHEN** the database has applied its expiry rule
- **THEN** the document is not present

### Requirement: Store Outage Isolation

When MongoDB rejects a log write, the system SHALL leave the HTTP response of that request unchanged and report the storage failure on the process error stream.

Serves: sharing-stays-up

#### Scenario: Note request survives log store failure

- **GIVEN** MongoDB rejects log writes
- **WHEN** a note request finishes
- **THEN** the HTTP response is the response the note request would have had without the log write, and the storage failure is visible on the process error stream
