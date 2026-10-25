# Tasks: Backend Modular Refactor

Order: error contract first, then the notes slice, then the platform slices, then enforcement, then cleanup.
Each group leaves the build green.
Use `git mv` for every file move.

## 1. Error contract

- [ ] Add `src/platform/errors/domain-error.ts`. Export `abstract class DomainError extends Error` with a readonly `code: string`. The class holds no HTTP concern.
- [ ] Add `src/modules/notes/domain/errors.ts`. Export `NoteNotFound`, `NoteExpired`, and `InvalidPassphrase`, each extending `DomainError`. Use the exact messages `Note not found or expired` and `Passphrase required or invalid` to preserve the current response bodies.
- [ ] Add `src/modules/notes/presentation/notes-error.filter.ts`. Extend `BaseExceptionFilter`, catch the three domain errors, and delegate to `super.catch(new NotFoundException(message), host)` for `NoteNotFound` and `NoteExpired`, and to `new UnauthorizedException(message)` for `InvalidPassphrase`.
- [ ] Add `src/platform/errors/unhandled-error.filter.ts`. Catch everything, delegate `HttpException` to `super.catch(exception, host)`, and reply `500` with the body `{ statusCode: 500, message: 'Internal server error' }` for any other error. The body carries no stack trace and no original message.
- [ ] Add `src/platform/errors/errors.module.ts`. Register `UnhandledErrorFilter` with `APP_FILTER`.
- [ ] Register `NotesErrorFilter` with `APP_FILTER` in `src/modules/notes/notes.module.ts`.
- [ ] Add `src/modules/notes/presentation/notes-error.filter.spec.ts`:
  - [ ] `it('maps NoteNotFound to 404 with message "Note not found or expired"')`: assert status `404` and body `{ statusCode: 404, message: 'Note not found or expired', error: 'Not Found' }`.
  - [ ] `it('maps NoteExpired to 404 with the same body as before')`: assert status `404` and body identical to the `NoteNotFound` case.
  - [ ] `it('maps InvalidPassphrase to 401 with message "Passphrase required or invalid"')`: assert status `401` and body `{ statusCode: 401, message: 'Passphrase required or invalid', error: 'Unauthorized' }`.
- [ ] Add `src/platform/errors/unhandled-error.filter.spec.ts`:
  - [ ] `it('passes an HttpException through unchanged')`: assert status `400` and the original `BadRequestException` body.
  - [ ] `it('maps an unexpected error to 500 without internals')`: assert status `500`, `body.message === 'Internal server error'`, and `JSON.stringify(body)` does not contain the original error message or `error.stack`.
- [ ] Update `src/application/use-cases/get-note.use-case.ts` (still at the old path at this point). Throw `NoteExpired` for an expired note, `NoteNotFound` when the repository returns `null`, and `InvalidPassphrase` when decryption fails. Keep the current status codes as the observable outcome.
- [ ] Update `src/application/use-cases/get-note.use-case.spec.ts`. Replace `rejects.toThrow(NotFoundException)` with `rejects.toThrow(NoteExpired)` and `NoteNotFound` per case, and `rejects.toThrow(InvalidPassphrase)` for the bad passphrase case. The assertions stay equally strict. This is an error-type change, not a weakening.
- [ ] Add `src/application/use-cases/create-note.use-case.spec.ts` case if missing: `it('persists the note with the requested expiry and view limit')`: assert the note passed to the repository has `maxViews` equal to the input and `expiresAt` inside the expected window.

## 2. Notes vertical slice

