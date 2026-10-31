# Tasks: frontend-guides-and-seo

## Implementation (Frontend)

### SEO foundation

- [x] `frontend/src/lib/brand.ts`: export `BRAND_COLORS` (Decision: Brand colors for generated images).
- [x] `frontend/src/lib/seo.ts`: `siteMetadata`, `pageMetadata`, `absoluteUrl`, `articleJsonLd`, `breadcrumbJsonLd`, and `jsonLdHtml` (Decision: SEO helpers).
- [x] `frontend/src/components/JsonLd.tsx`: a native `<script type="application/ld+json">` with `jsonLdHtml(data)`.
- [x] `frontend/src/app/layout.tsx`: `export const metadata = siteMetadata()`.
- [x] `frontend/src/lib/share-image.tsx`: `shareImage({ eyebrow, title })` (Decision: Share images).
- [x] `frontend/src/app/opengraph-image.tsx`, `frontend/src/app/(site)/algoritmos/[id]/opengraph-image.tsx`, `frontend/src/app/(site)/guias/[slug]/opengraph-image.tsx`: `alt`, `size`, `contentType`, and the default function. The two dynamic files export `generateStaticParams` with the same params as their pages.
- [x] Move the two dynamic image files, and their tests, outside the `(site)` group: `frontend/src/app/algoritmos/[id]/opengraph-image.tsx` and `frontend/src/app/guias/[slug]/opengraph-image.tsx` (Decision: Share images). The two folders contain only the image file and its test.
- [x] `frontend/src/lib/seo.ts`: `siteMetadata` sets `openGraph.images` and `twitter.images` to the same default image as `pageMetadata` (Decision: SEO helpers). Test: in `frontend/src/lib/seo.test.ts`, `it('builds the site metadata')` adds: `openGraph.images` and `twitter.images` are `[{ url: "/opengraph-image", width: 1200, height: 630, alt: "Nota Segura - BR" }]`. This fixes the E2E `every page has an absolute share image` on `/` under `next dev`; the E2E assertion does not change.
- [x] `frontend/src/lib/seo.ts`: `pageMetadata` accepts `image` and always sets `openGraph.images` and `twitter.images` (Decision: SEO helpers). The algorithm page and the guide page pass `image: <path> + "/opengraph-image"`.

### Shared components

- [x] `frontend/src/components/TrustPage.tsx`: the optional prop `breadcrumb` (Decision: Visible breadcrumb). The trust pages do not pass it.
- [x] `frontend/src/components/CreateNoteCallout.tsx`: move the block "Precisa enviar um segredo?" from the algorithm page, with the same text (Decision: Create-note callout component).

### Content data

- [x] `frontend/src/lib/algorithms/types.ts`: add `publishedAt: string` to `Article`; set the dates of Decision: Publication dates in the 25 files of `frontend/src/lib/algorithms/articles/`.
- [x] `frontend/src/lib/guides/types.ts` and `frontend/src/lib/guides/index.ts`: the types, `COMPARISON_SECTION_TITLES`, `GUIDES`, `GUIDES_PATH`, `findGuide`, `guideHref`, `guidesFor`, `guideText`, and `guideWordCount` (Decision: Guide data).
- [x] `frontend/src/lib/guides/articles/`: the eight guides of Decision: Guide content, with `publishedAt` equal to the implementation date. Each guide states only the product facts of the Context section of `design.md`.

### Pages, menu, and sitemap

- [x] `frontend/src/lib/site.ts`: re-export `GUIDES_PATH`; add "Guias" to `NAV_LINKS` after "Algoritmos". `TRUST_PAGES` does not change.
- [x] `frontend/src/components/SiteNav.tsx`: change the desktop gap from `gap-5` to `gap-4 lg:gap-5`.
- [x] `frontend/src/app/(site)/guias/page.tsx` (Decision: Guide index page).
- [x] `frontend/src/app/(site)/guias/[slug]/page.tsx` (Decision: Guide page layout).
- [x] `frontend/src/app/(site)/algoritmos/[id]/page.tsx` and `frontend/src/app/(site)/algoritmos/page.tsx` (Decision: Algorithm page and index changes).
- [x] `frontend/src/app/(site)/sobre/page.tsx`, `privacidade/page.tsx`, `contato/page.tsx`: replace `metadata` with `pageMetadata` with the current title and description and their path.
- [x] `frontend/src/app/sitemap.ts`: the 39 entries in the order of Decision: Main menu and sitemap.
- [x] `frontend/AGENTS.md`: add the guide data (`src/lib/guides/`), the SEO helpers (`src/lib/seo.ts`), and the share images to the context of the frontend.

