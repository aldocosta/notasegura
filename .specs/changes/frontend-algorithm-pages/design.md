# Design: frontend-algorithm-pages

## Context

`frontend/src/lib/playground/index.ts` exports `ALGORITHMS` (seven entries with `id`, `name`, `kind`, `safety`, and a one-paragraph `summary`).
`frontend/src/components/CryptoPlayground.tsx` is a client component. It always starts with AES-256-GCM selected, so the server HTML of `/` contains only that explanation.
`frontend/src/components/TrustPage.tsx` provides `TrustPage` (hero, highlight tiles, content) and `TrustSection` (`h2` or `h3` with an icon). `/sobre`, `/privacidade`, and `/contato` use them.
`frontend/src/app/(site)/layout.tsx` loads the AdSense code for every page in the `(site)` group.
`frontend/src/lib/site.ts` exports `TRUST_PAGES` (footer) and `NAV_LINKS` (main menu, now equal to `TRUST_PAGES`). `frontend/src/app/sitemap.ts` lists `/` and `TRUST_PAGES`.
The project uses Next.js 16.4 with `cacheComponents: false`. `params` is a `Promise`, and `dynamicParams = false` makes paths outside `generateStaticParams` return 404 (`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md`).
The backend encrypts each note with AES-256-GCM, a random 12-byte IV, a random 16-byte salt, and a 256-bit key derived with scrypt from the passphrase, or from a server-side default passphrase when the user sets none (`backend/src/modules/notes/infrastructure/crypto/aes-gcm-crypto.adapter.ts`).

## Decisions

### Decision: Routes and rendering

**Chosen:**

- `frontend/src/app/(site)/algoritmos/page.tsx`: the index, a server component.
- `frontend/src/app/(site)/algoritmos/[id]/page.tsx`: the article, a server component with `export const dynamicParams = false`, `generateStaticParams()` that returns `ALGORITHMS.map((a) => ({ id: a.id }))` in order, `generateMetadata`, and `notFound()` when `id` is not an `AlgorithmId`.
- The URL segment is the `AlgorithmId`.

**Rationale:** Static prerendering puts the full text in the server HTML, which AdSense and search crawlers read. The `(site)` group gives the pages the header, the footer, and the AdSense code with no new layout.

**Alternatives considered:**

- MDX files: needs a new dependency and a build configuration for seven pages.
- Portuguese slugs (for example `/algoritmos/cifra-de-cesar`): needs a second map from slug to id, with no clear gain.

### Decision: Article data

**Chosen:** `frontend/src/lib/algorithms/`:

```ts
// types.ts
export const ARTICLE_SECTION_TITLES = [
  "O que é",
  "Como funciona",
  "Exemplo",
  "Onde é usado",
  "Pontos fortes e fracos",
  "Quando usar",
] as const;
export type ArticleSectionTitle = (typeof ARTICLE_SECTION_TITLES)[number];
export type ArticleSection = { title: ArticleSectionTitle; paragraphs: string[]; items?: string[] };
export type Article = {
  id: AlgorithmId;
  description: string; // meta description, 70 to 160 characters
  lead: string; // one sentence under the h1
  highlights: { kind: string; safety: string; key: string }; // one sentence each
  sections: ArticleSection[]; // the six titles, in order
  related: [AlgorithmId, AlgorithmId];
};
```

- `articles/aes-gcm.ts`, `aes-cbc.ts`, `rsa-oaep.ts`, `sha-256.ts`, `base64.ts`, `cesar.ts`, `vigenere.ts`: one `Article` each.
- `index.ts`: `ARTICLES: Record<AlgorithmId, Article>`, `findAlgorithm(id: string): Algorithm | undefined`, `algorithmHref(id) => "/algoritmos/" + id`, `articleTitle(algorithm) => algorithm.name + ": o que é e como funciona"`, and `articleWordCount(article)`. The word count includes the lead, the three highlight sentences, and every paragraph and list item. A word is a run of characters between spaces.
- `ALGORITHMS_PATH = "/algoritmos"` in `frontend/src/lib/site.ts`.

