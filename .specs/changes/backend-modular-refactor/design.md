# Design: Backend Modular Refactor

## Context

The backend is NestJS 11 with Mongoose. The current layout puts every capability into the same four root directories. The rate limiting slice, the logging slice, and the health check already behave like vertical slices, because each one owns its schema, its adapter, and its entry point. The notes capability does not. It is the only business capability and it is split across the whole `src/` tree.

Two constraints shape this design:

- The HTTP contract must not change. Clients and existing note links must keep working.
- The project is a POC. Ceremony must pay for itself in this codebase, not in theory.

## Decisions

### Decision: Vertical slices with layers inside the module

**Chosen:** A business capability lives in `src/modules/<capability>/`. Inside that directory: `domain/`, `application/`, `infrastructure/`, `presentation/`, and one `<capability>.module.ts` at the module root.

**Rationale:** The NestJS module is the unit the framework already isolates and the unit a developer reasons about. A new capability becomes one new directory. The module file is the composition root, so wiring stays next to the code it wires.

**Alternatives considered:**

- Layer-first layout at the root: the current state. Adding a capability touches four directories, and infrastructure becomes a shared dump.
- Flat feature folders without layers: smaller, but the notes capability has a real port (repository), a real adapter (Mongo), a real cryptographic port, and domain rules. Flattening them would hide the dependency direction.
- Nest-native services without ports: fewer files, but it removes the ability to swap the crypto or the persistence adapter, which this product depends on for its security story.

### Decision: Platform capabilities stay flat

**Chosen:** `src/platform/logging/`, `src/platform/rate-limit/`, `src/platform/health/`, and `src/platform/errors/` hold their files directly. No `domain/` or `application/` directories.

**Rationale:** These capabilities have no invariants. They are framework glue: an interceptor, a guard, a schema, a filter. Copying the four-layer template into them creates indirection with no domain rule behind it, which is the exact defect this change removes.

**Alternatives considered:**

- Four layers in every slice: consistent, but adds empty directories and extra mapping for code with no business rule.
- Platform code inside `src/modules/`: wrong semantics. Logging and rate limiting are not business capabilities, and `notes` must not own them.

### Decision: Ports live in the module's `domain/` directory

**Chosen:** `note.repository.ts` and `crypto.service.ts` are abstract classes in `src/modules/notes/domain/`. Their Mongoose and AES-GCM implementations live in `src/modules/notes/infrastructure/`.

**Rationale:** The repository is a domain concept. The encryption contract is a product rule: the note is stored only as ciphertext. Keeping both ports beside the entity keeps the dependency direction readable, and it repairs the mismatch between `backend/AGENTS.md` and the code.

**Alternatives considered:**

- Ports in `application/`: the current state. It leaks persistence vocabulary into the use case layer and contradicts the documented architecture.
- Ports in `src/platform/`: they are used by one capability only, so a shared kernel now would be speculative.

### Decision: Domain errors plus module-owned error mapping

**Chosen:** `src/platform/errors/domain-error.ts` defines a transport-neutral base `DomainError` with a stable `code` and a `message`. `src/modules/notes/domain/errors.ts` defines `NoteNotFound`, `NoteExpired`, and `InvalidPassphrase`. Two filters form the HTTP error boundary:

- `src/modules/notes/presentation/notes-error.filter.ts` catches the three domain errors and maps each one to its HTTP status and response body.
- `src/platform/errors/unhandled-error.filter.ts` is the global fallback (`@Catch()`). It delegates `HttpException` to `BaseExceptionFilter` and maps every other error to `500` with a fixed message.

Each filter is registered once, in the module that owns it.

**Rationale:** Use cases must not import `NotFoundException` or `UnauthorizedException`. The mapping stays in the module that owns the error semantics, so `src/platform/` never imports `src/modules/`. `platform` stays ignorant of the business, which the Platform Separation rule requires. The current status codes and the current response bodies survive: the messages stay exactly `Note not found or expired` for `404` and `Passphrase required or invalid` for `401`.

**Alternatives considered:**

- One global filter in `platform/errors/` that knows the notes errors: it would invert the dependency direction, because platform would import a module.
- Domain errors that carry an HTTP status number: no Nest import, but the domain would know the transport.
- Registry of mappers injected into a global filter: correct and generic, but the multi-provider wiring costs more than the POC needs.
- Keep Nest exceptions in use cases: less code, but `application/` stays coupled to the transport and the mapping stays scattered.

### Decision: Module file owns the wiring

**Chosen:** Each module file declares its controllers, its providers, and its port-to-adapter bindings. `AppModule` imports modules and registers global concerns only.

**Rationale:** One composition root per module. The current code registers `RequestCompletionInterceptor` in `AppModule` and again as a provider in `LoggingModule`, which allows two instances. The module owns its interceptor, and `LoggingModule` exports nothing that another module must re-register.

**Alternatives considered:**

- Global registration of every provider in `AppModule`: central but distant from the code it wires.
- Request-scoped providers: not needed, no per-request state lives in a provider.

### Decision: Architecture rules as a Jest test

**Chosen:** `src/architecture.spec.ts` reads the `src/` tree with `fs` and asserts five rules: module layout, absence of root layer directories, inward dependency direction, cross-module isolation, and no HTTP symbols in `domain/` or `application/`.

**Rationale:** A refactor without enforcement decays. The project already runs Jest, so the check adds no dependency. The test runs in the same command as the unit tests.

**Alternatives considered:**

