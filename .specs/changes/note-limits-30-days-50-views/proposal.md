# Proposal: note-limits-30-days-50-views

## Intent

A note can stay available for at most 7 days and can be opened at most 10 times.
These limits are too low for notes that the recipient reads later, or that a group of people must read.
The maximum lifetime goes up to 30 days, and the maximum number of views goes up to 50.

## User Stories

### Story: longer-lifetime

As a person who shares a secret, I want the note to stay available for up to 30 days, so that the recipient can read it even when they open the link late.

### Story: more-readers

As a person who shares a secret with a group, I want the note to open up to 50 times, so that every person in the group can read it from one link.

## Scope

**In scope:**

- Backend validation of `POST /api/notes`: `expiresInDays` from 1 to 30, `maxViews` from 1 to 50.
- Create form on `/`: input limits and labels.
- Texts that state the limits: the "Como funciona" card on `/`, `/sobre`, and `/privacidade`.
- Documentation: root `AGENTS.md`, `backend/AGENTS.md`, `docs/poc.md`.
- Unit and E2E tests, including the update of the tests that assert the old limits.

**Out of scope:**

- The minimums (1 day, 1 view).
- Notes that already exist: they keep their expiry date and view limit.
- The MongoDB TTL index on `expiresAt` (it already removes a note at its expiry date).
- The legacy-key comment in `aes-gcm-crypto.adapter.ts`, which describes notes created before the default passphrase.

## Approach

Change the `@Max` values in `CreateNoteDto` from 7 to 30 and from 10 to 50.
Change the `max` attributes and the range labels of the two inputs on `/`.
Change the numbers in the page texts and in the docs.
