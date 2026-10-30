# Proposal: backend-invalid-note-id

## Intent

`GET /api/notes/:id` returns HTTP 500 when `id` is not a valid note ID, for example `undefined` or `abc`.
The database driver cannot cast the value, and the catch-all filter turns the cast error into a server error.
A malformed link is a client error, not a server failure. It must get the same answer as an unknown note, so that the API does not reveal anything about the ID format and the logs do not fill with false errors.

## User Stories

### Story: clear-answer-for-bad-links

As a recipient who opens a broken or truncated note link, I want the site to tell me that the note does not exist, so that I know the link is wrong instead of seeing a server error.

## Scope

**In scope:**

- HTTP 404 with the not-found body for any `id` that is not a valid note ID.
- Unit tests for the repository adapter and E2E tests for the endpoint.

**Out of scope:**

- The status code for expired or consumed notes (today 404).
- Rate limiting and validation of `POST /api/notes`.
- Frontend changes. The note page already shows "Nota não encontrada." for a 404.

## Approach

The repository adapter treats an ID that is not a valid ObjectId as "no such note" and returns `null` without querying the database.
The use case then throws `NoteNotFound`, which the existing notes filter maps to 404.