**Rationale:** Plain data can be tested for structure, length, and required facts. The `Record<AlgorithmId, Article>` type makes TypeScript fail when an algorithm has no article.

**Alternatives considered:**

- Longer `summary` arrays in `ALGORITHMS`: mixes the short card text with the long article, and the card would grow too tall.

### Decision: Article page layout

**Chosen:** From top to bottom:

1. `TrustPage` with `title = articleTitle(algorithm)`, `lead = article.lead`, `icon = IconLock`, and three highlight tiles: `{ IconFileText, algorithm.kind, highlights.kind }`, `{ IconShield, algorithm.safety, highlights.safety }`, and `{ IconKey, "Chave", highlights.key }`.
2. The six sections, each one a `TrustSection` (`h2`) with this icon: "O que é" `IconFileText`, "Como funciona" `IconKey`, "Exemplo" `IconLock`, "Onde é usado" `IconGlobe`, "Pontos fortes e fracos" `IconScale`, "Quando usar" `IconAlert`. Paragraphs are `p`. `items`, when present, are a `ul` after the paragraphs.
3. `<section id="testar-algoritmos">` with `<CryptoPlayground initialAlgorithm={id} />`.
4. `TrustSection` "Veja também" (`IconGlobe`) with the links "Ler sobre <name>" for the two `related` ids, and the link "Todos os algoritmos" to `/algoritmos`.
5. `TrustSection` "Precisa enviar um segredo?" (`IconShield`, `tone="mint"`): "Use uma nota segura: o texto é criptografado com AES-256-GCM e se apaga sozinho." and the link "Criar uma nota" to `/#criar-nota`.

Metadata: `title = articleTitle(algorithm)` (the root template adds " | Nota Segura - BR"), `description = article.description`.

**Rationale:** The trust pages already have this look. The playground lets the visitor try what the page explains. The final link leads readers to the product.

### Decision: Index page

**Chosen:** `TrustPage` with the title "Algoritmos de criptografia", the lead "Entenda como funcionam os algoritmos que você pode testar no Nota Segura - BR, e quais deles protegem um segredo de verdade.", the icon `IconLock`, and three highlight tiles:

- `IconLock` "Criptografia": "Protege o texto com uma chave. Só quem tem a chave certa consegue ler."
- `IconFileText` "Hash": "Gera uma impressão digital do texto. Não existe caminho de volta."
- `IconGlobe` "Codificação": "Só muda o formato do texto. Qualquer pessoa consegue desfazer."

Then a `TrustSection` "Criptografia, hash e codificação" (`IconFileText`) with three to four paragraphs (200 to 400 words). They explain the three categories, symmetric and asymmetric encryption, why classic ciphers are unsafe today, and that the Nota Segura - BR protects the notes with AES-256-GCM.
Then a `TrustSection` "Os algoritmos" (`IconKey`) with `<ul aria-label="Lista de algoritmos">` and one `li` for each algorithm in `ALGORITHMS` order. Each `li` contains an `h3` with the name, the kind, a `SafetyBadge`, the `summary`, and the link "Ler sobre <name>" to `algorithmHref(id)`.
Metadata: the title "Algoritmos de criptografia", and the description "Como funcionam AES, RSA, SHA-256, Base64 e as cifras de César e Vigenère, e quais deles protegem um segredo de verdade."

### Decision: Safety badge component

**Chosen:** Move `SAFETY_CLASS` and the badge `span` from `CryptoPlayground.tsx` to `frontend/src/components/SafetyBadge.tsx` (`<SafetyBadge safety={...} />`). Use it in the playground and in the index page.

**Rationale:** The index page needs the same badge. One place keeps the colors equal.

### Decision: Playground changes

**Chosen:** In `CryptoPlayground.tsx`:

