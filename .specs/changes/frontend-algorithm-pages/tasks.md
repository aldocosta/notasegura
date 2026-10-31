# Tasks: frontend-algorithm-pages

## Implementation (Frontend)

- [x] `frontend/src/lib/site.ts`: add `ALGORITHMS_PATH = "/algoritmos"`; set `NAV_LINKS = [{ href: ALGORITHMS_PATH, label: "Algoritmos" }, ...TRUST_PAGES]`. Do not change `TRUST_PAGES` (Decision: Main menu and sitemap).
- [x] `frontend/src/lib/algorithms/types.ts`: `ARTICLE_SECTION_TITLES`, `ArticleSectionTitle`, `ArticleSection`, and `Article` (Decision: Article data).
- [x] `frontend/src/lib/algorithms/articles/aes-gcm.ts`, `aes-cbc.ts`, `rsa-oaep.ts`, `sha-256.ts`, `base64.ts`, `cesar.ts`, `vigenere.ts`: one `Article` each, in pt-BR, with the facts, the required terms, and the related ids of Decision: Article content.
- [x] `frontend/src/lib/algorithms/index.ts`: `ARTICLES`, `findAlgorithm`, `algorithmHref`, `articleTitle`, and `articleWordCount` (Decision: Article data).
- [x] `frontend/src/components/SafetyBadge.tsx`: move the badge and `SAFETY_CLASS` out of `CryptoPlayground.tsx` (Decision: Safety badge component).
- [x] `frontend/src/components/CryptoPlayground.tsx`: use `SafetyBadge`; add the prop `initialAlgorithm`; add the links "Saiba mais sobre <name>" and "Ver todos os algoritmos"; hide the first link when `usePathname()` equals its href (Decision: Playground changes).
- [x] `frontend/src/lib/playground/index.ts`: replace the RSA-OAEP `summary` with the text of Decision: Playground changes.
- [x] `frontend/src/app/(site)/algoritmos/page.tsx`: the index page and its `metadata` (Decision: Index page).
- [x] `frontend/src/app/(site)/algoritmos/[id]/page.tsx`: `dynamicParams = false`, `generateStaticParams`, `generateMetadata`, `notFound()` for an unknown id, and the layout of Decision: Article page layout.
- [x] `frontend/src/app/sitemap.ts`: the twelve entries in the order of Decision: Main menu and sitemap.

## Tests (written by Frontend, executed by Tester)

### Unit: `frontend/src/lib/algorithms/index.test.ts` (new)

- [x] `it('has one article per algorithm')` — the sorted keys of `ARTICLES` equal the sorted `ALGORITHMS` ids, and `ARTICLES[id].id === id` for each id.
- [x] `it('uses the six sections in order')` — for each article, `sections.map(s => s.title)` equals `[...ARTICLE_SECTION_TITLES]`, and each section has at least one paragraph.
- [x] `it('has 450 to 1100 words')` — for each article, `articleWordCount(article)` is `>= 450` and `<= 1100`.
- [x] `it('has a meta description of 70 to 160 characters')` — for each article, `description.length` is from 70 to 160.
- [x] `it('links two other algorithms')` — for each article, `related` has two different valid ids, and none equals `article.id`.
- [x] `it.each` `('states the required facts of %s')` — the joined text (lead, highlights, paragraphs, and items) contains every term below:
  - `aes-gcm`: `"FIPS 197"`, `"128 bits"`, `"tag"`, `"IV"`, `"TLS 1.3"`, `"scrypt"`, `"Nota Segura - BR"`.
  - `aes-cbc`: `"IV"`, `"PKCS#7"`, `"padding oracle"`, `"HMAC"`, `"TLS 1.3"`, `"GCM"`.
  - `rsa-oaep`: `"1977"`, `"chave pública"`, `"chave privada"`, `"190 bytes"`, `"AES"`, `"PSS"`, `"Shor"`.
  - `sha-256`: `"FIPS 180-4"`, `"64"`, `"ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"`, `"HMAC"`, `"Argon2"`, `"Bitcoin"`.
  - `base64`: `"RFC 4648"`, `"33%"`, `"b2zDoQ=="`, `"MIME"`, `"JWT"`, `"Base64url"`.
  - `cesar`: `"Júlio César"`, `"Suetônio"`, `"25"`, `"Def, abc!"`, `"ROT13"`, `"Al-Kindi"`.
  - `vigenere`: `"Bellaso"`, `"1553"`, `"LXFOPVEFRNHR"`, `"Kasiski"`, `"índice de coincidência"`, `"one-time pad"`.
