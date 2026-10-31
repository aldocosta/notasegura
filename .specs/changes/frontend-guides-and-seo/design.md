# Design: frontend-guides-and-seo

## Context

This change starts after `frontend-playground-classic-algorithms`: `ALGORITHMS` and `ARTICLES` have 25 entries, and `/sitemap.xml` lists 30 URLs.
`frontend/src/app/(site)/algoritmos/[id]/page.tsx` renders an article with `TrustPage`, six `TrustSection`s, the playground, "Veja também", and the block "Precisa enviar um segredo?".
`frontend/src/app/layout.tsx` sets only `title` (with the template `"%s | Nota Segura - BR"`) and `description`. No page sets `metadataBase`, a canonical URL, Open Graph, or structured data.
`frontend/src/app/(site)/page.tsx` (the home page) is a client component, so it cannot export `metadata`.
`NAV_LINKS` in `frontend/src/lib/site.ts` has four links: "Algoritmos" and the three trust pages. `SiteNav` marks the link whose `href` equals the pathname.
Next.js 16 references:

- JSON-LD: render a native `<script type="application/ld+json">` in the page, and replace `<` with `\u003c` (`node_modules/next/dist/docs/01-app/02-guides/json-ld.md`).
- `metadataBase` in the root layout makes relative metadata URLs absolute (`01-app/03-api-reference/04-functions/generate-metadata.md`).
- `opengraph-image.tsx` is a special route handler. It is prerendered at build time unless it uses request-time APIs, and it receives `params` in a dynamic segment (`01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md`).
- `ImageResponse` supports flexbox only, and the bundle must stay below 500 KB (`01-app/03-api-reference/04-functions/image-response.md`).

Product facts that the guides state (checked in the backend on 2026-10-31):

- A note lasts from 1 to 30 days and from 1 to 50 views (`create-note.dto.ts`).
- The text is sent to the server over HTTPS and encrypted there with AES-256-GCM. The key is derived with `scrypt` from the passphrase, or from a server-side default passphrase when the user sets none (`aes-gcm-crypto.adapter.ts`). The passphrase is never stored.
- MongoDB deletes the note at its expiry date (TTL index on `expiresAt`). After the view limit, the note can no longer be opened.

## Decisions

### Decision: Brand colors for generated images

**Chosen:** `frontend/src/lib/brand.ts` exports `BRAND_COLORS = { primary: "#008254", primaryDeep: "#006642", onPrimary: "#ffffff", limeHero: "#9ae600" }`.
A unit test reads `frontend/src/app/globals.css` and checks that each value equals the matching `--color-*` token.

**Rationale:** `ImageResponse` cannot use Tailwind classes. One module with a drift test keeps the images on the design tokens.

**Alternatives considered:**

- Hex values inside each image file: three copies that can drift from the tokens.

### Decision: SEO helpers

**Chosen:** `frontend/src/lib/seo.ts`:

```ts
export function siteMetadata(): Metadata;
// { metadataBase: new URL(getSiteUrl()), title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
//   description: "Compartilhamento anônimo de textos criptografados e autodestrutivos.",
//   openGraph: { siteName: SITE_NAME, locale: "pt_BR", type: "website", images: DEFAULT_SHARE_IMAGES },
//   twitter: { card: "summary_large_image", images: DEFAULT_SHARE_IMAGES } }
// DEFAULT_SHARE_IMAGES = [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_NAME }], the same default as pageMetadata.

export function pageMetadata(page: {
  title: string; description: string; path: string; type?: "website" | "article"; image?: string;
}): Metadata;
// const images = [{ url: image ?? "/opengraph-image", width: 1200, height: 630, alt: SITE_NAME }];
// { title, description, alternates: { canonical: path },
//   openGraph: { title, description, url: path, siteName: SITE_NAME, locale: "pt_BR", type: type ?? "website", images },
//   twitter: { card: "summary_large_image", title, description, images } }

export function absoluteUrl(path: string): string; // getSiteUrl() + path; "/" gives getSiteUrl()

export function articleJsonLd(article: {
  path: string; headline: string; description: string; publishedAt: string; image: string;
}): Record<string, unknown>;
// { "@context": "https://schema.org", "@type": "Article", headline, description, inLanguage: "pt-BR",
//   datePublished: publishedAt, dateModified: publishedAt, url: absoluteUrl(path), mainEntityOfPage: absoluteUrl(path),
//   image: absoluteUrl(image),
//   author: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
//   publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/"),
//                logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") } } }

export function breadcrumbJsonLd(items: { name: string; path: string }[]): Record<string, unknown>;
// { "@context": "https://schema.org", "@type": "BreadcrumbList",
//   itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.path) })) }

export function jsonLdHtml(data: Record<string, unknown>): string; // JSON.stringify(data).replace(/</g, "\\u003c")
```

