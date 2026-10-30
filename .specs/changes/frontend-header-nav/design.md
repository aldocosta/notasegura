# Design: frontend-header-nav

## Context

- `SiteHeader` (server component) renders only the brand link. `SiteFooter` renders `TRUST_PAGES` in `nav[aria-label="Rodapé"]`.
- `TRUST_PAGES` in `src/lib/site.ts` feeds the footer and the sitemap.
- The home page has the section `#como-funciona`.

## Decisions

### Decision: One list for the main menu

**Chosen:** Add `NAV_LINKS` to `src/lib/site.ts` with the entries of `TRUST_PAGES`. The footer and the sitemap keep `TRUST_PAGES`. On 2026-10-30 the user removed the entry "Como funciona" (`/#como-funciona`); the home page already has the hero button "Como Funciona!".

**Rationale:** The owner adds editorial pages in one place later. The sitemap must not list an anchor URL.

### Decision: Client `SiteNav` inside the server header

**Chosen:** `src/components/SiteNav.tsx` with `"use client"`. It reads `usePathname()` to set `aria-current="page"` on the link whose `href` equals the path . It keeps `open` in `useState`. Layout:

- `sm` and up: `ul` with `hidden sm:flex`, inline links.
- Below `sm`: `button` "Menu" with `sm:hidden`, `aria-expanded`, and `aria-controls="menu-principal"`; the `ul#menu-principal` renders as a vertical list below the header only when `open`.
- Close on button toggle, on link click, on Escape (focus returns to the button), and when the path changes.

`SiteHeader` renders the brand link and `SiteNav` inside `nav aria-label="Principal"`.

**Rationale:** Only the menu needs client state; the header stays a server component. A disclosure button is simpler and more accessible than a drawer.

**Alternatives considered:**

- Horizontally scrolling links on mobile: five links overflow at 375px and hide the last ones.
- CSS-only checkbox toggle: no `aria-expanded` and no Escape handling.

### Decision: Visual

**Chosen:** Links `text-sm font-bold text-body hover:text-primary`, current link `text-primary underline underline-offset-4`, focus ring `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`, gap `gap-5`. Mobile list: full width, `border-t border-hairline`, each link `block px-4 py-3`. Only existing theme tokens from `docs/DESIGN-nerdwallet.md`.

## Risks

- **Duplicate link names**: "Sobre", "Privacidade", "Termos", and "Contato" now appear in the header and in the footer. E2E or unit selectors that search the whole page by role and name fail in strict mode. Mitigation: scope such selectors to `nav[aria-label="Rodapé"]` or `nav[aria-label="Principal"]`; keep every assertion.
- **`usePathname` in unit tests**: mock `next/navigation` with `vi.mock`.