- `dependency-cruiser` or `eslint-plugin-boundaries`: stronger rules and better messages, but two new dependencies and two new configuration files for one POC.
- An ESLint `no-restricted-imports` rule: cannot express "only this module's public entry point" without per-module configuration.

### Decision: Keep `GET /`

**Chosen:** Keep `AppController`, `AppService`, and `test/app.e2e-spec.ts`. `GET /` stays `200` with the body `Hello World!`. `setGlobalPrefix` keeps the exclusion for `/`.

**Rationale:** The user rejected removal. The route is part of the preserved HTTP contract for this change, even though it serves no product purpose.

**Alternatives considered:**

- Remove the route: rejected by the user on 2026-10-25.
- Redirect `/` to the frontend: out of scope. Deployment topology is not part of this change.

### Decision: Keep the Nest primitive for each platform concern

**Chosen:** Logging stays an interceptor. Rate limiting stays a guard. Error mapping stays an exception filter. Health stays a controller. This change moves those classes. It does not rewrite them as middleware.

**Rationale:** The Nest request lifecycle is middleware, then guards, then interceptors, then pipes, then the handler, then interceptors again, then exception filters. Each concern already sits at the point that can see what it needs. An interceptor sees the outcome and the error, so it fits request logging. A guard sees the chosen route through `ExecutionContext`, so it fits a limit that applies to one route. A filter is the only component that runs on an uncaught exception, so it fits error mapping. Health is a route, so it stays a controller. Middleware runs before Nest selects the handler, so it cannot know the route and it cannot catch a controller exception.

**Alternatives considered:**

- One middleware for logging, rate limiting, and errors: it would run too early for errors and too blind for route-specific limits. The Nest docs call middleware context-blind.
- Rewrite the rate-limit guard as middleware in this change: possible, but it is a behavior change, not a move. Out of scope.

### Decision: No shared folder in this change

**Chosen:** Do not create `src/shared/`. A module may import `src/platform/` and another module's public entry point. Any other cross-module import fails `src/architecture.spec.ts`.

**Rationale:** There is one business module. An empty shared folder becomes a dump. Add the folder when a second module needs a type that is neither platform nor owned by one module.

**Alternatives considered:**

- Create `src/shared/` now and allowlist it: rejected by the user on 2026-10-25.

### Decision: Move files with `git mv`

**Chosen:** Every file move uses `git mv`, in its own commit group.

**Rationale:** History follows the file, which makes the refactor reviewable and reversible. A delete plus add loses blame.

**Alternatives considered:**

- Delete and re-create: simpler script, worse review.

## Architecture

```text
src/
  main.ts
  app.module.ts
  architecture.spec.ts              # structural rules
  modules/
    notes/
      notes.module.ts               # composition root
      domain/
        note.entity.ts
        note.repository.ts          # port
        crypto.service.ts           # port
        errors.ts
      application/
        create-note.use-case.ts
        get-note.use-case.ts
      infrastructure/
        persistence/note.schema.ts
        persistence/mongoose-note.repository.ts
        crypto/aes-gcm-crypto.adapter.ts
      presentation/
        notes.controller.ts
        create-note.dto.ts
        notes-error.filter.ts
  platform/
    errors/
      domain-error.ts
      unhandled-error.filter.ts
    logging/
      logging.module.ts
      request-completion.interceptor.ts
      log-store.ts
      application-log.schema.ts
      application-log.types.ts
      logging.constants.ts
      redact.ts
      route-template.ts
    rate-limit/
      rate-limit.module.ts
      rate-limit.guard.ts
      rate-limit.store.ts
      rate-limit.schema.ts
      rate-limit.constants.ts
      rate-limit.types.ts
    health/
      health.module.ts
      health.controller.ts
```

Dependency direction:

```text
presentation ──► application ──► domain
      │                              ▲
      └──────────► infrastructure ───┘

modules/* ──► platform/*        (one direction only)
platform/* ──╳ modules/*        (forbidden)
modules/a ──╳ modules/b/**      (only the public entry point)
```

Request flow after the refactor:

```text
HTTP request
  -> RateLimitGuard (platform)
  -> NotesController (modules/notes/presentation)
       -> CreateNoteUseCase | GetNoteUseCase (application)
            -> NoteRepository (domain port) -> Mongoose adapter
            -> CryptoService (domain port)  -> AES-GCM adapter
       -> domain error on failure
  -> NotesErrorFilter (modules/notes/presentation) maps domain error to status
  -> UnhandledErrorFilter (platform) maps anything left to 500
  -> RequestCompletionInterceptor (platform logging) writes the log record
```

## Risks

- **Behavior drift while moving files**: the compiler catches broken imports, and `test/notes.e2e-spec.ts` pins status codes, bodies, and the `Retry-After` header. Any drift shows up as a failing assertion.
- **The error filter changes the response body**: the filter must produce the same body as the Nest default. The unit test asserts the exact body for `401`, `404`, and `500`, and the e2e suite asserts the same bodies over HTTP.
- **Architecture test false positives**: scan only `import` statements, not comments or strings. Keep the rules textual and simple, so the failure message names the offending file.
- **Ceremony returns through platform slices**: the layout rule applies to `src/modules/` only. A review check and the architecture test keep `src/platform/` flat.
- **Large diff is hard to review**: apply in the task order, one commit per group. Each group leaves the build green.
- **Duplicate provider registration survives**: `LoggingModule` owns and registers the interceptor. `AppModule` imports the module and does not register it again. The architecture test asserts a single `APP_INTERCEPTOR` registration in `src/`.

## Verification Waivers

(none)

## Spec Changes

(none)

## Baseline Errors

(none)