`frontend/src/components/JsonLd.tsx` renders `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(data) }} />`.
`frontend/src/app/layout.tsx` uses `export const metadata = siteMetadata()`.
Next.js merges `openGraph` shallowly, so `pageMetadata` always returns the full `openGraph` object.
A page `openGraph` without `images` replaces the root `openGraph`, and Next.js adds a file-based image only in the segment of the file (`mergeStaticMetadata`). So `pageMetadata` always sets `images`: the site image `/opengraph-image` by default, and the page image on the algorithm and guide pages.
`siteMetadata` also sets `images`, so the pages without `pageMetadata` (the home, the note page, the 404 page) use `metadataBase` too. In `next dev`, a file-based image URL uses `localhost` and ignores `metadataBase` (`getSocialImageMetadataBaseFallback` in `next/dist/lib/metadata/resolvers/resolve-url.js`), and Next.js does not add the file image when the metadata of the same segment sets `openGraph.images` (`mergeStaticMetadata`).

**Rationale:** Pure functions are easy to test, and one helper keeps the canonical URL, Open Graph, and Twitter values equal on every page.

**Alternatives considered:**

- The `schema-dts` package for typed JSON-LD: a new dependency for two object shapes.
- `next/script` for JSON-LD: the Next.js guide recommends a native `script` tag, because JSON-LD is data, not code.

### Decision: Canonical URL and Open Graph scope

**Chosen:** These pages use `pageMetadata`: `/sobre`, `/privacidade`, `/contato`, `/algoritmos`, `/guias` (`type: "website"`), and `/algoritmos/<id>` and `/guias/<slug>` (`type: "article"`).
The home page, the note page, and the 404 page keep the root metadata (`siteMetadata()`), so they have no canonical URL.

**Rationale:** The content pages are the ones that search engines index and that people share. The home page needs a server wrapper to export metadata, which is out of scope.

### Decision: Share images

**Chosen:** Three `opengraph-image.tsx` files. Each one exports `alt = "Nota Segura - BR"`, `size = { width: 1200, height: 630 }`, `contentType = "image/png"`, and a default function that returns `shareImage({ eyebrow, title })` from `frontend/src/lib/share-image.tsx`:

- `frontend/src/app/opengraph-image.tsx`: eyebrow "Notas anônimas e autodestrutivas", title "Compartilhe textos sensíveis com segurança". It applies to every route without its own image.
- `frontend/src/app/algoritmos/[id]/opengraph-image.tsx`: eyebrow `algorithm.kind`, title `algorithm.name`. It exports `generateStaticParams` with the same ids as the page.
- `frontend/src/app/guias/[slug]/opengraph-image.tsx`: eyebrow `guide.kind`, title `guide.title`. It exports `generateStaticParams` with the same slugs as the page.

The two dynamic image files are outside the `(site)` group. Next.js 16 adds a hash suffix to a metadata route inside a route group (`getMetadataRouteSuffix` in `next/dist/lib/metadata/get-metadata-route.js`), for example `/guias/<slug>/opengraph-image-11a0wr`. Outside the group, the URLs are `/algoritmos/<id>/opengraph-image` and `/guias/<slug>/opengraph-image`. Because these files are not in the segment of the page, Next.js does not add them to the page metadata; the pages pass `image` to `pageMetadata` (Decision: Algorithm page and index changes, Decision: Guide page layout). Each of the two folders contains only the image file.

