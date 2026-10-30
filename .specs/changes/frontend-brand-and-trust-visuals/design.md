# Design: frontend-brand-and-trust-visuals

## Context

- `docs/DESIGN-nerdwallet.md`: `logo-wordmark` is `{colors.primary}` text at `heading-4`, preceded by a mark with `{colors.logo-lime}`. Article pages open on a `{colors.primary}` gradient band with a white headline. Mint panels and `icon-circle` tiles carry the surface. Corners stay small (`rounded.xs` controls, `rounded.lg` cards). Illustration is flat, without shadow.
- `TrustPage` and `TrustSection` in `src/components/TrustPage.tsx` render a plain `h1` and plain sections.
- `src/app/favicon.ico` is the default Next.js icon.
- E2E and unit tests find the brand by the link name "Nota Segura - BR" (exact).

## Decisions

### Decision: Logo artwork

**Chosen:** One SVG on a `0 0 32 32` grid, flat, no stroke on the outer shape:

- Note sheet: a rounded rectangle path from (6,3) to (26,29) with radius 2, filled `currentColor` (primary by default), with the top-right corner cut at (20,3)–(26,9).
- Folded corner: a triangle (20,3)–(26,9)–(20,9) filled `var(--color-logo-lime)`.
- Keyhole: a circle at (16,15) r=3.2 and a trapezoid (14.6,16.5)–(17.4,16.5)–(18.2,23)–(13.8,23), both filled with the background color (white by default, primary on the inverse variant).

Wordmark: "Nota Segura" in `font-bold text-lg text-primary`, then a "BR" badge `rounded-xs bg-lime-accent px-1 text-[10px] font-bold text-forest` aligned to the cap height.

**Rationale:** The sheet says "note", the keyhole says "secure", and the lime fold follows the design system rule for the logo mark. Solid shapes on a 32 grid stay legible at 16px.

**Alternatives considered:**

- Shield with lock, message bubble with lock, note with timer: rejected by the user on 2026-10-30.

### Decision: Logo components

**Chosen:** `src/components/Logo.tsx` exports:

- `LogoMark({ size = 32, tone = "default" | "inverse", className })`: the SVG with `aria-hidden="true"` and `focusable="false"`. `inverse` paints the sheet white and the keyhole primary, for green backgrounds.
- `Logo({ tone, showWordmark = true })`: `LogoMark` plus the wordmark. On `inverse`, the wordmark is white.

`SiteHeader` renders `<Link href="/" aria-label="Nota Segura - BR"><Logo /></Link>`. `SiteFooter` renders `Logo` at the start of the footer. `not-found.tsx` renders `LogoMark size={64}` above the `h1`. `TrustHero` may render `LogoMark tone="inverse"` as a watermark.

`src/app/icon.svg` holds the same geometry with literal colors (`#008254`, `#8dc63f`, `#ffffff`). Delete `src/app/favicon.ico`.

**Rationale:** One geometry in two files (component and static icon). The static file is required because the icon file convention does not run React. The `aria-label` keeps the accessible name that the tests use.

**Alternatives considered:**

- `app/icon.tsx` with `ImageResponse`: a PNG at build time, heavier than a 1 KB SVG.

### Decision: Icon set

**Chosen:** `src/components/icons.tsx` exports small components (`IconLock`, `IconShield`, `IconEyeOff`, `IconClock`, `IconTrash`, `IconUserOff`, `IconCookie`, `IconScale`, `IconAlert`, `IconMail`, `IconFileText`, `IconHeart`, `IconGlobe`, `IconKey`) on a `0 0 24 24` grid, `fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`, each with `aria-hidden="true"` and `focusable="false"`, size via `className`.

**Rationale:** No new dependency. A consistent outline style next to the solid logo.

**Alternatives considered:**

- `lucide-react`: a dependency for about fourteen icons.

### Decision: Trust page layout

**Chosen:** Rework `src/components/TrustPage.tsx`:

- `TrustPage({ title, lead, icon, updatedAt, highlights, children })`.
- Hero: `section data-hero` with `bg-gradient-to-b from-primary to-primary-deep text-on-primary`, `px-4 py-10 sm:py-14`; inside, an `icon-circle` (`h-14 w-14 rounded-full bg-on-primary/15` with the icon in white), the `h1` (`text-2xl sm:text-4xl font-bold`), the lead `p` (`opacity-90`), and the "Última atualização" line as a small pill. A large `LogoMark tone="inverse"` at 10% opacity sits at the right edge from `sm` up, clipped by `overflow-hidden`.
- Highlights: `ul` with `grid gap-4 sm:grid-cols-3`, pulled up over the hero edge (`-mt-6`), each tile a card `rounded-lg border border-hairline-strong bg-canvas p-4` with an `icon-circle-inactive` (`bg-mint-100 text-primary`), a bold title, and one muted sentence.
- `TrustSection({ title, icon, tone = "plain" | "mint", children })`: heading row with the icon in a small `icon-circle`; `tone="mint"` renders the section as a `bg-mint-50 rounded-lg p-5` panel for key notices.

Content per page (text unchanged, except the lead and the tiles):

| Page | Hero icon | Lead | Highlights (title) |
| --- | --- | --- | --- |
| `/sobre` | `IconHeart` | "Um jeito simples e gratuito de enviar segredos que se apagam sozinhos." | Sem cadastro · Criptografado · Autodestrutivo |
| `/privacidade` | `IconShield` | "Guardamos o mínimo e apagamos tudo no prazo." | Nada em texto claro · IP só por 60 segundos · Apagado na expiração |
| `/termos` | `IconScale` | "As regras para usar o serviço com segurança." | Uso permitido · Sem garantia de disponibilidade · Lei brasileira |
| `/contato` | `IconMail` | "Fale com a gente sobre abuso, privacidade ou falhas." | Denúncias de abuso · Pedidos de privacidade · Falhas e sugestões |

Each tile has one sentence that restates a fact already in the page text. On `/privacidade`, the section about the passphrase and on `/contato` the section "O que não conseguimos fazer" use `tone="mint"`.

**Rationale:** It follows the design system: one saturated hero band, then quiet mint and white surfaces. The tiles give a scan path; the text remains the source of detail.

### Decision: Contact call to action

**Chosen:** On `/contato`, when `getContactEmail()` is not `null`, render a card with `IconMail`, the address as `TextLink`, and an anchor "Enviar e-mail" styled as `button-primary` (`bg-primary text-on-primary rounded-xs p-4 font-bold`, full width below `sm`).

## Risks

- **Link name in tests**: the header link now has an `svg` and two text nodes. Mitigation: `aria-label="Nota Segura - BR"` keeps the accessible name.
- **Favicon cache**: browsers cache the old icon. Mitigation: none needed; the new `link rel="icon"` has a hash query.
- **Text inside highlights**: tiles add `p` elements; the "at least three paragraphs" guarantee still counts only real sentences, which hold.
