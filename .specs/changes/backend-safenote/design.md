# Design: Backend SafeNote (NestJS + Clean Architecture)

## Principles

- Clean Architecture + DDD: domain entities are rich (behavior + invariants), not anemic.
- Repository pattern for persistence (port in domain, adapter in infrastructure).
- Dependencies point inward. Use cases depend only on interfaces (ports).
- NestJS DI wires implementations to interfaces via providers.

## Layer layout

See `backend/AGENTS.md` (Architecture model) for the canonical layer layout. This spec follows that model.

## Use cases

- `CreateNoteUseCase.execute(input)` → validates constraints (1-7 days, 1-10 views), encrypts, persists, returns `{ id, url }`.
- `GetNoteUseCase.execute(id, passphrase?)` → fetches, checks expiry/views, decrypts, increments views, deletes if consumed, returns `{ text }`.

## Ports / adapters

- `NoteRepository` interface (port) in domain; `MongooseNoteRepository` (adapter) in infrastructure (Mongoose).
- `CryptoPort` interface; `AesCryptoService` adapter.

## Modules wiring

- `NotesModule` imports `CryptoModule`, `DatabaseModule`; provides use cases + controller.
- Use cases inject `NoteRepository` and `CryptoPort` via NestJS DI tokens.

## Data model

Note: `{ _id, ciphertext, iv, authTag, salt?, expiresAt, maxViews, views, createdAt }`. TTL index on `expiresAt`.

## Endpoints

- `POST /notes` → `CreateNoteUseCase`
- `GET /notes/:id` → `GetNoteUseCase`

## Expiry / views

- TTL handles time expiry.
- Views handled in use case (increment + delete when consumed).

## Error contract

- 400 validation, 404 not found, 410 expired/consumed, 401 passphrase required/invalid.

## Testing

- Unit tests for use cases with mocked ports.
- E2E tests for endpoints.