- [x] `it('builds the title and the href')` — `articleTitle(ALGORITHMS[0])` is `"AES-256-GCM: o que é e como funciona"`; `algorithmHref("cesar")` is `"/algoritmos/cesar"`.
- [x] `it('finds only known algorithms')` — `findAlgorithm("cesar")?.name` is `"Cifra de César"`; `findAlgorithm("rot13")` is `undefined`.
- [x] `it('counts words')` — an article with lead `"um dois"`, highlights `"três"`, `"quatro"`, `"cinco"`, and one paragraph `"seis  sete"` gives 7.

### Unit: `frontend/src/lib/playground/index.test.ts`

- [x] `it('says that RSA signatures use PSS')` — the RSA-OAEP `summary.join(" ")` contains `"PSS"` and does not contain `"É usada para trocar chaves e assinar dados"`.
- [x] Keep the existing tests unchanged; they still pass with the new RSA text (three sentences).

### Unit: `frontend/src/lib/site.test.ts`

- [x] Update `it('lists the main menu links')` (required by the MODIFIED requirement "Main menu in the header"): `NAV_LINKS` equals `[["Algoritmos", "/algoritmos"], ["Sobre", "/sobre"], ["Privacidade e Termos", "/privacidade"], ["Contato", "/contato"]]`.
- [x] Keep `it('lists the three trust pages')` unchanged.

### Unit: `frontend/src/app/sitemap.test.ts`

- [x] Replace `it('lists exactly the home and the trust pages')` with `it('lists the home, the trust pages, and the algorithm pages')` (required by the MODIFIED requirement "Sitemap"): the URLs equal, in order, `https://notasegura.example`, `/sobre`, `/privacidade`, `/contato`, `/algoritmos`, `/algoritmos/aes-gcm`, `/algoritmos/aes-cbc`, `/algoritmos/rsa-oaep`, `/algoritmos/sha-256`, `/algoritmos/base64`, `/algoritmos/cesar`, `/algoritmos/vigenere` on `https://notasegura.example`; no URL contains `/termos`.
- [x] Keep `it('lists no note URL')` unchanged.

### Unit: `frontend/src/components/SiteNav.test.tsx`

- [x] Replace `it('renders the three links in order')` with `it('renders the four links in order')`: four links; text and `href` equal `NAV_LINKS`.
- [x] `it('marks Algoritmos on the index')` — pathname `"/algoritmos"`; the link "Algoritmos" has `aria-current="page"`; "Sobre", "Privacidade e Termos", and "Contato" do not.
- [x] `it('marks nothing on an article page')` — pathname `"/algoritmos/cesar"`; no link in "Principal" has `aria-current`.
- [x] Keep the other tests unchanged.

### Unit: `frontend/src/components/SafetyBadge.test.tsx` (new)

- [x] `it('shows the label')` — for each of `"Seguro"`, `"Não é criptografia"`, and `"Inseguro"`, the rendered text equals the label.
- [x] `it('marks unsafe in the error color')` — `"Inseguro"` has the class `text-error`; `"Seguro"` does not.

### Unit: `frontend/src/components/CryptoPlayground.test.tsx`

