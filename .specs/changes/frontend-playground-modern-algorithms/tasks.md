# Tasks: frontend-playground-modern-algorithms

## Implementation (Frontend)

- [ ] `frontend/src/lib/playground/types.ts`: `AlgorithmId` (18), `AlgorithmKind`, and `EncryptResult.verify` (Decision: Types, categories, and order).
- [ ] `frontend/src/lib/playground/web-crypto.ts`: `AlgorithmUnsupportedError` (Decision: Errors).
- [ ] `frontend/src/lib/playground/md5.ts` and `chacha20-poly1305.ts`: pure TypeScript, with the exported functions of Decision: Algorithm parameters.
- [ ] `frontend/src/lib/playground/aes-ctr.ts`, `sha-512.ts`, `sha-1.ts`, `hmac-sha-256.ts`, `ecdsa.ts`, `ed25519.ts`, `rsa-pss.ts`, `ecdh.ts`, `pbkdf2.ts`: Web Crypto modules (Decision: Algorithm parameters), each mapping `NotSupportedError` to `AlgorithmUnsupportedError`.
- [ ] `frontend/src/lib/playground/categories.ts` and `actions.ts` (Decisions: Types, categories, and order; Action labels and the "Verificar" mode).
- [ ] `frontend/src/lib/playground/index.ts`: `ALGORITHMS` with 18 entries in the category order and the summaries of Decision: Summaries of the new algorithms.
- [ ] `frontend/src/lib/playground/validate.ts`: empty-text messages "Escreva um texto." and "Escreva uma senha." (PBKDF2).
- [ ] `frontend/src/components/CryptoPlayground.tsx`: category groups, labels from `actions.ts`, text box label "Texto"/"Senha", the "Verificar" box, the ECDH details, and the unsupported message.
- [ ] `frontend/src/lib/algorithms/articles/`: `chacha20-poly1305.ts`, `aes-ctr.ts`, `sha-512.ts`, `sha-1.ts`, `md5.ts`, `hmac-sha-256.ts`, `pbkdf2.ts`, `ecdsa.ts`, `ed25519.ts`, `rsa-pss.ts`, `ecdh.ts` (Decision: Article content); register them in `ARTICLES`.
- [ ] `frontend/src/app/(site)/algoritmos/page.tsx`: sections by category and the new introduction paragraph (Decision: Index page by category).

## Tests (written by Frontend, executed by Tester)

### Unit: new algorithm modules (`// @vitest-environment node`)