- [ ] `git mv src/domain/note.entity.ts src/modules/notes/domain/note.entity.ts`.
- [ ] `git mv src/application/repositories/note.repository.ts src/modules/notes/domain/note.repository.ts`.
- [ ] `git mv src/application/services/crypto.service.ts src/modules/notes/domain/crypto.service.ts`.
- [ ] `git mv src/application/use-cases/create-note.use-case.ts src/modules/notes/application/create-note.use-case.ts`.
- [ ] `git mv src/application/use-cases/get-note.use-case.ts src/modules/notes/application/get-note.use-case.ts`.
- [ ] `git mv src/application/use-cases/create-note.use-case.spec.ts src/modules/notes/application/create-note.use-case.spec.ts`.
- [ ] `git mv src/application/use-cases/get-note.use-case.spec.ts src/modules/notes/application/get-note.use-case.spec.ts`.
- [ ] `git mv src/infrastructure/database/note.schema.ts src/modules/notes/infrastructure/persistence/note.schema.ts`.
- [ ] `git mv src/infrastructure/database/mongoose-note.repository.ts src/modules/notes/infrastructure/persistence/mongoose-note.repository.ts`.
- [ ] `git mv src/infrastructure/crypto/crypto.service.ts src/modules/notes/infrastructure/crypto/aes-gcm-crypto.adapter.ts`.
- [ ] `git mv src/infrastructure/crypto/crypto.service.spec.ts src/modules/notes/infrastructure/crypto/aes-gcm-crypto.adapter.spec.ts`. Rename the class under test to `AesGcmCryptoAdapter` and keep every assertion.
- [ ] `git mv src/presentation/notes/notes.controller.ts src/modules/notes/presentation/notes.controller.ts`.
- [ ] `git mv src/presentation/notes/create-note.dto.ts src/modules/notes/presentation/create-note.dto.ts`.
- [ ] Add `src/modules/notes/notes.module.ts` as the composition root. Bind `NoteRepository` to `MongooseNoteRepository`, `CryptoService` to `AesGcmCryptoAdapter`, register both use cases, the controller, and `NotesErrorFilter`.
- [ ] Update every import inside the moved files. Delete `src/presentation/notes/notes.module.ts` after the move.
- [ ] Remove `src/domain/`, `src/application/use-cases/`, `src/application/repositories/`, `src/application/services/`, `src/infrastructure/crypto/`, `src/infrastructure/database/`, and `src/presentation/notes/`.

## 3. Platform slices

- [ ] `git mv src/infrastructure/logging/application-log.schema.ts src/platform/logging/application-log.schema.ts`.
- [ ] `git mv src/infrastructure/logging/application-log.types.ts src/platform/logging/application-log.types.ts`.
- [ ] `git mv src/infrastructure/logging/logging.constants.ts src/platform/logging/logging.constants.ts`.
- [ ] `git mv src/infrastructure/logging/log-store.ts src/platform/logging/log-store.ts`.
- [ ] `git mv src/infrastructure/logging/redact.ts src/platform/logging/redact.ts`.
- [ ] `git mv src/infrastructure/logging/route-template.ts src/platform/logging/route-template.ts`.
- [ ] Move the logging spec files with their subjects to `src/platform/logging/`: `application-log.schema.spec.ts`, `redact.spec.ts`, `route-template.spec.ts`.
- [ ] `git mv src/presentation/logging/request-completion.interceptor.ts src/platform/logging/request-completion.interceptor.ts`.
- [ ] Move `src/presentation/logging/logging.module.ts` to `src/platform/logging/logging.module.ts`. Register `RequestCompletionInterceptor` with `APP_INTERCEPTOR` there.
- [ ] Delete `src/presentation/logging/logging-exception.filter.ts`. Nothing registers it.
- [ ] Remove the `APP_INTERCEPTOR` registration from `src/app.module.ts`. `LoggingModule` owns it now.
- [ ] Move `src/infrastructure/rate-limit/rate-limit.schema.ts` to `src/platform/rate-limit/rate-limit.schema.ts`.
- [ ] Move `src/application/rate-limit/rate-limit.store.ts` and `rate-limit.constants.ts` to `src/platform/rate-limit/`.
- [ ] Move `src/domain/rate-limit/rate-limit.types.ts` to `src/platform/rate-limit/rate-limit.types.ts`.
- [ ] Move `src/presentation/rate-limit/rate-limit.guard.ts`, `rate-limit.module.ts`, and `rate-limit.guard.spec.ts` to `src/platform/rate-limit/`.
- [ ] Delete `getNormalizedPath()` from `rate-limit.guard.ts`.
- [ ] Delete `RATE_LIMIT_READ_MAX` from `rate-limit.constants.ts` and its use in `rate-limit.store.ts`. The read limit stays out of this change.
- [ ] Update `src/platform/rate-limit/rate-limit.store.spec.ts`: add `it('keeps the create limit at 10 requests per 60 seconds')` asserting `RATE_LIMIT_CREATE_MAX === 10` and `RATE_LIMIT_WINDOW_SECONDS === 60`.
- [ ] Move `src/presentation/health/health.controller.ts` and `health.module.ts` to `src/platform/health/`.
- [ ] Update `src/app.module.ts` imports to `src/modules/notes/notes.module.ts`, `src/platform/logging/logging.module.ts`, `src/platform/rate-limit/rate-limit.module.ts`, `src/platform/health/health.module.ts`, `src/platform/errors/errors.module.ts`.
- [ ] Keep `src/app.controller.ts` and `src/app.service.ts` registered in `AppModule`.
- [ ] Keep `setGlobalPrefix('api', { exclude: ['/', '/api/health'] })` in `src/main.ts`, so `GET /` stays outside the prefix.
- [ ] Delete the now-empty directories `src/presentation/`, `src/infrastructure/`, and `src/application/`.