`shareImage` returns `new ImageResponse(...)`: a 1200 x 630 flex column with a linear gradient from `BRAND_COLORS.primary` to `BRAND_COLORS.primaryDeep`, padding 80px, the text "Nota Segura - BR" (32px, bold, `BRAND_COLORS.limeHero`) at the top, the title (64px, bold, `BRAND_COLORS.onPrimary`, at most three lines) in the middle, and the eyebrow (32px, `BRAND_COLORS.onPrimary`, opacity 0.85) at the bottom. It uses the default font of `ImageResponse`, so no font file is added.

**Rationale:** Generated images need no binary files, and they stay correct when a title changes. The default font keeps the bundle small.

**Alternatives considered:**

- Static PNG files: 34 files to draw by hand and keep in sync with the titles.
- One image for the whole site: every shared link would look the same.

### Decision: Visible breadcrumb

**Chosen:** `TrustPage` gets an optional prop `breadcrumb?: { name: string; href?: string }[]`. When present, the hero shows, above the icon, `<nav aria-label="Trilha de navegação"><ol>` with one `li` for each item. Items with `href` are `Link`s (`text-on-primary underline`); the last item has no `href`, is a `span` with `aria-current="page"`, and the items are separated by `aria-hidden` "›" characters. The text size is `text-sm`.

- Algorithm page: Início (`/`) › Algoritmos (`/algoritmos`) › `algorithm.name`.
- Guide page: Início (`/`) › Guias (`/guias`) › `guide.title`.

The `BreadcrumbList` JSON-LD of each page uses the same items, with the path of the current page as the last `item`.
The index pages get only the JSON-LD: Início › Algoritmos and Início › Guias.

**Rationale:** Google asks that structured data describe visible content. The trust pages do not pass the prop, so they do not change.

### Decision: Create-note callout component

**Chosen:** Move the block "Precisa enviar um segredo?" of the algorithm page to `frontend/src/components/CreateNoteCallout.tsx`, with the same text, the icon `IconShield`, `tone="mint"`, and the link "Criar uma nota" to `/#criar-nota`. The algorithm page and the guide page render it.

**Rationale:** Both pages end with the same call to the product.

### Decision: Publication dates

**Chosen:** `Article` gets `publishedAt: string` (`YYYY-MM-DD`). The values come from the commit that added each article file:

- `"2026-10-30"`: `aes-gcm`, `chacha20-poly1305`, `aes-cbc`, `aes-ctr`, `rsa-oaep`, `sha-256`, `sha-512`, `sha-1`, `md5`, `hmac-sha-256`, `ecdsa`, `ed25519`, `rsa-pss`, `ecdh`, `pbkdf2`, `base64`, `cesar`, `vigenere`.
- `"2026-10-31"`: `hex`, `rot13`, `atbash`, `playfair`, `rail-fence`, `enigma`, `vernam`.

Each guide has `publishedAt` equal to the date of its implementation.
`articleJsonLd` uses the same date for `datePublished` and `dateModified`.

**Rationale:** Google recommends dates in `Article` data. Dates from the git history are true.

### Decision: Guide data

**Chosen:** `frontend/src/lib/guides/`:

```ts
// types.ts
export type GuideKind = "Comparação" | "Guia prático";
export const COMPARISON_SECTION_TITLES = [
  "Resumo", "Como cada um funciona", "Comparação lado a lado", "Quando escolher cada um", "Conclusão",
] as const;
export type GuideTable = { caption: string; columns: string[]; rows: string[][] };
export type GuideSection = { title: string; paragraphs: string[]; items?: string[]; table?: GuideTable };
export type Guide = {
  slug: string;              // kebab-case, the URL segment
  kind: GuideKind;
  title: string;             // h1 and <title>, 30 to 70 characters
  description: string;       // meta description, 70 to 160 characters
  lead: string;              // one sentence under the h1
  highlights: [{ title: string; text: string }, { title: string; text: string }, { title: string; text: string }];
  sections: GuideSection[];  // 4 to 8 sections; the first one is "Resumo"; titles are unique
  algorithms: AlgorithmId[]; // 2 to 6 different ids that the guide cites
  related: [string, string]; // two other guide slugs
  publishedAt: string;       // YYYY-MM-DD
};
```