- [x] Add `vi.mock("next/navigation", () => ({ usePathname: vi.fn(() => "/") }))`. Do not change any existing assertion.
- [x] `it('links to the page of the selected algorithm')` — the link "Saiba mais sobre AES-256-GCM" has `href="/algoritmos/aes-gcm"`; after a click on "Cifra de César", the link "Saiba mais sobre Cifra de César" has `href="/algoritmos/cesar"`.
- [x] `it('links to all algorithms')` — the link "Ver todos os algoritmos" has `href="/algoritmos"`.
- [x] `it('starts with the given algorithm')` — `render(<CryptoPlayground initialAlgorithm="vigenere" />)`; "Cifra de Vigenère" has `aria-pressed="true"`; the field "Palavra-chave" exists.
- [x] `it('does not link to the current page')` — pathname `"/algoritmos/cesar"` and `initialAlgorithm="cesar"`; no link "Saiba mais sobre Cifra de César"; after a click on "Base64", the link "Saiba mais sobre Base64" has `href="/algoritmos/base64"`.
- [x] `it('shows PSS for RSA-OAEP')` — after a click on "RSA-OAEP", the card contains `"PSS"`.

### Unit: `frontend/src/app/(site)/algoritmos/page.test.tsx` (new)

- [x] `it('renders the heading and the introduction')` — one `h1` "Algoritmos de criptografia"; the section "Criptografia, hash e codificação" has at least three `p`; `metadata.title` is `"Algoritmos de criptografia"`.
- [x] `it('lists the seven algorithms in order')` — `getByRole('list', { name: 'Lista de algoritmos' })` has seven items; their `h3` texts equal the `ALGORITHMS` names in order; each item has the link "Ler sobre <name>" to `/algoritmos/<id>`.
- [x] `it('shows the safety labels')` — the item "Cifra de César" contains "Inseguro"; "Base64" contains "Não é criptografia"; "AES-256-GCM" contains "Seguro".

### Unit: `frontend/src/app/(site)/algoritmos/[id]/page.test.tsx` (new)

- [x] Mock `next/navigation` with `usePathname: vi.fn(() => "/algoritmos/cesar")` and `notFound: vi.fn(() => { throw new Error("NEXT_NOT_FOUND"); })`.
- [x] `it('generates the seven ids')` — `generateStaticParams()` equals `ALGORITHMS.map(a => ({ id: a.id }))`; `dynamicParams` is `false`.
- [x] `it('renders the article')` — `render(await AlgorithmPage({ params: Promise.resolve({ id: "cesar" }) }))`; the `h1` is "Cifra de César: o que é e como funciona"; the `h2` texts include the six section titles in order; the "Destaques" list contains "Cifra clássica", "Inseguro", and "Chave".
- [x] `it('preselects the algorithm in the playground')` — in the same render, the button "Cifra de César" has `aria-pressed="true"`, and no link "Saiba mais sobre Cifra de César" exists.
- [x] `it('links related pages and the product')` — the link "Ler sobre Cifra de Vigenère" has `href="/algoritmos/vigenere"`; "Ler sobre Base64" has `href="/algoritmos/base64"`; "Todos os algoritmos" has `href="/algoritmos"`; "Criar uma nota" has `href="/#criar-nota"`; no link in "Veja também" has `href="/algoritmos/cesar"`.
- [x] `it('builds the metadata')` — `await generateMetadata({ params: Promise.resolve({ id: "aes-gcm" }) })` has `title` `"AES-256-GCM: o que é e como funciona"` and `description` equal to `ARTICLES["aes-gcm"].description`.
- [x] `it('calls notFound for an unknown id')` — `AlgorithmPage({ params: Promise.resolve({ id: "rot13" }) })` rejects with `"NEXT_NOT_FOUND"`, and `notFound` was called once.

### E2E: `frontend/e2e/algorithm-pages.spec.ts` (new; Playwright; block `https://pagead2.googlesyndication.com/**`)