## 4. Enforcement

- [ ] Add `src/architecture.spec.ts`. Scan `src/` with `fs` and `path`, and parse import specifiers with a regular expression over `import ... from '...'` lines only.
  - [ ] `it('keeps business capabilities under src/modules')`: assert every non-platform directory under `src/` is `modules/` or a file at the `src/` root.
  - [ ] `it('has no root layer directories')`: assert `src/domain`, `src/application`, `src/infrastructure`, and `src/presentation` do not exist.
  - [ ] `it('keeps platform independent of business modules')`: assert no file under `src/platform/` imports from `src/modules/`.
  - [ ] `it('enforces inward dependency direction')`: assert no file under `modules/<name>/domain/` imports `application/`, `infrastructure/`, or `presentation/` of the same module, and no file under `application/` imports `infrastructure/` or `presentation/`.
  - [ ] `it('forbids deep imports across modules')`: assert no file under `modules/<a>/` imports `modules/<b>/(domain|application|infrastructure|presentation)/` for `a !== b`.
  - [ ] `it('forbids HTTP symbols in domain and application')`: assert no file under `domain/` or `application/` imports `HttpException`, `NotFoundException`, `UnauthorizedException`, `BadRequestException`, `@nestjs/common` route decorators, `@Req`, or `@Res`.
  - [ ] `it('keeps one module file per module directory')`: assert each directory under `src/modules/` contains exactly one `*.module.ts` at its root.
  - [ ] `it('registers APP_INTERCEPTOR exactly once')`: assert the string `APP_INTERCEPTOR` appears in exactly one file under `src/`.
- [ ] Add `test/notes.e2e-spec.ts` using `supertest` against `AppModule`, with `api` as the global prefix and no prefix exclusion:
  - [ ] `it('creates a note')`: `POST /api/notes` with a valid payload; assert `201`, `body.id` is a non-empty string, and `body.url` is `/notes/<id>`.
  - [ ] `it('reads a note with the original plaintext')`: create a note, then `GET /api/notes/:id`; assert `200` and `body.text` equals the created text.
  - [ ] `it('requires the passphrase when the note is protected')`: create a note with a passphrase, then read it without one; assert `401`.
  - [ ] `it('rejects a wrong passphrase')`: read a protected note with a wrong passphrase; assert `401`.
  - [ ] `it('returns 404 for an unknown id')`: `GET /api/notes/000000000000000000000000`; assert `404`.
  - [ ] `it('rejects expiresInDays above 7')`: `POST /api/notes` with `expiresInDays: 8`; assert `400`.
  - [ ] `it('rejects maxViews above 10')`: `POST /api/notes` with `maxViews: 11`; assert `400`.
  - [ ] `it('returns 429 with Retry-After after 10 creates from one IP')`: send 10 creates, then an eleventh; assert `429` and a defined `retry-after` header.
  - [ ] `it('answers the health check')`: `GET /api/health`; assert `200` and body `{ status: 'ok' }`.
  - [ ] `it('keeps the root route')`: `GET /`; assert `200` and body `Hello World!`.
- [ ] Keep `test/app.e2e-spec.ts`. Update it only if the prefix exclusion requires it. The assertion stays `200` and `Hello World!`.
- [ ] Keep `test/rate-limit.e2e-spec.ts` unchanged. Adjust only the import path if it moves.

## 5. Tooling and documentation

- [ ] In `backend/validate.sh`, remove `2>/dev/null || true` from the lint step, so a lint failure fails the script.
- [ ] Update `backend/AGENTS.md` "Architecture model" and "Layer layout": describe `src/modules/<capability>/` with inner layers, `src/platform/`, ports in `domain/`, and the error boundary.
- [ ] Update `backend/AGENTS.md` "Testing": add `src/architecture.spec.ts` and `test/notes.e2e-spec.ts`.
- [ ] Update the root `AGENTS.md` context table if any referenced path changes.
- [ ] Replace `backend/README.md` boilerplate with the project commands, the module map, and the validation rule.
- [ ] Update `.specs/changes/ORDER.md` with this change.

## 6. Verification

- [ ] Delegate to QA Tester: `cd backend && ./validate.sh`. Expect lint, `tsc --noEmit`, and `nest build` to pass.
- [ ] Delegate to QA Tester: `cd backend && npm test`. Expect every unit and architecture test to pass.
- [ ] Delegate to QA Tester: `cd backend && npm run test:e2e` with MongoDB available. Expect `test/notes.e2e-spec.ts` and `test/rate-limit.e2e-spec.ts` to pass.
- [ ] Compare the e2e responses against the pre-refactor baseline `1efc9d5`. Status codes, response fields, and the `Retry-After` header must match.