- [ ] `frontend/src/lib/playground/md5.test.ts` — `it('matches RFC 1321')`: `md5Hex` of `""`, `"abc"`, and `"message digest"` equals `d41d8cd98f00b204e9800998ecf8427e`, `900150983cd24fb0d6963f7d28e17f72`, and `f96b697d7cb7938d525a2f31aaf161d0`; `it('hashes UTF-8 and long input')`: `encrypt("olá")` output has 32 hex characters, and a 1000-byte input equals Node `createHash("md5")`; `it('has no way back')`: `decrypt` and `verify` are `undefined`.
- [ ] `frontend/src/lib/playground/chacha20-poly1305.test.ts` — `it('matches RFC 8439 section 2.8.2')`: key `808182…9f`, nonce `070000004041424344454647`, AAD `50515253c0c1c2c3c4c5c6c7`, and the "Ladies and Gentlemen…sunscreen would be it." plaintext give the ciphertext that starts with `d31a8d34648e60db7b86afbc53ef7ec2` (114 bytes, full value in the test) and the tag `1ae10b594f09e26a7e902ecbd0600691`; `it('opens what it seals')`; `it('rejects a changed byte')`: flipping one byte of the sealed data makes `chacha20Poly1305Open` throw; `it('round-trips through the playground')`: `decrypt()` of `"Olá, mundo! 123"` equals the input, "Chave" decodes to 32 bytes, "Nonce" to 12 bytes, and the output of `"segredo"` decodes to 23 bytes.
- [ ] `frontend/src/lib/playground/aes-ctr.test.ts` — `it('round-trips')`; `it('keeps the length')`: the output of `"segredo"` decodes to 7 bytes; `it('shows a 256-bit key and a 16-byte counter')`; `it('uses new values each time')`.
- [ ] `frontend/src/lib/playground/sha-512.test.ts` — `it('hashes abc')`: output is `ddaf35a1…a54ca49f` (full value); `it('has no way back')`.
- [ ] `frontend/src/lib/playground/sha-1.test.ts` — `it('hashes abc')`: output is `a9993e364706816aba3e25717850c26c9cd0d89d`; `it('has no way back')`.
- [ ] `frontend/src/lib/playground/hmac-sha-256.test.ts` — `it('matches RFC 4231 case 2')`: `hmacSha256Hex(utf8("Jefe"), utf8("what do ya want for nothing?"))` is `5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843`; `it('verifies the same text only')`: `verify("segredo")` is `true`, `verify("segredO")` is `false`; `it('shows a 256-bit key')`; `it('has no decrypt')`.
- [ ] `frontend/src/lib/playground/pbkdf2.test.ts` — `it('matches the known vector')`: `pbkdf2Sha256("password", utf8("salt"), 1, 32)` hex is `120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b`; `it('uses 600000 iterations and a 16-byte salt')`: the details "Iterações" is `"600000"` and "Sal" decodes to 16 bytes; `it('verifies the same password only')`; `it('uses a new salt each time')`: two runs with `"senha"` give different outputs.
- [ ] `frontend/src/lib/playground/ecdsa.test.ts`, `ed25519.test.ts`, `rsa-pss.test.ts` — `it('verifies the same text only')`; `it('has the expected signature size')`: 64, 64, and 256 bytes; `it('shows only the public key')`: one detail, "Chave pública", and no label contains "privada"; for Ed25519, the public key decodes to 32 bytes; `it('has no decrypt')`.
- [ ] `frontend/src/lib/playground/ed25519.test.ts` — `it('reports an unsupported browser')`: with `subtle.generateKey` stubbed to reject `new DOMException("x", "NotSupportedError")`, `encrypt` rejects with `AlgorithmUnsupportedError`.
- [ ] `frontend/src/lib/playground/ecdh.test.ts` — `it('computes the same secret on both sides')`: "Segredo calculado por Ana" equals "Segredo calculado por Beto" and decodes to 32 bytes; `it('round-trips')`; `it('shows both public keys')`: "Chave pública de Ana" and "Chave pública de Beto" differ and each decodes to 65 bytes.

### Unit: playground data and helpers

- [ ] `frontend/src/lib/playground/index.test.ts` — update `it('lists the seven algorithms in order')` to `it('lists the eighteen algorithms in order')` with the order of Decision: Types, categories, and order; update `it('sets type and safety')` to the 18 rows of the MODIFIED requirement "Algorithm explanation". Keep the other tests.
- [ ] `frontend/src/lib/playground/categories.test.ts` (new) — `it('groups by category in order')`: `algorithmsByCategory()` names equal `["Criptografia", "Hash", "Autenticação e assinatura", "Troca e derivação de chaves", "Codificação", "Cifras clássicas"]` and the names inside each group equal the table; `it('covers every algorithm once')`.
- [ ] `frontend/src/lib/playground/actions.test.ts` (new) — `it('labels each kind')`: one assertion per row of the labels table.
- [ ] `frontend/src/lib/playground/validate.test.ts` — `it('asks for a password for PBKDF2')`: `validateInput("pbkdf2", "", {})` is `"Escreva uma senha."`; `validateInput("sha-1", "", {})` is `"Escreva um texto."`. Keep the other tests.

### Unit: `frontend/src/components/CryptoPlayground.test.tsx`

- [ ] Update `NAMES` to the eighteen names in order, and `it('renders seven buttons with AES-256-GCM pressed')` to `it('renders eighteen buttons with AES-256-GCM pressed')`.
- [ ] Replace `getByLabelText("Texto para encriptar")` with `getByLabelText("Texto")` in `typeText`; in the tests that use SHA-256, click "Gerar hash" instead of "Encriptar"; in the tests that use Base64, click "Codificar". Keep every result assertion.
- [ ] `it('groups the buttons by category')` — the group "Algoritmos" contains six groups named after the categories, in order, each with its buttons.
- [ ] `it('labels the action by type')` — the button is "Assinar" for "ECDSA", "Gerar código" for "HMAC-SHA-256", "Derivar chave" for "PBKDF2", with the text box "Senha" for PBKDF2.
- [ ] `it('verifies a changed text as invalid')` — HMAC-SHA-256, text "segredo", "Gerar código"; "Texto para verificar" has "segredo"; "Verificar" shows "Válido: o texto confere com o resultado."; change it to "segredO"; "Verificar" shows "Inválido: o texto não confere com o resultado."; no button "Decifrar".
- [ ] `it('shows the same ECDH secret on both sides')` — ECDH, "segredo", "Encriptar"; the values of "Segredo calculado por Ana" and "Segredo calculado por Beto" are equal; "Decifrar" shows "segredo".
- [ ] `it('shows the unsupported message')` — `vi.mock("@/lib/playground/ed25519")` so that `encrypt` rejects with `AlgorithmUnsupportedError`; select "Ed25519", "Assinar"; the alert is "Seu navegador não permite este algoritmo."
- [ ] `it('decodes Base64')` — "Base64", "olá", "Codificar", "Decodificar"; "Texto decodificado" shows "olá".

