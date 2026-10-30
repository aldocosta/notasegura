# Design: backend-invalid-note-id

## Context

- `MongooseNoteRepository.findById(id)` calls `model.findById(id)`. Mongoose throws a `CastError` when `id` is not a valid ObjectId.
- `NotesErrorFilter` catches only `NoteNotFound`, `NoteExpired`, and `InvalidPassphrase`. The catch-all filter in `src/platform/errors/` maps the `CastError` to 500.
- The frontend calls `GET /api/notes/undefined` when a create request fails and the ID is missing.

## Decisions

### Decision: Validate the ID in the repository adapter

**Chosen:** In `MongooseNoteRepository.findById`, return `null` when `!isValidObjectId(id)` (from `mongoose`), before the query. In `update`, do nothing for an invalid ID.

**Rationale:** The ObjectId format is a persistence detail. The domain and the use case stay unaware of it. The existing `NoteNotFound` path then gives the 404 and the same body.

**Alternatives considered:**

- A validation pipe on the `:id` parameter: it returns 400, and it puts a storage format into the presentation layer.
- Catching `CastError` in the filter: the query still runs, and every other cast error would also become 404.

## Risks

- **`isValidObjectId` accepts any 12-character string**: such a string becomes a valid ObjectId and matches no note, so the answer is still 404.
