# Proposal: frontend-playground-classic-algorithms

## Intent

This change completes the 25 algorithms that the user asked for. After `frontend-playground-modern-algorithms` the playground has 18.
It adds six classic ciphers and one encoding: ROT13, Cifra Atbash, Cifra de Playfair, Cerca de trilho, Máquina Enigma, Cifra de Vernam, and Hexadecimal.
Classic ciphers show why key size, randomness, and key reuse matter, and they attract curious visitors to the content pages.

## User Stories

### Story: try-classic-ciphers

As a visitor, I want to try the famous historical ciphers in the browser, including the Enigma machine, so that I see how they work and why they were broken.

### Story: understand-an-algorithm

As a visitor, I want a full page about each new algorithm, so that I understand it without other sources.

## Scope

**In scope:**

- Seven pure TypeScript modules in `frontend/src/lib/playground/`: `hex`, `rot13`, `atbash`, `playfair`, `rail-fence`, `enigma`, `vernam` (Vernam uses `crypto.getRandomValues` for the key).
- New inputs: "Palavra-chave" for Playfair (shared with Vigenère), "Trilhos" for the rail fence, and "Posição inicial" for the Enigma.
- Seven new article pages at `/algoritmos/<id>`, and the sitemap with them.
- Unit and E2E tests, including the updates of the existing tests that this change requires.

**Out of scope:**

- Enigma plugboard, ring settings, and rotor choice. The machine is fixed to Enigma I, rotors I-II-III, reflector B, rings A-A-A, and no plugboard.
- Other classic ciphers.
- Backend changes.

## Approach

The modules follow the interface of `frontend-playground-modern-algorithms`. Each one is deterministic except Vernam, so the tests use the historical examples as vectors.
The two new kinds of input follow the César and Vigenère pattern: a field shown only for its algorithm, validated in `validate.ts`.

## Resolved Questions

- 2026-10-30 Algorithms: ROT13, Atbash, Playfair, rail fence, Enigma, Vernam, and Hexadecimal. Decided with the user.
- 2026-10-30 Order in "Cifras clássicas": César, ROT13, Atbash, Vigenère, Playfair, Cerca de trilho, Máquina Enigma, Cifra de Vernam. "Codificação": Base64, Hexadecimal.
- 2026-10-30 Safety: Vernam is "Seguro", because the playground uses a random key as long as the text and uses it once; its article explains why it is not practical. Hexadecimal is "Não é criptografia". The other five are "Inseguro".