### Unit: articles and pages

- [ ] `frontend/src/lib/algorithms/index.test.ts` — add the eleven ids to `REQUIRED_TERMS` with the `code` terms of Decision: Article content. The other tests already loop over `ALGORITHMS`.
- [ ] `frontend/src/app/(site)/algoritmos/page.test.tsx` — replace `it('lists the seven algorithms in order')` with `it('lists the algorithms by category')`: six `h3` with the category names in order; each list (named after its category) has the algorithms of the category, with `h4` names and the link "Ler sobre <name>" to `/algoritmos/<id>`. Update `item()` to find the `h4`. Keep `it('shows the safety labels')` and add "MD5" → "Inseguro". Update `it('renders the heading and the introduction')` to at least four `p`.
- [ ] `frontend/src/app/sitemap.test.ts` — update the expected URLs to the 23 entries (home, three trust pages, `/algoritmos`, eighteen algorithm pages in `ALGORITHMS` order).

### E2E: `frontend/e2e/modern-algorithms.spec.ts` (new; block `https://pagead2.googlesyndication.com/**`)

- [ ] `test('buttons are grouped in the server HTML')` — `request.get('/')`; the six category names and the eighteen button names appear in order.
- [ ] `test('hash results')` — SHA-512, SHA-1, and MD5 of "abc" with "Gerar hash" show the known digests; no "Decifrar", "Decodificar", or "Verificar".
- [ ] `test('round trip for the new ciphers')` — ChaCha20-Poly1305, AES-256-CTR, and ECDH with "Olá, mundo! 123": "Encriptar", then "Decifrar" shows the text.
- [ ] `test('verify accepts the text and rejects a change')` — for HMAC-SHA-256 ("Gerar código"), ECDSA, Ed25519, RSA-PSS ("Assinar"), and PBKDF2 ("Derivar chave"): text "segredo"; "Verificar" shows "Válido…"; change to "segredO"; "Verificar" shows "Inválido…".
- [ ] `test('ECDH secrets match')` — the two secret values are equal.
- [ ] `test('fits on mobile')` — viewport 375 x 812; `/` with the ECDH result shown, and `/algoritmos`; no horizontal scroll.

### E2E updates required by the MODIFIED requirements

- [ ] `frontend/e2e/crypto-playground.spec.ts` — `NAMES`: the eighteen names; the text box label "Texto"; SHA-256 uses "Gerar hash"; in `test('round trip with every reversible algorithm')`, Base64 uses "Codificar", "Decodificar", and "Texto decodificado". Keep every other assertion.
- [ ] `frontend/e2e/algorithm-pages.spec.ts` — `ALGORITHMS`: the eighteen `[id, name]` pairs in order; `test('playground works on an article')` clicks "Codificar". Keep every other assertion.
- [ ] `frontend/e2e/adsense-readiness.spec.ts` — `test('sitemap lists the public pages')`: the 23 URLs in order.

### Regression

- [ ] `frontend/e2e/header-nav.spec.ts`, `privacy-terms-unified.spec.ts`, `how-it-works-cta.spec.ts`, `brand-and-trust-visuals.spec.ts`, `smoke.spec.ts`, and `comprehensive.spec.ts` pass without changes.
- [ ] `frontend/src/app/(site)/algoritmos/[id]/page.test.tsx` and `frontend/src/app/(site)/page.test.tsx` pass without changes.

## Validation (Tester)

- [ ] Stop any process on port 3005, then `cd frontend && npm run lint && npx tsc --noEmit && npm test && npm run build`. The build lists 18 `/algoritmos/<id>` pages.
- [ ] `cd frontend && npx playwright test` (all specs; `smoke` and `comprehensive` with backend and Mongo running).
- [ ] Browser check (portal): on `/` at 1280px and 375px, try one algorithm of each category, the "Verificar" flow, and ECDH; open `/algoritmos` and three new articles. Read the eleven new articles for typos and wrong facts, and report them.