- A comparison guide has exactly the sections of `COMPARISON_SECTION_TITLES`, in order. Its section "Comparação lado a lado" has a `table` with a `caption`, at least three `columns` (the first one is "Critério"), and at least four `rows`; each row has one cell per column.
- A practical guide has 4 to 8 sections, and the first one is "Resumo".
- `articles/<slug>.ts`: one `Guide` each.
- `index.ts`: `GUIDES` (the eight guides in the order of Decision: Guide content), `GUIDES_PATH = "/guias"` (re-exported from `frontend/src/lib/site.ts`), `findGuide(slug)`, `guideHref(slug) => "/guias/" + slug`, `guidesFor(id: AlgorithmId)` (the guides whose `algorithms` include `id`, in `GUIDES` order, at most three), `guideText(guide)`, and `guideWordCount(guide)`.
- `guideText` returns the lead, the three highlight texts, and every paragraph, list item, table caption, and table cell. `guideWordCount` counts runs of characters between spaces in that text, like `articleWordCount`.
- Each guide has 600 to 1400 words.

**Rationale:** The same data pattern as the algorithm articles, so the same tests check the structure, the length, and the facts. The fixed comparison sections make the comparisons predictable for readers.

**Alternatives considered:**

- MDX: a new dependency and a build configuration for eight pages.
- Separate routes for comparisons and guides: two index pages and two route trees for eight pages.

### Decision: Guide index page

**Chosen:** `frontend/src/app/(site)/guias/page.tsx`, a server component:

1. `TrustPage` with the title "Guias de criptografia e segurança", the lead "Comparações entre algoritmos e passo a passo para proteger senhas e mensagens no dia a dia.", the icon `IconScale`, and three tiles: `IconScale` "Comparações": "Algoritmos lado a lado, com uma tabela e uma recomendação."; `IconShield` "Guias práticos": "O que fazer para proteger uma senha ou uma mensagem."; `IconKey` "Teste no navegador": "Cada guia leva aos algoritmos que você pode testar no playground."
2. `TrustSection` "Como usar estes guias" (`IconFileText`) with two to three paragraphs (120 to 300 words): what each kind of guide offers, that the guides link to the algorithm pages, and that the Nota Segura - BR protects the notes with AES-256-GCM.
3. `TrustSection` "Comparações" (`IconScale`) with `<ul aria-label="Comparações">`, and `TrustSection` "Guias práticos" (`IconShield`) with `<ul aria-label="Guias práticos">`. Each `li` has an `h3` whose content is a `Link` to `guideHref(slug)` with the guide title, and a `p` with the description.
4. `<JsonLd data={breadcrumbJsonLd([{ name: "Início", path: "/" }, { name: "Guias", path: "/guias" }])} />`.

Metadata: `pageMetadata({ title: "Guias de criptografia e segurança", description: "Comparações entre algoritmos de criptografia e guias práticos para enviar e guardar senhas e mensagens com segurança.", path: "/guias" })`.

**Rationale:** The title as the link text gives each link a unique, descriptive name.

### Decision: Guide page layout

**Chosen:** `frontend/src/app/(site)/guias/[slug]/page.tsx`, a server component with `dynamicParams = false`, `generateStaticParams()` that returns `GUIDES.map((g) => ({ slug: g.slug }))`, `generateMetadata`, and `notFound()` for an unknown slug. From top to bottom:

