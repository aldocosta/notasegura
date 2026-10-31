# Tasks: frontend-playground-classic-algorithms

## Implementation (Frontend)

- [x] `frontend/src/lib/playground/types.ts`: add `hex`, `rot13`, `atbash`, `playfair`, `rail-fence`, `enigma`, `vernam` to `AlgorithmId`; add `rails?: number` and `start?: string` to `EncryptOptions`.
- [x] `frontend/src/lib/playground/hex.ts`, `rot13.ts`, `atbash.ts`, `playfair.ts`, `rail-fence.ts`, `enigma.ts`, `vernam.ts` (Decision: Algorithm parameters), with the exported helpers `playfairGrid`, `enigmaStep`, and `enigma`.
- [x] `frontend/src/lib/playground/index.ts`: the 25 entries in the order of Decision: Ids, names, order, and labels, with the summaries of Decision: Summaries.
- [x] `frontend/src/lib/playground/validate.ts`: the new rules (Decision: Inputs and validation).
- [x] `frontend/src/components/CryptoPlayground.tsx`: the fields "Trilhos" and "Posição inicial", "Palavra-chave" also for Playfair, and the notes for Playfair and the Enigma.
- [x] `frontend/src/lib/algorithms/articles/`: `hex.ts`, `rot13.ts`, `atbash.ts`, `playfair.ts`, `rail-fence.ts`, `enigma.ts`, `vernam.ts` (Decision: Article content); register them in `ARTICLES`.

## Tests (written by Frontend, executed by Tester)

### Unit: new modules

- [x] `frontend/src/lib/playground/hex.test.ts` — `it('encodes UTF-8')`: `"olá"` gives `6f6cc3a1`; `it('decodes back')`: `decrypt()` of `"Olá, mundo! 123"` equals the input.
- [x] `frontend/src/lib/playground/rot13.test.ts` — `it('rotates letters only')`: `"Hello, World!"` gives `Uryyb, Jbeyq!`; `it('is its own inverse')`: `decrypt()` of `"Olá, mundo! 123"` equals the input.
- [x] `frontend/src/lib/playground/atbash.test.ts` — `it('mirrors the alphabet')`: `"Abc, xyz!"` gives `Zyx, cba!`; `it('decrypts back')`.
- [x] `frontend/src/lib/playground/playfair.test.ts` — `it('builds the grid')`: `playfairGrid("PLAYFAIREXAMPLE")` joined is `PLAYFIREXMBCDGHKNOQSTUVWZ`; `it('matches the classic example')`: output `BMODZBXDNABEKUDMUIXMMOUVIF`; `it('decrypts to the prepared text')`: `HIDETHEGOLDINTHETREXESTUMP`; `it('replaces J and removes accents')`: with keyword `"chave"`, `decrypt()` of `encrypt("Já")` is `IA`; `it('shows the keyword and the grid')`: "Grade" has five groups of five letters.
- [x] `frontend/src/lib/playground/rail-fence.test.ts` — `it('matches the classic example')`: 3 rails, `WECRLTEERDSOEEFEAOCAIVDEN`; `it('round-trips any text')`: for rails 2 to 10, `decrypt()` of `"Olá, mundo! 123"` equals the input; `it('shows the rails')`: `details` is `[{ label: "Trilhos", value: "3" }]`.
- [x] `frontend/src/lib/playground/enigma.test.ts` — `it('matches the known output')`: `enigma("AAAAA", "AAA")` is `BDZGO`; `it('double-steps the middle rotor')`: `enigmaStep` from `ADU` gives `ADV`, `AEW`, `BFX`, `BFY`; `it('never maps a letter to itself')`: for a 200-letter text of "A", no output letter is "A"; `it('is reciprocal')`: `enigma(enigma("ATAQUEAOAMANHECER", "QWE"), "QWE")` is `ATAQUEAOAMANHECER`; `it('keeps other characters and does not step on them')`: `enigma("A A", "AAA")` is `B D`.
- [x] `frontend/src/lib/playground/vernam.test.ts` (`// @vitest-environment node`) — `it('round-trips')`; `it('uses a key as long as the text')`: "Chave" of `"olá"` decodes to 4 bytes; `it('XORs the key')`: output bytes XOR key bytes equal the UTF-8 bytes of the text; `it('uses a new key each time')`.

