# Proposal: frontend-how-it-works-cta

## Summary
Add a "Criar 1 Nota" button at the end of the "Como funciona" card on the home page. The button smoothly scrolls the page back to the "Criar uma nota" form.

## Motivation
The hero's "Como Funciona!" button takes the user down to the explanation card, which sits below the form. After reading it, the user has no direct way back to the form and must scroll up manually. A call to action at the end of the card closes the loop: hero → explanation → create note.

## Scope
- In scope: `frontend/src/app/page.tsx` (new button, `id` on the form section, focus on the textarea after scrolling), unit and E2E tests, the Vitest `@/` alias needed to render the page in unit tests.
- Out of scope: backend, layout changes to other sections, changes to the existing "Como Funciona!" button behavior, extracting a shared button component.
