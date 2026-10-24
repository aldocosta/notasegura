# Backend (NestJS + Clean Architecture)

## Architecture model (reference)

Clean Architecture + DDD (rich domain entities) with use cases and repository pattern:
- domain: rich entities + repository ports (interfaces).
- application: use cases (CreateNoteUseCase, GetNoteUseCase) + DTOs.
- infrastructure: adapters (Mongoose repository, AES crypto).
- presentation: controllers + HTTP DTOs + modules.

Repository pattern: `NoteRepository` port in domain, `MongooseNoteRepository` adapter in infrastructure.
DDD: entities encapsulate invariants/behavior; not anemic models.

Dependencies point inward. NestJS DI wires implementations to interfaces.

Layer layout:
```
src/
  domain/
  application/use-cases/
  infrastructure/(crypto, persistence)
  presentation/(notes, health)
```

Use cases:
- CreateNoteUseCase.execute(input) → validates constraints, encrypts, persists, returns { id, url }.
- GetNoteUseCase.execute(id, passphrase?) → fetches, checks expiry/views, decrypts, increments views, deletes if consumed.

Error contract: 400 validation, 404 not found, 410 expired/consumed, 401 passphrase required/invalid.

Constraints: expiresInDays 1-7, maxViews 1-10. Passphrase optional, part of encryption key (never stored in clear).

## Node version
- Use Node v24.13.0 (latest installed): `nvm use v24.13.0` (Node >=22 required; @nestjs/config v12 is ESM-only).

## Commands
- dev: `npm run start:dev`
- build: `npm run build`
- test: `npm test` (jest, `src/**/*.spec.ts`)
- single test: `npm test -- path/to/file.spec.ts`
- e2e: `npm run test:e2e`
- lint: `npm run lint`
- format: `npm run format`

## Stack
NestJS 11, Mongoose/MongoDB, TypeScript. Clean architecture (use cases + ports/adapters).

## Notes
- Mongo connection via env (MONGODB_URI).
- Jest rootDir `src`; ts-jest transform.