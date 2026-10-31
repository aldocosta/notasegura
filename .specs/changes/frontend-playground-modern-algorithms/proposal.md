# Proposal: frontend-playground-modern-algorithms

## Intent

The playground and `/algoritmos` cover seven algorithms. The user wants 25 in total, delivered in two changes.
This change adds the eleven modern algorithms: MD5, SHA-1, SHA-512, HMAC-SHA-256, PBKDF2, ECDSA P-256, Ed25519, ECDH P-256, AES-256-CTR, RSA-PSS, and ChaCha20-Poly1305.
Several of them do not encrypt: a MAC or a signature is verified, a key exchange produces a shared secret, and a key derivation turns a password into a key. The playground must show these operations correctly, and a list of 18 buttons needs categories.
`frontend-playground-classic-algorithms` adds the other seven (classic ciphers and hexadecimal) after this change.

## User Stories

### Story: try-modern-algorithms

As a visitor, I want to try hashes, MACs, signatures, key exchange, and key derivation in the browser, so that I see what each one produces and how it is checked.

### Story: understand-an-algorithm

As a visitor, I want a full page about each new algorithm, so that I understand it without other sources.

### Story: find-by-category

As a visitor, I want the algorithms grouped by category, so that I find the one that I need in a long list.

## Scope

**In scope:**

- Eleven new algorithm modules in `frontend/src/lib/playground/`, all running in the browser. Ten use the Web Crypto API. MD5 and ChaCha20-Poly1305 are pure TypeScript, checked against RFC 1321 and RFC 8439 test vectors.
- New algorithm types: "Autenticação de mensagem", "Assinatura digital", "Troca de chaves", and "Derivação de chave".
- A "Verificar" mode for HMAC, signatures, and PBKDF2: the visitor can edit the text and check it again.
- Action labels by type: "Encriptar", "Gerar hash", "Gerar código", "Assinar", "Derivar chave", and "Codificar", with "Decifrar" or "Decodificar" for the way back. The text box label becomes "Texto" ("Senha" for PBKDF2).
- Grouping by category in the playground buttons and on `/algoritmos`: Criptografia, Hash, Autenticação e assinatura, Troca e derivação de chaves, Codificação, and Cifras clássicas.
- Eleven new article pages at `/algoritmos/<id>`, with the structure of `frontend-algorithm-pages`, and an updated introduction on `/algoritmos`.
- The sitemap with the new pages.
- Unit and E2E tests, including the updates of the existing tests that this change requires.

**Out of scope:**

- The seven classic and encoding algorithms (`frontend-playground-classic-algorithms`).
- Argon2, scrypt, bcrypt, X25519, and post-quantum algorithms (they need a new dependency or are not in the Web Crypto API of all current browsers).
- Backend changes, and changes to how notes are encrypted.

## Approach

The `Algorithm` interface gains an optional `verify(text)` next to `decrypt()`, and the component chooses labels from the algorithm type, so that it has no branch per algorithm.
`ALGORITHMS` keeps one flat array, ordered by category; a `CATEGORIES` list maps each category to its types, and the component and the index page render one group per category.

## Resolved Questions

- 2026-10-30 Total: 25 algorithms, in two changes. Decided with the user.
- 2026-10-30 This change: MD5, SHA-1, SHA-512, HMAC-SHA-256, PBKDF2, ECDSA P-256, Ed25519, ECDH P-256, AES-256-CTR, RSA-PSS, ChaCha20-Poly1305. Decided with the user.
- 2026-10-30 Group the buttons and the index by category. Decided with the user.
- 2026-10-30 Safety labels: MD5 and SHA-1 are "Inseguro"; SHA-512 is "Não é criptografia" (like SHA-256); the other new ones are "Seguro".