1. `TrustPage` with `title = guide.title`, `lead = guide.lead`, `icon` `IconScale` (comparison) or `IconShield` (practical guide), the breadcrumb of Decision: Visible breadcrumb, and three tiles from `guide.highlights` with the icons `IconFileText`, `IconShield`, and `IconKey`.
2. One `TrustSection` (`h2`) for each section. The icons cycle, by section index, through `IconFileText`, `IconKey`, `IconScale`, `IconGlobe`, `IconLock`, `IconAlert`, `IconShield`, `IconClock`. Paragraphs are `p`; `items` are a `ul` after the paragraphs; a `table` comes after the paragraphs, inside `<div className="overflow-x-auto">`, as `<table>` with `<caption>`, `<thead>` with `<th scope="col">` cells, and `<tbody>` rows whose first cell is `<th scope="row">`. The table uses `border-hairline-strong` borders, `p-2` cells, `text-sm`, and `bg-mint-50` for the header row.
3. `TrustSection` "Algoritmos citados" (`IconKey`) with the links "Ler sobre <name>" to `algorithmHref(id)` for each id in `guide.algorithms`.
4. `TrustSection` "Outros guias" (`IconGlobe`) with the links to the two `related` guides (the link text is the guide title) and the link "Todos os guias" to `/guias`.
5. `CreateNoteCallout`.
6. `JsonLd` with `articleJsonLd({ path: guideHref(slug), headline: guide.title, description: guide.description, publishedAt: guide.publishedAt, image: guideHref(slug) + "/opengraph-image" })`, and `JsonLd` with the breadcrumb.

Metadata: `pageMetadata({ title: guide.title, description: guide.description, path: guideHref(slug), type: "article", image: guideHref(slug) + "/opengraph-image" })`.

**Rationale:** The same layout as the algorithm pages, with the citations as the bridge to the algorithm content.

### Decision: Algorithm page and index changes

**Chosen:**

- `frontend/src/app/(site)/algoritmos/[id]/page.tsx`: pass the breadcrumb to `TrustPage`; in "Veja também", after the two related algorithm links, add one link "Ler o guia: <title>" to `guideHref(slug)` for each guide in `guidesFor(id)`, then the link "Todos os algoritmos"; replace the callout with `CreateNoteCallout`; add `JsonLd` with `articleJsonLd({ path: algorithmHref(id), headline: articleTitle(algorithm), description: article.description, publishedAt: article.publishedAt, image: algorithmHref(id) + "/opengraph-image" })` and the breadcrumb; return `pageMetadata({ title: articleTitle(algorithm), description: article.description, path: algorithmHref(id), type: "article", image: algorithmHref(id) + "/opengraph-image" })` from `generateMetadata`.
- `frontend/src/app/(site)/algoritmos/page.tsx`: after "Os algoritmos", add `TrustSection` "Guias e comparações" (`IconScale`) with one paragraph ("Quer comparar algoritmos ou saber o que fazer na prática? Os guias explicam qual algoritmo escolher e como proteger senhas e mensagens.") and the link "Ver todos os guias" to `/guias`; add the breadcrumb `JsonLd`; use `pageMetadata` with the current title and description and `path: "/algoritmos"`.
- `/sobre`, `/privacidade`, `/contato`: replace `metadata` with `pageMetadata` with the current title and description and their path.

### Decision: Main menu and sitemap

**Chosen:**

- `NAV_LINKS = [{ href: ALGORITHMS_PATH, label: "Algoritmos" }, { href: GUIDES_PATH, label: "Guias" }, ...TRUST_PAGES]`. `TRUST_PAGES` and the footer do not change.
- `SiteNav`: change the desktop list gap from `gap-5` to `gap-4 lg:gap-5`, and move the breakpoint of the inline links and the "Menu" button from `sm` (640px) to `md` (768px): `md:flex` on the list, `md:hidden` on the button and on the open menu. At 640px the logo and the five links need about 6.8px more than the 592px of the header (measured by the Tester on 2026-10-31), and the logo wraps to two lines. At 768px, they need about 630px of 720px.
- `sitemap()` returns, in order: the home, the three trust pages, `/algoritmos`, the 25 algorithm pages in `ALGORITHMS` order, `/guias`, and the eight guide pages in `GUIDES` order (39 entries).

