# Tasks: frontend-crypto-playground

## Implementation (Frontend)

- [x] `frontend/src/lib/playground/types.ts`: the types from `design.md` (Decision: One module per algorithm with a shared interface).
- [x] `frontend/src/lib/playground/bytes.ts`: UTF-8 encode/decode and Base64 encode/decode of `Uint8Array`.
- [x] `frontend/src/lib/playground/validate.ts`: `validateInput(algorithmId, text, options)` returns `null` or a pt-BR error message, for the rules of the requirement "Input validation".
- [x] `frontend/src/lib/playground/base64.ts`, `cesar.ts`, `vigenere.ts`: pure algorithms (Decision: Algorithm parameters).
- [x] `frontend/src/lib/playground/sha-256.ts`, `aes-gcm.ts`, `aes-cbc.ts`, `rsa-oaep.ts`: Web Crypto algorithms (Decision: Algorithm parameters).
- [x] `frontend/src/lib/playground/index.ts`: `ALGORITHMS` in the button order, with names, types, safety labels, and the texts from `design.md` (Decision: Explanation texts).
- [x] `frontend/src/components/CryptoPlayground.tsx`: the client card (Decision: Component and layout), including the message when `crypto.subtle` is missing (Risks).
- [x] `frontend/src/app/(site)/page.tsx`: render `<section id="testar-algoritmos">` with `CryptoPlayground` after `#criar-nota` and before the ads `aside`.
- [x] `frontend/vitest.setup.ts`: only if the component tests fail because `crypto.subtle` is missing, set `globalThis.crypto` from `node:crypto` `webcrypto`. Do not change any assertion. (Not needed: `CryptoPlayground.test.tsx` passed with the default setup on 2026-10-30.)

## Tests (written by Frontend, executed by Tester)

### Unit: `frontend/src/lib/playground/bytes.test.ts`

- [x] `it('round-trips UTF-8 through Base64')` — `"Olá, mundo! 123"` encoded to Base64 and decoded back equals the input; Base64 of the UTF-8 bytes of `"olá"` is `"b2zDoQ=="`.

### Unit: `frontend/src/lib/playground/base64.test.ts`

- [x] `it('encodes UTF-8 text')` — `encrypt("olá")` output is `"b2zDoQ=="` and `details` is empty.
- [x] `it('decodes back to the text')` — `await result.decrypt!()` equals `"Olá, mundo! 123"` for that input.

### Unit: `frontend/src/lib/playground/cesar.test.ts`

- [x] `it('shifts letters and keeps other characters')` — shift 3, `"Abc, xyz!"` gives `"Def, abc!"`.
- [x] `it('keeps accented letters')` — shift 3, `"olá"` gives `"roá"`.
- [x] `it('decrypts back')` — shift 13, `decrypt()` of `"Olá, mundo! 123"` equals the input.
- [x] `it('shows the shift')` — `details` equals `[{ label: "Deslocamento", value: "3" }]` for shift 3.

### Unit: `frontend/src/lib/playground/vigenere.test.ts`

- [x] `it('matches the classic example')` — keyword `"LEMON"`, `"ATTACKATDAWN"` gives `"LXFOPVEFRNHR"`.
- [x] `it('keeps case and skips non-letters for the key index')` — keyword `"lemon"`, `"attack at dawn"` gives `"lxfopv ef rnhr"`.
- [x] `it('decrypts back')` — keyword `"chave"`, `decrypt()` of `"Olá, mundo! 123"` equals the input.

### Unit: `frontend/src/lib/playground/sha-256.test.ts` (`// @vitest-environment node`)

- [x] `it('hashes abc')` — output is `"ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"`.
- [x] `it('has no decrypt')` — `result.decrypt` is `undefined` and `details` is empty.

### Unit: `frontend/src/lib/playground/aes-gcm.test.ts` (`// @vitest-environment node`)

- [x] `it('round-trips')` — `decrypt()` of `"Olá, mundo! 123"` equals the input.
- [x] `it('shows a 256-bit key and a 12-byte IV')` — the detail "Chave" decodes to 32 bytes and "IV" to 12 bytes.
- [x] `it('uses a new key and IV each time')` — two `encrypt("segredo")` calls give different `output`, "Chave", and "IV".
- [x] `it('output includes the 16-byte tag')` — the decoded output of `"segredo"` (7 bytes) has 23 bytes.

### Unit: `frontend/src/lib/playground/aes-cbc.test.ts` (`// @vitest-environment node`)

- [x] `it('round-trips')` — `decrypt()` of `"Olá, mundo! 123"` equals the input.
- [x] `it('shows a 256-bit key and a 16-byte IV')` — "Chave" decodes to 32 bytes, "IV" to 16 bytes.
- [x] `it('pads to the block size')` — the decoded output of `"segredo"` has 16 bytes; of a 16-character ASCII text, 32 bytes.

### Unit: `frontend/src/lib/playground/rsa-oaep.test.ts` (`// @vitest-environment node`)

- [x] `it('round-trips')` — `decrypt()` of `"Olá, mundo! 123"` equals the input.
- [x] `it('shows only the public key')` — `details` has exactly one entry, labeled "Chave pública"; no detail label contains "privada".
- [x] `it('produces a 256-byte ciphertext')` — the decoded output has 256 bytes.

### Unit: `frontend/src/lib/playground/validate.test.ts`

