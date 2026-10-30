# Design: frontend-how-it-works-cta

## Approach
- Give the form section (the one with heading "Criar uma nota") `id="criar-nota"`.
- Add the textarea an accessible name: `aria-label="Texto da nota"` (it has only a placeholder today), so it can be targeted and announced.
- At the end of the `#como-funciona` card, after the "Dica" paragraph, add an anchor:
  - label: exactly `Criar a primeira nota` (was `Criar 1 Nota` until 2026-10-30) (no `uppercase` transform, so the visible text matches the label);
  - `href="#criar-nota"`, so it still works without JavaScript;
  - `onClick`: `preventDefault()`, then `document.getElementById("criar-nota")?.scrollIntoView({ behavior: "smooth", block: "start" })`, then focus the textarea with `focus({ preventScroll: true })` so keyboard and screen-reader users land in the form.
- Same pattern as the existing "Como Funciona!" anchor (anchor + smooth scroll), mirrored in the opposite direction.

## Visual (design system `button-primary`, `docs/DESIGN-nerdwallet.md`)
- Background `bg-primary`, text `text-on-primary`, `font-bold text-sm` (ui-label), `rounded-xs` (2px), padding `p-4` (spacing.md), hover `bg-primary-deep`, visible focus ring `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`.
- Responsive: full width on mobile (`block w-full text-center`), auto width on `sm` and up (`sm:inline-block sm:w-auto`), with `mt-5` spacing from the tip.
- Use only existing Tailwind theme tokens; no new colors or magic values.

## Risks
- jsdom does not implement `scrollIntoView`; unit tests must stub `Element.prototype.scrollIntoView`.
- `vitest.config.ts` has no `@/` alias, so importing `src/app/page.tsx` (which imports `@/lib/api`) fails in Vitest until the alias is added.
- The design reference uppercases button labels; the user asked for the exact label "Criar a primeira nota", and existing buttons are not uppercased, so we keep the exact casing.

## Update 2026-10-30
- Move the `#como-funciona` section above the `#criar-nota` section in `src/app/(site)/page.tsx`. Do not change the content or classes of either section.
- The CTA now scrolls down to the form instead of up. The scroll and focus behavior do not change.
- The hero button "Como Funciona!" still targets `#como-funciona`, now directly below the hero.