### Unit: data, validation, and component

- [x] `frontend/src/lib/playground/index.test.ts` — update the names and the type and safety rows to the 25 of the MODIFIED requirement "Algorithm explanation".
- [x] `frontend/src/lib/playground/categories.test.ts` — update the expected groups to the 25 algorithms.
- [x] `frontend/src/lib/playground/validate.test.ts` — `it('validates the rails')`: 2 and 10 give `null`; 1, 11, and 2.5 give the rails message; `it('validates the Enigma start')`: `"AAA"` and `"qwe"` give `null`; `"A1"`, `"AAAA"`, and `""` give the start message; `it('validates the Playfair keyword and text')`: keyword `""` gives a message; text `"123 é"` gives the letter message.
- [x] `frontend/src/components/CryptoPlayground.test.tsx` — update `NAMES` to 25 and the button count test; `it('shows the fields of each classic cipher')`: "Posição inicial" (value `AAA`) only for Máquina Enigma, "Trilhos" (value `3`) only for Cerca de trilho, "Palavra-chave" for Vigenère and Playfair only; `it('shows the Playfair note')`: after "Encriptar" and "Decifrar" with the classic example, the note is shown; `it('encrypts with the Enigma')`: "AAAAA" gives `BDZGO`.
- [x] `frontend/src/lib/algorithms/index.test.ts` — add the seven ids to `REQUIRED_TERMS` with the `code` terms of Decision: Article content.
- [x] `frontend/src/app/(site)/algoritmos/page.test.tsx` — update the expected algorithms in "Codificação" and "Cifras clássicas".
- [x] `frontend/src/app/sitemap.test.ts` — update to the 30 URLs.

### E2E: `frontend/e2e/classic-algorithms.spec.ts` (new; block `https://pagead2.googlesyndication.com/**`)

- [x] `test('classic examples')` — Enigma `AAAAA` → `BDZGO`; Playfair (keyword `PLAYFAIREXAMPLE`) → `BMODZBXDNABEKUDMUIXMMOUVIF`; rail fence (3) → `WECRLTEERDSOEEFEAOCAIVDEN`; Hexadecimal "olá" → `6f6cc3a1`; ROT13 "Hello, World!" → `Uryyb, Jbeyq!`; Atbash "Abc, xyz!" → `Zyx, cba!`.
- [x] `test('exact round trips')` — Hexadecimal, ROT13, Atbash, rail fence, and Vernam with "Olá, mundo! 123".
- [x] `test('Enigma round trip in uppercase')` — start `QWE`, "Ataque ao amanhecer" → "Decifrar" shows "ATAQUE AO AMANHECER" and the Enigma note.
- [x] `test('rejects bad inputs')` — Enigma start "A1" and rails 11 show their messages and no result.
- [x] `test('25 buttons fit on mobile')` — viewport 375 x 812; `/` with Máquina Enigma selected; no horizontal scroll.

### E2E updates required by the MODIFIED requirements

- [x] `frontend/e2e/crypto-playground.spec.ts` and `frontend/e2e/modern-algorithms.spec.ts` — update the button names and order to the 25. Keep every other assertion.
- [x] `frontend/e2e/algorithm-pages.spec.ts` — `ALGORITHMS`: the 25 `[id, name]` pairs in order.
- [x] `frontend/e2e/adsense-readiness.spec.ts` — the 30 sitemap URLs.

### Regression

- [ ] All other E2E specs and unit tests pass without changes.

## Validation (Tester)

- [ ] Stop any process on port 3005, then `cd frontend && npm run lint && npx tsc --noEmit && npm test && npm run build`. The build lists 25 `/algoritmos/<id>` pages.
- [ ] `cd frontend && npx playwright test` (all specs; `smoke` and `comprehensive` with backend and Mongo running).
- [ ] Browser check (portal): on `/` at 1280px and 375px, try each classic cipher and Hexadecimal; open `/algoritmos` and three new articles. Read the seven new articles for typos and wrong facts, and report them.
