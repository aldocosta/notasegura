# Design: frontend-unify-privacy-terms

## Context

`frontend/src/app/(site)/privacidade/page.tsx` and `frontend/src/app/(site)/termos/page.tsx` both use `TrustPage` and `TrustSection`.
`TRUST_PAGES` in `frontend/src/lib/site.ts` feeds the footer (`SiteFooter`), the main menu (`NAV_LINKS` → `SiteNav`), and the sitemap (`src/app/sitemap.ts`).
`TrustSection` always renders its title as `h2`.
`/privacidade` is the privacy policy URL that the AdSense review uses, so it must not move.
Next.js 16 `redirects()` in `next.config.ts` with `permanent: true` answers with HTTP 308 (`node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.md`).

## Decisions

### Decision: Keep `/privacidade` as the unified route

**Chosen:** Move the terms text into `frontend/src/app/(site)/privacidade/page.tsx` and delete `frontend/src/app/(site)/termos/`.

**Rationale:** Decided with the user. The URL is already known to AdSense, to the sitemap, and to `/sobre` and `/contato`.

**Alternatives considered:**

- A new route `/termos-e-privacidade`: needs two redirects and a new policy URL for AdSense.
- Keep `/termos`: the privacy policy URL would change.

### Decision: Redirect in `next.config.ts`

**Chosen:** Add to `next.config.ts`:

```ts
async redirects() {
  return [{ source: "/termos", destination: "/privacidade#termos", permanent: true }];
},
```

**Rationale:** Decided with the user (permanent redirect). The config redirect runs before any route and answers 308 without rendering a page. The fragment takes the visitor directly to the terms part.

**Alternatives considered:**

- `permanentRedirect()` in a `termos/page.tsx`: keeps a route file only to redirect, and renders through the `(site)` layout.
- `proxy.ts`: too heavy for one static redirect.

### Decision: Page structure with parts

**Chosen:** Add `TrustPart` to `frontend/src/components/TrustPage.tsx`:

```tsx
export function TrustPart({ id, title, icon: Icon, children }: {
  id: string;
  title: string;
  icon: IconComponent;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="scroll-mt-24 space-y-8">
      <div className="flex items-center gap-3 border-b border-hairline pb-3">
        {/* same icon badge as TrustSection, size h-10 w-10 */}
        <h2 id={`${id}-titulo`} className="text-xl font-bold text-ink sm:text-2xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}
```

Add an optional prop `level?: 2 | 3` (default `2`) to `TrustSection`. Sections inside a part use `level={3}`.
The heading order is `h1` → `h2` (part) → `h3` (section).
`scroll-mt-24` keeps the part heading below the header when the browser jumps to the anchor.

**Rationale:** Decided with the user (two parts, anchors). A correct heading order helps screen readers, and the default `level` keeps `/sobre` and `/contato` unchanged.

**Alternatives considered:**

- Keep every section as `h2` and add the parts as `h2` too: the parts and the sections would be at the same level.
- A React context for the heading level: more code for two call sites.

### Decision: Page content

**Chosen:** In `privacidade/page.tsx`:

- `metadata.title`: "Política de Privacidade e Termos de Uso". `metadata.description`: "Quais dados o Nota Segura - BR guarda, como funcionam os cookies de publicidade e as regras de uso do serviço."
- Hero: `title` "Política de Privacidade e Termos de Uso", `lead` "Como tratamos os seus dados e as regras para usar o serviço.", `icon` `IconShield`, `updatedAt` `POLICY_UPDATED_AT`.
- Highlights (three tiles, so that the row stays one line on desktop): "Nada em texto claro" (`IconKey`), "Sem cookies próprios" (`IconCookie`), "Uso permitido" (`IconShield`, text from the current terms tile).
- Intro section without a title: "Esta página reúne a Política de Privacidade e os Termos de Uso do Nota Segura - BR. O site é operado pelo Nota Segura - BR, que é o controlador dos dados descritos aqui. Ao criar ou abrir uma nota, você concorda com estas regras. Se não concordar, não use o serviço." followed by a paragraph with the links "Política de Privacidade" (`#privacidade`) and "Termos de Uso" (`#termos`), with `TextLink`.
- Part `privacidade` ("Política de Privacidade", `IconShield`), sections at `level={3}`: "Sem conta e sem cadastro", "O que guardamos sobre cada nota", "Registros técnicos", "Cookies e publicidade", "Seus direitos pela LGPD". Texts stay as they are today.
- Part `termos` ("Termos de Uso", `IconScale`), sections at `level={3}`: "Uso permitido", "Conteúdo das notas", "Disponibilidade e garantias", "Lei aplicável e alterações".

