# Design: Frontend SafeNote (Next.js)

## Stack & design

- Next.js 16 (App Router), TypeScript, Tailwind 4.
- Design tokens/components: `docs/DESIGN-nerdwallet.md`.
- Minimalist, responsive; ads/add-ons max 8% of screen.

## Pages

- `/` (app/page.tsx): creation form.
- `/n/[id]` (app/n/[id]/page.tsx): view flow.

## Components

- NoteEditor, ExpirySelector, PassphraseInput, LinkResult, NoteViewer, ErrorState.

## API integration

- Backend base URL via env `NEXT_PUBLIC_API_URL`.
- POST /notes, GET /notes/:id.

## State

- Client components for form/interactions; server components for layout.