- [x] `it('rejects empty text')` — `validateInput("aes-gcm", "", {})` is a non-null string.
- [x] `it('rejects text over 500 characters')` — 501 characters gives a message; 500 gives `null`.
- [x] `it('limits RSA to 190 bytes')` — `"a".repeat(190)` gives `null`; `"a".repeat(191)` gives a message that contains `"190 bytes"`; `"á".repeat(96)` (192 bytes) gives a message.
- [x] `it('validates the Vigenère keyword')` — `"chave"` gives `null`; `""` and `"chave1"` give a message.
- [x] `it('validates the César shift')` — 1 and 25 give `null`; 0, 26, and 2.5 give a message.

### Unit: `frontend/src/lib/playground/index.test.ts`

- [x] `it('lists the seven algorithms in order')` — `ALGORITHMS.map(a => a.name)` equals `["AES-256-GCM", "AES-256-CBC", "RSA-OAEP", "SHA-256", "Base64", "Cifra de César", "Cifra de Vigenère"]`.
- [x] `it('sets type and safety')` — `kind` and `safety` of each algorithm equal the values of the requirement "Algorithm explanation".
- [x] `it('explains each algorithm in at least two sentences')` — for each algorithm, `summary.join(" ")` has at least two sentences ending in `.`.
- [x] `it('names AES-256-GCM as the site algorithm')` — the AES-256-GCM summary contains `"Nota Segura - BR"`.

### Unit: `frontend/src/components/CryptoPlayground.test.tsx`

- [x] `it('renders seven buttons with AES-256-GCM pressed')` — `getByRole('group', { name: 'Algoritmos' })` has seven buttons in order; only "AES-256-GCM" has `aria-pressed="true"`.
- [x] `it('switches the explanation')` — click "Cifra de César"; it has `aria-pressed="true"`, the card shows "Cifra clássica" and "Inseguro", and the field "Deslocamento" exists; click "Base64"; the card shows "Codificação" and "Não é criptografia", and the field "Deslocamento" does not exist.
- [x] `it('shows the keyword field only for Vigenère')` — the field "Palavra-chave" exists only when "Cifra de Vigenère" is pressed.
- [x] `it('encrypts and decrypts with César')` — select "Cifra de César", type "Abc, xyz!", click "Encriptar"; the result is `"Def, abc!"`; click "Decifrar"; "Texto decifrado" shows `"Abc, xyz!"`.
- [x] `it('hides Decifrar for SHA-256')` — select "SHA-256", type "abc", click "Encriptar"; the result is the digest of "abc"; `queryByRole('button', { name: 'Decifrar' })` is `null`; the text "Um hash não pode ser desfeito" is shown.
- [x] `it('shows an error for empty text')` — click "Encriptar" with an empty text; an error message is shown and no "Resultado" is shown.
- [x] `it('clears the result when the algorithm changes')` — encrypt with Base64, then click "SHA-256"; no "Resultado" is shown and the text stays in the text box.
- [x] `it('announces the result')` — the result container has `aria-live="polite"`.
- [x] `it('does not call the API')` — `vi.mock("@/lib/api")`; after encrypting with Base64, `createNote` was not called.

### Unit: `frontend/src/app/(site)/page.test.tsx`

- [x] `it('places the playground after the create form')` — `document.getElementById("criar-nota")!.compareDocumentPosition(document.getElementById("testar-algoritmos")!) & Node.DOCUMENT_POSITION_FOLLOWING` is truthy; `#testar-algoritmos` contains the `h2` "Teste os algoritmos".
- [x] Keep the existing tests of `page.test.tsx` unchanged.

### E2E: `frontend/e2e/crypto-playground.spec.ts` (new; Playwright; block `https://pagead2.googlesyndication.com/**`)

- [x] `test('card is in the server HTML')` — `request.get('/')`; the HTML contains "Teste os algoritmos", the seven button names, and the AES-256-GCM summary text, and "AES-256-GCM" is rendered with `aria-pressed="true"`.
- [x] `test('round trip with every reversible algorithm')` — for each of AES-256-GCM, AES-256-CBC, RSA-OAEP, Base64, Cifra de César, Cifra de Vigenère (keyword "chave"): click the button, type "Olá, mundo! 123", click "Encriptar", expect a non-empty "Resultado" that differs from the text, click "Decifrar", expect "Texto decifrado" to show "Olá, mundo! 123".
- [x] `test('AES gives a new result each time')` — AES-256-GCM, text "segredo", "Encriptar" twice; the two results differ.
- [x] `test('SHA-256 has no decrypt')` — text "abc"; the result is the known digest and no button "Decifrar" is visible.
- [x] `test('RSA rejects long text')` — RSA-OAEP, 191 × "a"; an error that contains "190 bytes" is shown and no result.
- [x] `test('no request leaves the page')` — record `page.on('request')`; run the round trip test steps and SHA-256; no request URL contains `/api/`.
- [x] `test('fits on mobile')` — viewport 375 x 812; on `/` with a result shown for RSA-OAEP, `document.documentElement.scrollWidth <= window.innerWidth`.

### Regression

- [x] `frontend/e2e/how-it-works-cta.spec.ts`, `frontend/e2e/adsense-readiness.spec.ts`, `frontend/e2e/smoke.spec.ts`, and `frontend/e2e/comprehensive.spec.ts` pass without changes.

## Validation (Tester)

- [x] Stop any process on port 3005, then `cd frontend && npm run lint && npx tsc --noEmit && npm test && npm run build`.
- [x] `cd frontend && npx playwright test e2e/crypto-playground.spec.ts e2e/how-it-works-cta.spec.ts e2e/adsense-readiness.spec.ts` (and `e2e/smoke.spec.ts e2e/comprehensive.spec.ts` with backend and Mongo running).
- [x] Browser check (portal): on `/`, try each of the seven buttons at 1280px and 375px; check that the labels, the explanation, the result, and "Decifrar" look right.