- A new optional prop `initialAlgorithm?: AlgorithmId`, default `ALGORITHMS[0].id`. It sets the first state of the selection.
- Below the `summary` paragraphs in the explanation box: a `Link` "Saiba mais sobre <name>" to `algorithmHref(algorithm.id)`, and a `Link` "Ver todos os algoritmos" to `/algoritmos`.
- The component reads `usePathname()`. It does not render "Saiba mais sobre <name>" when the pathname equals `algorithmHref(algorithm.id)`, so an article page does not link to itself.
- The RSA-OAEP `summary` in `frontend/src/lib/playground/index.ts` becomes: "Criptografia assimétrica: a chave pública cifra e só a chave privada decifra. É usada para proteger chaves curtas, como uma chave AES, e só cifra textos curtos. Para assinar dados, o RSA usa outro preenchimento, o PSS."

**Rationale:** The link from the playground is where a curious visitor goes next. The old RSA text said that OAEP signs data, which is not correct.

### Decision: Main menu and sitemap

**Chosen:**

- `NAV_LINKS = [{ href: "/algoritmos", label: "Algoritmos" }, ...TRUST_PAGES]`. `TRUST_PAGES` and the footer do not change.
- `aria-current="page"` stays an exact match. On `/algoritmos` the link "Algoritmos" carries it. On `/algoritmos/<id>` no menu link carries it.
- `sitemap()` returns, in order: the home, the three trust pages, `/algoritmos`, and the seven `/algoritmos/<id>` in `ALGORITHMS` order (12 entries).

**Rationale:** Decided with the user: the menu link, no footer change. The exact match keeps the current `SiteNav` logic.

### Decision: Article content

**Chosen:** pt-BR, in the voice of the existing pages: short sentences, no jargon without an explanation, and no marketing claims. Each article has 450 to 1100 words, its description has 70 to 160 characters, and it SHALL state the facts below. The terms in `code` must appear verbatim, because the tests search for them.