**Rationale:** The menu is how the visitors found the algorithm pages; the guides follow the same path. The exact-match `aria-current` rule stays: "Guias" is marked on `/guias` only.

### Decision: Guide content

**Chosen:** pt-BR, in the voice of the algorithm articles: short sentences, no jargon without an explanation, and no marketing claims. Every guide states the facts below. The terms in `code` must appear verbatim, because the tests search for them. When a guide mentions the Nota Segura - BR, it states only the product facts of the Context section.

Comparisons (kind "Comparação"), with the five sections of `COMPARISON_SECTION_TITLES`:

1. **`aes-gcm-ou-chacha20-poly1305`** — "AES-256-GCM ou ChaCha20-Poly1305: qual escolher?". Cites `aes-gcm`, `chacha20-poly1305`, `aes-cbc`. Related: `criptografia-hash-ou-codificacao`, `rsa-ou-curvas-elipticas`. Table columns: "Critério", "AES-256-GCM", "ChaCha20-Poly1305"; rows: type, key size, nonce, authentication tag, speed with hardware acceleration, speed without it, where it is used. Facts: both are `AEAD` ciphers (they encrypt and detect changes) with 256-bit keys, a nonce of `12 bytes`, and a tag of `16 bytes`. AES is fast on processors with the `AES-NI` instructions (and the ARMv8 crypto instructions). ChaCha20 uses only additions, rotations, and XOR, so it is fast in software and runs in `tempo constante` without lookup tables; Google adopted it in Chrome on Android in 2014. Both are in `TLS 1.3`; ChaCha20-Poly1305 is the cipher of `WireGuard`. A nonce must never repeat with the same key; with random 12-byte nonces, NIST limits AES-GCM to 2^32 messages per key, and `XChaCha20`-Poly1305 uses a 24-byte nonce for random nonces. Recommendation: both are safe; choose AES-GCM where the hardware accelerates AES, and ChaCha20-Poly1305 on devices without it. The `Nota Segura - BR` uses AES-256-GCM.
2. **`sha-256-sha-1-ou-md5`** — "SHA-256, SHA-1 ou MD5: qual hash usar?". Cites `sha-256`, `sha-1`, `md5`, `sha-512`, `hmac-sha-256`. Related: `criptografia-hash-ou-codificacao`, `como-guardar-senhas`. Table columns: "Critério", "MD5", "SHA-1", "SHA-256"; rows: output size, hexadecimal characters, known practical collision, safe use today. Facts: MD5 has `128 bits` (32 hexadecimal characters), SHA-1 has `160 bits` (40), SHA-256 has `256 bits` (64). A `colisão` is two different inputs with the same hash. Xiaoyun Wang's team published MD5 collisions in 2004, and the `Flame` malware (2012) used an MD5 collision to forge a Microsoft certificate. `SHAttered` (Google and CWI Amsterdam, 2017) published two different PDF files with the same SHA-1. No practical attack on SHA-256 is known. MD5 and SHA-1 still detect accidental copy errors, but not tampering; `Git` is moving from SHA-1 to SHA-256. The hashes of "abc": `900150983cd24fb0d6963f7d28e17f72` (MD5), `a9993e364706816aba3e25717850c26c9cd0d89d` (SHA-1), `ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad` (SHA-256). For passwords, none of the three is enough: use `Argon2`, scrypt, bcrypt, or PBKDF2.
3. **`criptografia-hash-ou-codificacao`** — "Criptografia, hash ou codificação: qual é a diferença?". Cites `aes-gcm`, `sha-256`, `base64`, `hex`, `hmac-sha-256`. Related: `sha-256-sha-1-ou-md5`, `aes-gcm-ou-chacha20-poly1305`. Table columns: "Critério", "Criptografia", "Hash", "Codificação"; rows: uses a key, has a way back, output size, protects a secret, example. Facts: encryption has a way back with the right `chave` (example `AES-256-GCM`); a hash is a function of `mão única` with a fixed output size (example `SHA-256`); an encoding changes only the format and has no key: `Base64` turns "olá" into `b2zDoQ==`, and hexadecimal into `6f6cc3a1`. An `HMAC` is a hash with a secret key, which authenticates a message. Common mistakes: a password in Base64, "encrypting" with MD5, and storing passwords with reversible encryption.
4. **`rsa-ou-curvas-elipticas`** — "RSA ou curvas elípticas: qual escolher?". Cites `rsa-oaep`, `rsa-pss`, `ecdsa`, `ed25519`, `ecdh`. Related: `aes-gcm-ou-chacha20-poly1305`, `o-que-e-criptografia-de-ponta-a-ponta`. Table columns: "Critério", "RSA", "Curvas elípticas"; rows: mathematical base, key for about 128 bits of security, signature size, key generation speed, examples in the playground, resistance to quantum computers. Facts: RSA depends on the factoring of large numbers; elliptic curves depend on the discrete logarithm on a curve. NIST (SP 800-57) puts an RSA key of `2048 bits` at about 112 bits of security and `3072 bits` at about 128 bits; a `P-256` curve key gives about 128 bits. `Ed25519` has public keys of `32 bytes` and signatures of `64 bytes`; an RSA-2048 signature has 256 bytes. Key generation is much faster with curves. The `Shor` algorithm on a large quantum computer breaks both; in 2024, NIST published `ML-KEM` (`FIPS 203`) and ML-DSA (FIPS 204). Recommendation: Ed25519 or ECDSA P-256 for new signatures, ECDH for key exchange, and RSA where compatibility requires it.