Removed as duplicates:

- The terms intro paragraph: merged into the page intro.
- The terms section "Privacidade" (link to `/privacidade`): the policy is now on the same page.
- The privacy section "Alterações": merged into "Lei aplicável e alterações", which becomes "Estes termos e esta política são regidos pelas leis da República Federativa do Brasil. Podemos alterar esta página quando o serviço mudar, e a data da última atualização aparece no topo. Dúvidas podem ser enviadas pela página de Contato."
- In "Conteúdo das notas", the sentence that the passphrase is not stored in clear text: the privacy part already states it. The section keeps "Não lemos o conteúdo das notas." and "Não conseguimos recuperar uma frase esquecida nem uma nota que já expirou, atingiu o limite de visualizações ou foi apagada."

Rename the component to `PrivacidadeETermosPage`.
Keep `POLICY_UPDATED_AT` as the implementation date in the format "30 de outubro de 2026".

**Rationale:** Decided with the user (privacy first, then terms, no repeated text). Each fact appears once.

**Alternatives considered:**

- One text merged by topic: loses the clear split between the policy and the terms.

### Decision: Links and labels

**Chosen:** In `frontend/src/lib/site.ts`, `TRUST_PAGES` becomes:

```ts
[
  { href: "/sobre", label: "Sobre" },
  { href: "/privacidade", label: "Privacidade e Termos" },
  { href: "/contato", label: "Contato" },
]
```

`NAV_LINKS`, the footer, and the sitemap follow without other code changes.
In `frontend/src/app/(site)/sobre/page.tsx`, the last paragraph becomes: "Saiba como tratamos os dados e quais são as regras de uso na <TextLink href="/privacidade">Política de Privacidade e Termos de Uso</TextLink>, ou fale conosco pela página de <TextLink href="/contato">Contato</TextLink>."

**Rationale:** Decided with the user (link "Privacidade e Termos"). One shared list keeps the menu, the footer, and the sitemap consistent.

**Alternatives considered:**

- Keep two menu links to `/privacidade#privacidade` and `/privacidade#termos`: two links to one page, and `aria-current` would mark both.

## Architecture

```text
/termos ──308──> /privacidade#termos        (next.config.ts redirects)

/privacidade (TrustPage)
├── hero: h1 "Política de Privacidade e Termos de Uso"
├── Destaques (3 tiles)
├── intro + links #privacidade, #termos
├── TrustPart id="privacidade" h2 → TrustSection level=3 (h3) × 5
└── TrustPart id="termos"      h2 → TrustSection level=3 (h3) × 4

TRUST_PAGES (3 entries) ──> SiteFooter, NAV_LINKS/SiteNav, sitemap.ts
```

## Risks

- **The label "Privacidade e Termos" is longer and may crowd the header from 640px.** Mitigation: the E2E test checks that the three links are visible at 1280px and that there is no horizontal scroll at 375px with the menu open or closed. Check 640px in the browser as well.
- **Next.js may encode the `#` in the redirect destination.** Mitigation: the E2E test asserts that the `location` header ends with `/privacidade#termos`. If it fails, do not change the assertion; stop and ask the user (requirement change).
- **External links and search results to `/termos`.** Mitigation: the permanent redirect.
- **Spec note outside this change:** the requirement "Privacy policy disclosures" in `frontend-adsense-readiness` still says that the site keeps the visitor IP address, but the current page states that the technical records do not include the IP address (commit `7db1e78`). This change does not edit that requirement. Fix it when `frontend-adsense-readiness` syncs.