## Tests (written by Frontend, executed by Tester)

### Unit: SEO foundation

- [x] `frontend/src/lib/brand.test.ts` (`// @vitest-environment node`) — `it('matches the color tokens')`: read `frontend/src/app/globals.css`; `primary`, `primaryDeep`, `onPrimary`, and `limeHero` equal the values of their `--color-*` tokens.
- [x] `frontend/src/lib/seo.test.ts` — with `NEXT_PUBLIC_SITE_URL` stubbed to `https://notasegura.example`:
  - `it('builds the site metadata')`: `metadataBase.href` is `https://notasegura.example/`; `title.template` is `"%s | Nota Segura - BR"`; `openGraph.locale` is `"pt_BR"`; `twitter.card` is `"summary_large_image"`.
  - `it('builds the page metadata')`: for `{ title: "T", description: "D", path: "/guias" }`, `alternates.canonical` is `"/guias"`; `openGraph` has `title`, `description`, `url` `"/guias"`, `siteName` `"Nota Segura - BR"`, `locale` `"pt_BR"`, and `type` `"website"`; `twitter` has `card`, `title`, and `description`.
  - `it('uses the article type')`: with `type: "article"`, `openGraph.type` is `"article"`.
  - [x] `it('sets the share image')`: without `image`, `openGraph.images` and `twitter.images` are `[{ url: "/opengraph-image", width: 1200, height: 630, alt: "Nota Segura - BR" }]`; with `image: "/guias/x/opengraph-image"`, the `url` of both is `/guias/x/opengraph-image`.
  - `it('builds absolute URLs')`: `absoluteUrl("/")` is `https://notasegura.example`; `absoluteUrl("/guias")` is `https://notasegura.example/guias`.
  - `it('builds the Article data')`: `@type` is `"Article"`; `inLanguage` is `"pt-BR"`; `datePublished` and `dateModified` equal `publishedAt`; `url`, `mainEntityOfPage`, and `image` are absolute; `author.name` and `publisher.name` are `"Nota Segura - BR"`; `publisher.logo.url` ends with `/icon.svg`.
  - `it('builds the BreadcrumbList data')`: three items give positions 1, 2, 3, the names in order, and absolute `item` URLs.
  - `it('escapes < in JSON-LD')`: `jsonLdHtml({ a: "</script>" })` contains no `<` and contains `\u003c/script>`; `JSON.parse` of the output gives the input.
- [x] `frontend/src/components/JsonLd.test.tsx` — `it('renders the data as JSON-LD')`: the container has one `script[type="application/ld+json"]`; `JSON.parse` of its text equals the data.

### Unit: shared components

- [x] `frontend/src/components/TrustPage.test.tsx` — add `it('renders the breadcrumb')`: navigation "Trilha de navegação" has the links "Início" (`/`) and "Algoritmos" (`/algoritmos`) in order, and a last item "Cifra de César" that is not a link and has `aria-current="page"`; add `it('renders no breadcrumb without the prop')`: no navigation "Trilha de navegação". Keep every existing assertion.
- [x] `frontend/src/components/CreateNoteCallout.test.tsx` — `it('links to the note form')`: heading "Precisa enviar um segredo?" and link "Criar uma nota" with `href` `/#criar-nota`.

### Unit: content data