Practical guides (kind "Guia prático"), with "Resumo" as the first section:

5. **`como-enviar-uma-senha-com-seguranca`** — "Como enviar uma senha com segurança". Cites `aes-gcm`, `pbkdf2`. Related: `o-que-e-uma-nota-autodestrutiva`, `o-que-e-criptografia-de-ponta-a-ponta`. Facts: e-mail and chat keep the text in the `histórico`, in backups, and in notifications. A better way is a link that expires: in the Nota Segura - BR, a note lasts from `1 a 30 dias` and `1 a 50` views and is encrypted with `AES-256-GCM`. Send the `frase secreta` through `outro canal`, for example a phone call. In a company, prefer the sharing function of a `gerenciador de senhas`. Ask the person to change the password after the first use, and never send the user name, the password, and the address in the same message. Include a numbered step list in `items`.
6. **`o-que-e-uma-nota-autodestrutiva`** — "O que é uma nota autodestrutiva e quando usar". Cites `aes-gcm`, `pbkdf2`. Related: `como-enviar-uma-senha-com-seguranca`, `o-que-e-criptografia-de-ponta-a-ponta`. Facts: a self-destructing note is a link that stops working after a time or a number of views; in the Nota Segura - BR, from `1 a 30 dias` and from `1 a 50` views, `sem conta`. The text is encrypted with `AES-256-GCM`; the `frase secreta` is part of the key, derived with `scrypt` (a key derivation function like PBKDF2), and it is never stored, so a forgotten passphrase cannot be recovered. Without a passphrase, the key comes from a passphrase kept on the server. The note is deleted from the database at its expiry date. Limits: anyone with the link (and the passphrase, if there is one) can read it, and the reader can copy the text or take a `captura de tela`.
7. **`o-que-e-criptografia-de-ponta-a-ponta`** — "O que é criptografia de ponta a ponta". Cites `ecdh`, `aes-gcm`, `ed25519`. Related: `como-enviar-uma-senha-com-seguranca`, `rsa-ou-curvas-elipticas`. Facts: in encryption `ponta a ponta`, only the devices at the ends have the keys, so the server cannot read the messages. Encryption in transit (`TLS`, the "s" of HTTPS) protects only the path to the server, and encryption at rest protects the stored data from someone who steals the disk. The `Signal` protocol uses key exchange with `ECDH`; WhatsApp completed its end-to-end encryption with it in `2016`. Users can compare a security code to detect a man-in-the-middle. End-to-end encryption does not hide the `metadados` (who talks to whom, and when), and backups may be outside it. The `Nota Segura - BR` is not end-to-end: the text reaches the server over HTTPS and is encrypted there, and the passphrase is sent to derive the key and is not stored.
8. **`como-guardar-senhas`** — "Como guardar senhas de usuários com segurança". Cites `pbkdf2`, `sha-256`, `md5`, `sha-1`. Related: `sha-256-sha-1-ou-md5`, `criptografia-hash-ou-codificacao`. Facts: never store passwords in plain text or with reversible encryption. Fast hashes such as MD5, `SHA-1`, and SHA-256 let an attacker with graphics cards test billions of guesses per second. A random `sal`, different for each user, defeats `tabelas arco-íris`. Use a slow function: `Argon2id` (winner of the Password Hashing Competition in 2015), `bcrypt` (1999), `scrypt`, or PBKDF2 with `600.000` iterations of HMAC-SHA-256, as OWASP recommends. In 2012, `LinkedIn` lost millions of password hashes made with SHA-1 without salt. Update the hash at the next login when the parameters change, and compare the results in constant time.