- [x] `test('index serves content without JavaScript')` — `request.get('/algoritmos')` is 200; the HTML has one `<h1`, at least four `<p`, and `href="/algoritmos/<id>"` for the seven ids in `ALGORITHMS` order (by index of first match).
- [x] `test('each article serves its text without JavaScript')` — for each id: status 200; one `<h1`; `<title>` is `"<name>: o que é e como funciona | Nota Segura - BR"`; the six section titles appear in order; at least eight `<p`; a `<meta name="description"` exists.
- [x] `test('César article shows the example')` — the HTML of `/algoritmos/cesar` contains `"Def, abc!"`.
- [x] `test('unknown algorithm returns 404')` — `request.get('/algoritmos/rot13')` is 404.
- [x] `test('algorithm pages carry the AdSense code')` — for `/algoritmos` and `/algoritmos/aes-gcm`, the HTML matches the `adsbygoogle.js?client=ca-pub-1234567890123456` script and contains `name="google-adsense-account" content="ca-pub-1234567890123456"`.
- [x] `test('playground opens the article of the selected algorithm')` — on `/`, click "Cifra de César", then "Saiba mais sobre Cifra de César"; the URL ends with `/algoritmos/cesar`; the `h1` is visible; "Cifra de César" has `aria-pressed="true"`.
- [x] `test('playground works on an article')` — on `/algoritmos/base64`, type "olá", click "Encriptar"; "Resultado" shows `b2zDoQ==`.
- [x] `test('menu opens the index')` — viewport 1280 x 800; on `/`, click "Algoritmos" in "Principal"; the URL ends with `/algoritmos`; the link has `aria-current="page"`.
- [x] `test('mobile menu opens the index')` — viewport 375 x 812; on `/`, click "Menu", then "Algoritmos"; the URL ends with `/algoritmos`; "Menu" has `aria-expanded="false"`.
- [x] `test('related links navigate')` — on `/algoritmos/cesar`, click "Ler sobre Cifra de Vigenère"; the URL ends with `/algoritmos/vigenere`.
- [x] `test('pages fit on mobile')` — viewport 375 x 812; for `/algoritmos` and the seven articles, `document.documentElement.scrollWidth <= window.innerWidth`.

### E2E updates required by the MODIFIED requirements

- [x] `frontend/e2e/header-nav.spec.ts`: add `["Algoritmos", "/algoritmos"]` as the first entry of `NAV_LINKS`. Keep every test and assertion.
- [x] `frontend/e2e/privacy-terms-unified.spec.ts`: replace `test('menu and footer show three trust links')` with `test('menu shows Algoritmos and the trust links; footer shows the trust links')` — "Principal" has four links in order (`["Algoritmos", "/algoritmos"]` then `TRUST_LINKS`), and "Rodapé" has exactly `TRUST_LINKS`, each visible with its text and `href`. In `test('header fits at 640px')`, also check that "Algoritmos" is visible.
- [x] `frontend/e2e/adsense-readiness.spec.ts`: replace `test('sitemap lists the four public pages')` with `test('sitemap lists the public pages')` — the `loc` values equal the twelve URLs of the sitemap unit test, in order; no `loc` contains `/termos`.

### Regression

- [x] `frontend/e2e/crypto-playground.spec.ts`, `frontend/e2e/how-it-works-cta.spec.ts`, `frontend/e2e/brand-and-trust-visuals.spec.ts`, `frontend/e2e/smoke.spec.ts`, and `frontend/e2e/comprehensive.spec.ts` pass without changes.
- [x] `frontend/src/app/(site)/page.test.tsx` and `frontend/src/app/(site)/trust-pages.test.tsx` pass without changes.

## Validation (Tester)

- [x] Stop any process on port 3005, then `cd frontend && npm run lint && npx tsc --noEmit && npm test && npm run build`. The build output lists `/algoritmos` and the seven `/algoritmos/<id>` as prerendered.
- [x] `cd frontend && npx playwright test e2e/algorithm-pages.spec.ts e2e/header-nav.spec.ts e2e/privacy-terms-unified.spec.ts e2e/adsense-readiness.spec.ts e2e/crypto-playground.spec.ts e2e/how-it-works-cta.spec.ts e2e/brand-and-trust-visuals.spec.ts` (and `e2e/smoke.spec.ts e2e/comprehensive.spec.ts` with backend and Mongo running).
- [x] Browser check (portal): open `/algoritmos` and each article at 1280px and 375px; check the hero, the tiles, the section icons, the playground preselection, and the links. Read each article for typos and wrong facts, and report them.