- [x] `frontend/src/lib/guides/index.test.ts`:
  - `it('lists the eight guides in order')`: the slugs of `GUIDES` equal the eight slugs of Decision: Guide content, in order; four have kind "Comparação" and four "Guia prático".
  - `it('has unique kebab-case slugs')`.
  - `it('has a title of 30 to 70 characters and a description of 70 to 160 characters')`.
  - `it('uses the comparison sections')`: each comparison has exactly `COMPARISON_SECTION_TITLES`, in order.
  - `it('has a valid comparison table')`: the section "Comparação lado a lado" has a `table` with a non-empty `caption`, at least three `columns` with "Critério" first, at least four `rows`, and one cell per column in each row; the `columns` of each comparison equal the columns of Decision: Guide content.
  - `it('uses four to eight sections in a practical guide')`: the first one is "Resumo"; titles are unique.
  - `it('has three highlights')`.
  - `it('cites the algorithms of the design')`: `algorithms` equals the list of Decision: Guide content; each id is in `ALGORITHMS`; 2 to 6 ids with no duplicate.
  - `it('relates two other guides')`: `related` equals the list of Decision: Guide content; both slugs exist; none equals the guide slug.
  - `it('has 600 to 1400 words')`: `guideWordCount` for each guide.
  - `it('states the required facts')`: `REQUIRED_TERMS` maps each slug to the `code` terms of its entry in Decision: Guide content; `guideText(guide)` contains each term.
  - `it('has a publication date')`: `publishedAt` matches `/^\d{4}-\d{2}-\d{2}$/`.
  - `it('finds the guides of an algorithm')`: `guidesFor("aes-gcm")` gives the slugs `aes-gcm-ou-chacha20-poly1305`, `criptografia-hash-ou-codificacao`, `como-enviar-uma-senha-com-seguranca`; `guidesFor("rot13")` is empty; no result has more than three guides.
  - `it('finds only known guides')`: `findGuide("nao-existe")` is `undefined`; `guideHref("como-guardar-senhas")` is `/guias/como-guardar-senhas`.
  - `it('counts the table cells in the text')`: `guideText` of a comparison contains its table caption and the first cell of each row.
- [x] `frontend/src/lib/algorithms/index.test.ts` — add `it('has the publication date of the design')`: each article `publishedAt` equals the date of Decision: Publication dates.

### Unit: menu and sitemap (updates required by the MODIFIED requirements)

- [x] `frontend/src/lib/site.test.ts` — `it('lists the main menu links')`: the five links "Algoritmos", "Guias", "Sobre", "Privacidade e Termos", "Contato" with their paths, in order. `it('lists the three trust pages')` does not change.
- [x] `frontend/src/components/SiteNav.test.tsx` — rename `it('renders the four links in order')` to `it('renders the five links in order')` and assert the five links; add `it('marks Guias on the guide index')`: on `/guias` only "Guias" has `aria-current="page"`; add `it('marks nothing on a guide page')`: on `/guias/como-guardar-senhas` no link has `aria-current`.
- [x] `frontend/src/app/sitemap.test.ts` — `it('lists the home, the trust pages, the algorithm pages, and the guides')`: the 39 URLs in order; `it('lists no note URL')` does not change.

### Unit: pages

- [x] `frontend/src/app/(site)/guias/page.test.tsx`:
  - `it('renders the heading and the introduction')`: one `h1` "Guias de criptografia e segurança"; section "Como usar estes guias" has two or three paragraphs of 120 to 300 words.
  - `it('lists the guides by kind')`: list "Comparações" has the four comparison titles as links to `/guias/<slug>`, in order; list "Guias práticos" has the four practical titles, in order.
  - `it('builds the metadata')`: `title` "Guias de criptografia e segurança"; `alternates.canonical` `/guias`; `openGraph.type` `"website"`.
  - `it('renders the breadcrumb data')`: the JSON-LD `BreadcrumbList` has the names "Início" and "Guias".