Order of `GUIDES`: 1, 2, 3, 4, 5, 6, 7, 8 as numbered above.

**Rationale:** The comparisons answer the most common choices between the algorithms of the playground. The practical guides answer everyday tasks and lead to the product, and they state its limits honestly.

## Architecture

```text
lib/brand.ts ───────────────┐
lib/share-image.tsx ────────┴─> app/opengraph-image.tsx, app/algoritmos/[id]/opengraph-image.tsx, app/guias/[slug]/opengraph-image.tsx (outside "(site)")
lib/seo.ts ─┬─> app/layout.tsx (siteMetadata)
            ├─> trust pages, /algoritmos, /guias (pageMetadata, breadcrumb JsonLd)
            └─> /algoritmos/<id>, /guias/<slug> (pageMetadata article, Article + BreadcrumbList JsonLd)
lib/guides/ (GUIDES, guidesFor) ─> app/(site)/guias/page.tsx, app/(site)/guias/[slug]/page.tsx (SSG x8)
                                └─> app/(site)/algoritmos/[id]/page.tsx ("Ler o guia: <title>")
components/TrustPage.tsx (breadcrumb) · components/JsonLd.tsx · components/CreateNoteCallout.tsx
lib/site.ts NAV_LINKS (+ "Guias") ─> SiteNav
app/sitemap.ts ─> 39 URLs
```

## Risks

- **Wrong facts in the guides fail the AdSense review and mislead readers.** Mitigation: the required-term tests, the Context facts checked in the backend, and a review of each guide by the Tester and the user before the merge.
- **The five menu links did not fit in one line at 640px.** Resolved on 2026-10-31: the inline menu starts at 768px; an E2E test checks one line and no horizontal scroll at 768px, and the "Menu" button at 640px.
- **Share images in a dynamic segment may not prerender.** Mitigation: each dynamic image file exports `generateStaticParams`. The E2E test checks status 200 and `image/png` for one image of each kind.
- **The default font of `ImageResponse` may not draw some pt-BR characters.** Mitigation: the browser check opens the images of one guide with "ç" and "ã" in the title. If a character is missing, add a font file in a new task.
- **Wide tables on a phone.** Mitigation: the `overflow-x-auto` container, and the E2E test for horizontal scroll at 375px on every guide.
- **JSON-LD with user content.** All values come from the repository, and `jsonLdHtml` escapes `<`, so a `</script>` in a text cannot close the tag.
- **`metadataBase` uses `NEXT_PUBLIC_SITE_URL`, which is inlined at build time.** A wrong value gives wrong canonical and Open Graph URLs. The E2E tests run with `https://notasegura.example`, and the Docker build already passes the variable as a build argument.
