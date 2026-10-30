# Tasks: backend-invalid-note-id

## Implementation (Backend)

- [ ] `backend/src/modules/notes/infrastructure/persistence/mongoose-note.repository.ts`: in `findById`, return `null` when `!isValidObjectId(id)`, before calling the model.
- [ ] `backend/src/modules/notes/infrastructure/persistence/mongoose-note.repository.ts`: in `update`, return the note without a query when `!isValidObjectId(note.id)`.

## Tests (written by Backend, executed by Tester)

### Unit: `backend/src/modules/notes/infrastructure/persistence/mongoose-note.repository.spec.ts` (mock `Model` with `jest.fn()`)

- [ ] `it.each(['undefined', 'abc', 'zzzzzzzzzzzzzzzzzzzzzzzz', ''])('returns null for the malformed id %p')` — `await repo.findById(id)` is `null` and `model.findById` was not called.
- [ ] `it('queries the model for a well-formed id')` — for `'000000000000000000000000'`, `model.findById` was called with that id.

### E2E: `backend/test/notes.e2e-spec.ts`

- [ ] `it('returns 404 for the id "undefined" with the not-found body')` — `GET /api/notes/undefined` has status 404, and its body equals the body of `GET /api/notes/000000000000000000000000`.
- [ ] `it('returns 404 for a short id')` — `GET /api/notes/abc` has status 404.
- [ ] `it('returns 404 for a non-hex id of valid length')` — `GET /api/notes/zzzzzzzzzzzzzzzzzzzzzzzz` has status 404.
- [ ] `it('returns 404 for a malformed id with a passphrase')` — `GET /api/notes/abc?passphrase=x` has status 404.

### Regression

- [ ] The existing `it('returns 404 for an unknown id')` in `backend/test/notes.e2e-spec.ts` passes unchanged.

## Validation (Tester)

- [ ] `cd backend && npm run lint && npx tsc --noEmit && npm test && npm run build`
- [ ] `cd backend && npm run test:e2e` (Mongo running)