- [x] `frontend/src/app/(site)/guias/[slug]/page.test.tsx`:
  - `it('generates the eight slugs')`: `generateStaticParams()` equals the slugs of `GUIDES`, in order.
  - `it('renders a comparison')`: for `aes-gcm-ou-chacha20-poly1305`, one `h1` with the title; three tiles; the section `h2` headings, before "Algoritmos citados", are the five comparison titles in order.
  - `it('renders the comparison table')`: for `sha-256-sha-1-ou-md5`, one `table` with a `caption`; the `th[scope="col"]` cells are "Critério", "MD5", "SHA-1", "SHA-256"; at least four body rows, each with a first `th[scope="row"]` and four cells; the table is inside a `div.overflow-x-auto`.
  - `it('renders a practical guide')`: for `como-enviar-uma-senha-com-seguranca`, the first section is "Resumo" and the page has a `ul` with the steps.
  - `it('links the cited algorithms, the related guides, and the product')`: "Ler sobre AES-256-GCM" to `/algoritmos/aes-gcm`; the two related titles to their `/guias/<slug>`; "Todos os guias" to `/guias`; "Criar uma nota" to `/#criar-nota`; "Outros guias" has no link to the page itself.
  - `it('renders the breadcrumb')`: "Trilha de navegação" has "Início" (`/`), "Guias" (`/guias`), and the guide title with `aria-current="page"`.
  - `it('renders the structured data')`: the `Article` `headline` equals the `h1` text; `image` ends with `/guias/<slug>/opengraph-image`; the `BreadcrumbList` has three items; no JSON-LD text contains `<`.
  - `it('builds the metadata')`: for `como-guardar-senhas`, `title` is the guide title, `alternates.canonical` is `/guias/como-guardar-senhas`, and `openGraph.type` is `"article"`.
  - `it('calls notFound for an unknown slug')`.
- [x] `frontend/src/app/(site)/algoritmos/[id]/page.test.tsx` — keep every existing assertion; add to `it('builds the metadata')`: `alternates.canonical` is `/algoritmos/aes-gcm` and `openGraph.type` is `"article"`; add:
  - `it('links the guides that cite the algorithm')`: for `aes-gcm`, "Veja também" has, after the two related algorithm links and before "Todos os algoritmos", the links "Ler o guia: AES-256-GCM ou ChaCha20-Poly1305: qual escolher?", "Ler o guia: Criptografia, hash ou codificação: qual é a diferença?", and "Ler o guia: Como enviar uma senha com segurança", in this order.
  - `it('links no guide when none cites the algorithm')`: for `rot13`, no link starts with "Ler o guia:".
  - `it('renders the breadcrumb')`: for `cesar`, "Início" (`/`), "Algoritmos" (`/algoritmos`), and "Cifra de César" with `aria-current="page"`.
  - `it('renders the structured data')`: for `enigma`, the `Article` `headline` is "Máquina Enigma: o que é e como funciona"; the `BreadcrumbList` names are "Início", "Algoritmos", "Máquina Enigma".
- [x] `frontend/src/app/(site)/algoritmos/page.test.tsx` — keep every existing assertion; add `it('links the guides')`: link "Ver todos os guias" with `href` `/guias`; add to the metadata test: `alternates.canonical` is `/algoritmos`.
- [x] `frontend/src/app/(site)/trust-pages.test.tsx` — add `it.each` `it('sets the canonical URL of %s')`: `/sobre`, `/privacidade`, and `/contato` have `alternates.canonical` equal to their path and `openGraph.type` `"website"`; the titles and descriptions do not change.
- [x] `frontend/src/app/(site)/guias/[slug]/opengraph-image.test.ts` and `frontend/src/app/(site)/algoritmos/[id]/opengraph-image.test.ts` — `it('exports the image settings')`: `size` is `{ width: 1200, height: 630 }`, `contentType` is `"image/png"`, `alt` is `"Nota Segura - BR"`; `it('generates the same params as the page')`: `generateStaticParams()` equals the one of the page.
- [x] Move these two tests next to the moved image files: `frontend/src/app/guias/[slug]/opengraph-image.test.ts` and `frontend/src/app/algoritmos/[id]/opengraph-image.test.ts`. The assertions do not change.
- [x] `frontend/src/app/(site)/algoritmos/[id]/page.test.tsx` and `frontend/src/app/(site)/guias/[slug]/page.test.tsx` — in `it('builds the metadata')`, add: the `url` of `openGraph.images[0]` is `<path>/opengraph-image`.

### E2E: `frontend/e2e/guides-and-seo.spec.ts` (new; block `https://pagead2.googlesyndication.com/**`)