- **AES-256-GCM** (related: `aes-cbc`, `rsa-oaep`): AES is the Rijndael algorithm by Joan Daemen and Vincent Rijmen, chosen by NIST in a public contest and published as `FIPS 197` in 2001. It works on blocks of `128 bits`, with keys of 128, 192, or 256 bits. GCM combines counter mode with an authentication `tag` of 16 bytes, so an altered text or a wrong key fails instead of giving a wrong text. The `IV` has 12 bytes and must never repeat with the same key. Example: "segredo" (7 bytes) gives 7 bytes of ciphertext plus 16 bytes of tag (23 bytes), with a key of 44 Base64 characters and an IV of 16. Used in HTTPS with `TLS 1.3`, in SSH, and in IPsec VPNs. The `Nota Segura - BR` uses it for every note, with a new IV, a new salt, and a key derived with `scrypt`.
- **AES-256-CBC** (related: `aes-gcm`, `sha-256`): CBC mixes each block with the previous encrypted block. The first block uses an `IV` of 16 random bytes. The text is padded with `PKCS#7` to a multiple of 16 bytes (7 bytes give 16; 16 bytes give 32). CBC does not detect changes: attacks such as `padding oracle` (Vaudenay, 2002) exploit this. It needs a separate check with `HMAC` (encrypt-then-MAC), or the use of `GCM`. `TLS 1.3` removed the CBC cipher suites, but older systems and file formats still use it.
- **RSA-OAEP** (related: `aes-gcm`, `sha-256`): RSA was published in `1977` by Rivest, Shamir, and Adleman. It uses a `chave pública` to encrypt and a `chave privada` to decrypt, and its security depends on how hard it is to factor a product of two large primes. OAEP (Bellare and Rogaway, 1994) adds random padding, so the same text gives a different result each time. With a 2048-bit key and SHA-256, the ciphertext has 256 bytes and the text can have at most `190 bytes`. In practice, RSA encrypts a random `AES` key, and AES encrypts the data (hybrid encryption). Signatures use another padding, `PSS`. A large quantum computer running the `Shor` algorithm would break RSA; NIST published post-quantum standards in 2024.
- **SHA-256** (related: `base64`, `aes-gcm`): a hash function of the SHA-2 family, specified today in `FIPS 180-4`. Any input gives 256 bits, shown as `64` hexadecimal characters. A small change in the input changes the whole output. Example: "abc" gives `ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad`. Used to check downloaded files, in digital signatures, in `HMAC`, and in `Bitcoin`. It has no key and cannot be reversed. Passwords must not be stored with plain SHA-256, because it is fast to test guesses; use `Argon2`, scrypt, or bcrypt with a salt.
- **Base64** (related: `sha-256`, `aes-gcm`): defined in `RFC 4648`. It uses 64 characters (A–Z, a–z, 0–9, `+`, `/`) and `=` as padding. Every 3 bytes become 4 characters, so the text grows by about `33%`. Example: "olá" gives `b2zDoQ==`. Used in e-mail attachments (`MIME`), data URLs, the `JWT` (in the `Base64url` variant), and the HTTP Basic header. Anyone can decode it, so it does not protect a secret.
- **Cifra de César** (related: `vigenere`, `base64`): `Suetônio` reports that `Júlio César` shifted the letters by 3. There are only `25` useful shifts, so testing all of them breaks the cipher at once. Frequency analysis, described by `Al-Kindi` in the 9th century, also breaks it. Example: shift 3, "Abc, xyz!" gives `Def, abc!`. `ROT13` (shift 13) is a variant that hides spoilers in forums. Use it only to learn or to play.
- **Cifra de Vigenère** (related: `cesar`, `aes-gcm`): described by Giovan Battista `Bellaso` in `1553`, and later attributed to Blaise de Vigenère. Each letter of the key gives a different shift, so the same letter can be encrypted in different ways. Example: the key "LEMON" and the text "ATTACKATDAWN" give `LXFOPVEFRNHR`. Charles Babbage and Friedrich `Kasiski` (1863) found the key length from repeated sequences; then each column is a Caesar cipher. The `índice de coincidência` (Friedman) also finds the key length. With a random key as long as the text and used only once, the method becomes the `one-time pad`, which cannot be broken but is not practical.

**Rationale:** The facts are the core value of the pages and must be correct. Required terms make the review of each article testable.

## Architecture

```text
lib/playground/index.ts (ALGORITHMS)  ──┐
lib/algorithms/articles/*.ts (ARTICLES) ─┼─> app/(site)/algoritmos/page.tsx          (index, server)
lib/algorithms/index.ts (helpers)  ──────┘   app/(site)/algoritmos/[id]/page.tsx     (article, server, SSG x7)
                                               ├── TrustPage / TrustSection
                                               ├── CryptoPlayground initialAlgorithm (client)
                                               └── SafetyBadge
lib/site.ts NAV_LINKS ─> SiteNav (menu "Algoritmos")
app/sitemap.ts ─> 12 URLs
```

## Risks

- **Thin or wrong text still fails the AdSense review.** Mitigation: the word count and required-fact tests, and a review of each article by the user before the merge.
- **`usePathname` in the playground tests.** The component now calls `usePathname`. Mitigation: `CryptoPlayground.test.tsx` mocks `next/navigation`, as `SiteNav.test.tsx` does. The existing assertions do not change.
- **Rendering an async server page in Vitest.** Mitigation: the page tests call `render(await AlgorithmPage({ params: Promise.resolve({ id }) }))`, and mock `notFound` from `next/navigation` to throw.
- **The 404 for an unknown id may render inside the `(site)` layout and load the AdSense code.** This change asserts only the 404 status. It does not assert anything about AdSense on that response.
- **Link prefetch in the playground E2E.** The new links can prefetch `/algoritmos/...`. The test "no request leaves the page" checks only `/api/`, so it still passes.
