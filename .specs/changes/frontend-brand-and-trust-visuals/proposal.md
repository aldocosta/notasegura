# Proposal: frontend-brand-and-trust-visuals

## Intent

The site has no logo: the header shows the name as plain text, and the browser tab shows the default Next.js icon.
The trust pages (`/sobre`, `/privacidade`, `/termos`, `/contato`) are plain text with headings, so they look unfinished next to the home page.
A logo gives the site a recognizable identity that other screens can reuse, and graphic structure makes the trust pages easier to scan and more credible.

## User Stories

### Story: recognize-the-brand

As a visitor, I want to see the same logo in the header, the browser tab, and related screens, so that I recognize the site and trust that the link I received is the real service.

### Story: scan-trust-pages

As a visitor, I want the trust pages to show their key points with icons, highlights, and clear sections, so that I understand how the site treats my data without reading every paragraph.

## Scope

**In scope:**

- A logo: a symbol (note sheet with a lime folded corner and a keyhole) and a wordmark ("Nota Segura" with a small "BR" badge), as reusable components with a full variant and a symbol-only variant, for light and green backgrounds.
- The logo in the header, the footer, and the 404 page, and the symbol as the site icon (favicon).
- A shared visual layout for the four trust pages: a green hero band with an icon and a lead sentence, a row of highlight tiles, and section cards with icons.
- A prominent "Enviar e-mail" button on `/contato`.
- An inline SVG icon set, without a new dependency.
- Unit and E2E tests.

**Out of scope:**

- Changes to the text of the policies and terms, other than one lead sentence and the highlight tile captions per page.
- The home page and the note page layout, except the header logo.
- Open Graph or social share images.
- Editorial content pages.

## Approach

Draw the symbol as a small inline SVG on a 32 x 32 grid so that it stays sharp at 16px.
Build `Logo` and `LogoMark` components and an `app/icon.svg` from the same geometry.
Extend `TrustPage` with a hero, a highlights row, and icon cards, and move each trust page onto it.

## Resolved Questions

- 2026-10-30 "log pro site" means a logo (visual brand mark). Decided with the user.
- 2026-10-30 Symbol concept: a note sheet with a folded corner in lime and a keyhole in the center. Decided with the user.
- 2026-10-30 Wordmark: "Nota Segura" in green with a small "BR" badge in lime. Decided with the user.