- [x] `test('index serves content without JavaScript')` — `request.get("/guias")`: status 200; one `<h1`; the eight `href="/guias/<slug>"` appear in order.
- [x] `test('each guide serves its text without JavaScript')` — for each slug: status 200; one `<h1` with the title; `<title>` is "<title> | Nota Segura - BR"; the meta description has 70 to 160 characters; `/guias/como-enviar-uma-senha-com-seguranca` contains "outro canal".
- [x] `test('unknown guide returns 404')` — `/guias/nao-existe` gives status 404.
- [x] `test('comparison table structure')` — `/guias/sha-256-sha-1-ou-md5`: the table has a caption, the column headers "Critério", "MD5", "SHA-1", "SHA-256", and at least four body rows.
- [x] `test('guides fit on mobile')` — viewport 375 x 812; for each guide, `document.documentElement.scrollWidth` is not larger than the viewport width.
- [x] `test('cited algorithm link navigates')` — on `/guias/aes-gcm-ou-chacha20-poly1305`, click "Ler sobre ChaCha20-Poly1305"; URL is `/algoritmos/chacha20-poly1305`.
- [x] `test('breadcrumb navigates')` — on `/algoritmos/cesar`, click "Algoritmos" in "Trilha de navegação"; URL is `/algoritmos`.
- [x] `test('algorithm pages link the guides')` — `/algoritmos/aes-gcm` "Veja também" has the three "Ler o guia: …" links in order; `/algoritmos/rot13` has none; on `/algoritmos`, "Ver todos os guias" opens `/guias`.
- [x] `test('content pages have canonical and sharing metadata')` — for `/sobre`, `/privacidade`, `/contato`, `/algoritmos`, `/guias`, `/algoritmos/aes-gcm`, and `/guias/como-guardar-senhas` (request, no JavaScript): `link[rel=canonical]` and `og:url` equal `https://notasegura.example` + path; `og:site_name` is "Nota Segura - BR"; `og:locale` is "pt_BR"; `og:type` is "article" on the two article paths and "website" on the others; `twitter:card` is "summary_large_image".
- [x] `test('every page has an absolute share image')` — `/` has an `og:image` that starts with `https://notasegura.example/opengraph-image`; `/algoritmos/aes-gcm` has an `og:image` that contains `/algoritmos/aes-gcm/opengraph-image`; `/guias/como-guardar-senhas` has an `og:image` that contains `/guias/como-guardar-senhas/opengraph-image`.
- [x] Add to `test('every page has an absolute share image')`: `/sobre`, `/privacidade`, `/contato`, `/algoritmos`, and `/guias` have an `og:image` that starts with `https://notasegura.example/opengraph-image`; `/algoritmos/aes-gcm` and `/guias/como-guardar-senhas` have exactly one `og:image`, and it ends with `/opengraph-image` (no hash suffix).
- [x] `test('share images are 1200 x 630 PNG')` — `/opengraph-image`, `/algoritmos/aes-gcm/opengraph-image`, and `/guias/como-guardar-senhas/opengraph-image`: status 200; `content-type` is `image/png`; the PNG `IHDR` width is 1200 and height is 630.
- [x] `test('structured data')` — `/algoritmos/enigma`: the JSON-LD has an `Article` with `headline` "Máquina Enigma: o que é e como funciona" and `url` `https://notasegura.example/algoritmos/enigma`, and a `BreadcrumbList` with "Início", "Algoritmos", "Máquina Enigma" and positions 1 to 3; `/guias` has a `BreadcrumbList` with "Início" and "Guias"; no JSON-LD text contains `<`.
- [x] `test('guide pages carry the AdSense code')` — `/guias` and `/guias/rsa-ou-curvas-elipticas` contain the `adsbygoogle.js` script for `ca-pub-1234567890123456` and the `google-adsense-account` meta tag.

### E2E updates required by the MODIFIED requirements

- [x] `frontend/e2e/header-nav.spec.ts` — `NAV_LINKS`: add `["Guias", "/guias"]` after "Algoritmos"; add `test('Guias is marked on the guide index')`: on `/guias`, "Guias" has `aria-current="page"` and the other four links do not; add `test('mobile menu opens the guides')`: viewport 375 x 812, open the menu, click "Guias", URL is `/guias`, and "Menu" has `aria-expanded="false"`. Keep every other assertion.
- [x] `frontend/e2e/privacy-terms-unified.spec.ts` — `test('menu shows Algoritmos and the trust links; …')`: the menu has "Algoritmos", "Guias", and the trust links in order; the footer does not change. `test('header fits at 640px')`: the five links are visible in one line (same `top` of each link box) and there is no horizontal scroll. If the 640px test fails, do not change the assertion; stop and report to the user. (It failed on 2026-10-31; replaced by the 768px test in the Remediation section.)
- [x] `frontend/e2e/adsense-readiness.spec.ts` — `test('sitemap lists the public pages')`: the 39 URLs in order; no URL contains `/n/` or `/termos`.

