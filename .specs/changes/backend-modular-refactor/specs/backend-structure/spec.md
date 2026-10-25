# Delta for Backend Structure

## ADDED Requirements

### Requirement: Domain Module Layout

Each business capability SHALL live in exactly one directory under `src/modules/`.
That directory SHALL contain the capability code for the `domain`, `application`, `infrastructure`, and `presentation` concerns, plus one module file at its root.
No business capability SHALL place code in a top-level layer directory.

Serves: predictable-change

#### Scenario: Business capability is self-contained

- **GIVEN** the repository after the refactor
- **WHEN** a developer inspects `src/modules/notes/`
- **THEN** the directory contains `notes.module.ts` and the four layer directories
- **THEN** the entity, the repository port, and the crypto port are inside the module

#### Scenario: Root layer directories are gone

- **GIVEN** the repository after the refactor
- **WHEN** a developer inspects the root of `src/`
- **THEN** `src/domain/`, `src/application/`, `src/infrastructure/`, and `src/presentation/` do not exist

### Requirement: Platform Separation

Technical capabilities SHALL live under `src/platform/`, one directory per capability.
Platform code SHALL NOT import business capability modules.

Serves: predictable-change

#### Scenario: Platform holds technical capabilities

- **GIVEN** the repository after the refactor
- **WHEN** a developer inspects `src/platform/`
- **THEN** it contains `errors/`, `logging/`, `rate-limit/`, and `health/`

#### Scenario: Platform does not know the business

- **GIVEN** any file under `src/platform/`
- **WHEN** the file imports another file from `src/`
- **THEN** the imported file is not part of `src/modules/`

### Requirement: Inward Dependency Direction

Code in a module `domain/` directory SHALL NOT import from that module's `application/`, `infrastructure/`, or `presentation/` directories.
Code in a module `application/` directory SHALL NOT import from that module's `infrastructure/` or `presentation/` directories.
Module wiring SHALL occur only in the module file at the module root.

Serves: enforceable-boundaries

#### Scenario: Domain knows nothing outward

- **GIVEN** any file under `src/modules/notes/domain/`
- **WHEN** the file imports another file from `src/`
- **THEN** the imported file is inside `domain/` or `src/platform/`

#### Scenario: Application knows nothing about adapters

- **GIVEN** any file under `src/modules/notes/application/`
- **WHEN** the file imports another file from `src/`
- **THEN** the imported file is inside `domain/`, `application/`, or `src/platform/`

#### Scenario: Only the module file binds adapters

- **GIVEN** the repository after the refactor
- **WHEN** a developer searches for the Mongoose adapter binding
- **THEN** the binding appears only in `src/modules/notes/notes.module.ts`

### Requirement: Cross-Module Isolation

A business module SHALL import another business module only through that module's public entry point.
A business module SHALL NOT import files from another module's `domain/`, `application/`, `infrastructure/`, or `presentation/` directories.

Serves: enforceable-boundaries

#### Scenario: Deep import across modules is rejected

- **GIVEN** two business modules
- **WHEN** a file in the first module imports a layer file of the second module
- **THEN** the architecture test fails and names the offending file

#### Scenario: Public entry point is allowed

- **GIVEN** two business modules
- **WHEN** a file in the first module imports the second module's module file
- **THEN** the architecture test passes

### Requirement: Framework Isolation

No file under a module `domain/` or `application/` directory SHALL import an HTTP-specific NestJS symbol.
HTTP-specific NestJS symbols include `HttpException`, `NotFoundException`, `UnauthorizedException`, `BadRequestException`, and the HTTP route decorators.

Serves: enforceable-boundaries

#### Scenario: Domain error instead of HTTP error

- **GIVEN** a note that is expired
- **WHEN** the get-note use case fails
- **THEN** it raises `NoteExpired`, not an HTTP exception

#### Scenario: Architecture test rejects an HTTP exception in application code

- **GIVEN** a file under `src/modules/notes/application/` that imports `NotFoundException`
- **WHEN** the architecture test runs
- **THEN** the test fails and names the offending file

### Requirement: Single Error Boundary

The system SHALL translate every failure to one HTTP response at the presentation boundary.
A domain error SHALL map to exactly one HTTP status.
An unexpected error SHALL map to `500` without a stack trace or an internal message in the response body.

Serves: unchanged-behavior

#### Scenario: Not found maps to 404

- **GIVEN** the repository returns no note for the requested id
- **WHEN** the request completes
- **THEN** the response status is `404`
- **THEN** the response body is the standard NestJS `404` body

#### Scenario: Invalid passphrase maps to 401

- **GIVEN** a note protected by a passphrase
- **WHEN** the request carries a different passphrase
- **THEN** the response status is `401`

#### Scenario: Unexpected failure maps to 500

- **GIVEN** an unexpected error inside a use case
- **WHEN** the request completes
- **THEN** the response status is `500`
- **THEN** the response body contains no stack trace and no internal message

### Requirement: Preserved HTTP Contract

The refactor SHALL NOT change the observable HTTP contract of the API.
Each existing endpoint SHALL keep its current path, status codes, response fields, and response headers.

Serves: unchanged-behavior

#### Scenario: Create a note

- **GIVEN** a valid create payload
- **WHEN** the client sends `POST /api/notes`
- **THEN** the response status is `201`
- **THEN** the response body contains the fields `id` and `url`

#### Scenario: Read a note

- **GIVEN** a stored note that is not expired
- **WHEN** the client sends `GET /api/notes/:id`
- **THEN** the response status is `200`
- **THEN** the response body contains the field `text` with the original plaintext

#### Scenario: Read an expired note

- **GIVEN** a note whose expiry time has passed
- **WHEN** the client sends `GET /api/notes/:id`
- **THEN** the response status is `404`

#### Scenario: Invalid payload

- **GIVEN** a create payload with `expiresInDays` equal to `8`
- **WHEN** the client sends `POST /api/notes`
- **THEN** the response status is `400`

#### Scenario: Create limit exceeded

- **GIVEN** an IP that sent `10` create requests inside the current window
- **WHEN** the client sends an eleventh `POST /api/notes`
- **THEN** the response status is `429`
- **THEN** the response has a `Retry-After` header

#### Scenario: Health check

- **GIVEN** the application is running
- **WHEN** the client sends `GET /api/health`
- **THEN** the response status is `200`
- **THEN** the response body is `{ "status": "ok" }`

#### Scenario: Root route stays

- **GIVEN** the application is running
- **WHEN** the client sends `GET /`
- **THEN** the response status is `200`
- **THEN** the response body is `Hello World!`

### Requirement: Module Composition

Each module SHALL declare its own controllers, providers, and port bindings in its module file.
The application SHALL register each global concern exactly once.

Serves: predictable-change

#### Scenario: Every module has one composition root

- **GIVEN** the repository after the refactor
- **WHEN** a developer inspects a module directory
- **THEN** exactly one `*.module.ts` file exists at the module root

#### Scenario: Global interceptor registered once

- **GIVEN** the repository after the refactor
- **WHEN** a developer searches `src/` for `APP_INTERCEPTOR`
- **THEN** one module registers it
- **THEN** no other file registers the same interceptor