### Remediation from the first validation (2026-10-31)

Menu breakpoint (MODIFIED requirement "Responsive main menu": inline links from 768px):

- [x] `frontend/src/components/SiteNav.tsx`: `sm:flex` → `md:flex` on the list; `sm:hidden` → `md:hidden` on the "Menu" button and on the open menu.
- [x] `frontend/e2e/privacy-terms-unified.spec.ts` — replace `TABLET` with `{ width: 768, height: 1024 }` and rename `test('header fits at 640px')` to `test('header fits at 768px')`, with the same assertions (five links, same `top`, no horizontal scroll); add `test('header shows the Menu button at 640px')`: viewport 640 x 800, the "Menu" button is visible with `aria-expanded="false"`, and there is no horizontal scroll.
- [x] Check every other E2E spec for a viewport from 640px to 767px that expects inline links, and report it to the Mestre instead of changing it.

Guide text (factual fixes only; no `REQUIRED_TERMS` term may be removed, and each guide keeps 600 to 1400 words):

- [x] `frontend/src/lib/guides/articles/como-guardar-senhas.ts`: replace "Todas as opções abaixo já cuidam do sal e guardam os parâmetros junto com o hash" with a text that says that Argon2id and bcrypt keep the salt and the parameters in the hash, and that with PBKDF2 and scrypt you must generate and store the salt and the parameters yourself.
- [x] `frontend/src/lib/guides/articles/como-enviar-uma-senha-com-seguranca.ts`: in the lead and in the highlight, a note "deixa de abrir" after the time or the view limit (it does not "some"); "Lembre também" → "Lembre-se também".
- [x] `frontend/src/lib/guides/articles/o-que-e-criptografia-de-ponta-a-ponta.ts`: the signatures prove that the temporary keys came from the owner of the identity key; the security code is what proves that the identity key belongs to the person.
- [x] `frontend/src/lib/guides/articles/rsa-ou-curvas-elipticas.ts`: in 2024, NIST published three post-quantum standards: ML-KEM (`FIPS 203`), ML-DSA (FIPS 204), and SLH-DSA (FIPS 205). The ECDSA P-256 signature has 64 bytes in the raw format (r‖s, used by WebCrypto) and about 70 to 72 bytes in DER.
- [x] `frontend/src/lib/guides/articles/aes-gcm-ou-chacha20-poly1305.ts`: in the conclusion, say that the key and the nonce (shown as "IV" in the AES-256-GCM playground) change at each click.
- [x] Tests: `frontend/src/lib/guides/index.test.ts` — add `it('states the corrected facts')`: `como-guardar-senhas` text does not contain "Todas as opções abaixo já cuidam do sal"; `como-enviar-uma-senha-com-seguranca` lead and highlights do not contain "some depois" and the lead contains "deixa de abrir"; `rsa-ou-curvas-elipticas` text contains "FIPS 205". The existing assertions do not change.

### Regression

- [ ] All other E2E specs and unit tests pass without changes.

## Validation (Tester)

- [ ] Stop any process on port 3005, then `cd frontend && npm run lint && npx tsc --noEmit && npm test && npm run build`. The build lists `/guias`, eight `/guias/<slug>` pages, and the `opengraph-image` routes as prerendered.
- [ ] `cd frontend && npx playwright test` (all specs; `smoke` and `comprehensive` with backend and Mongo running).
- [ ] Browser check (portal): the menu at 1280px, 768px, 640px, and 375px; `/guias`, one comparison, and one practical guide at 1280px and 375px; the share image of `/guias/criptografia-hash-ou-codificacao` shows "ç", "ã", and "é" correctly (if a character is missing, report it; a font file needs a new task). Read the eight guides for typos and wrong facts, and report them.
