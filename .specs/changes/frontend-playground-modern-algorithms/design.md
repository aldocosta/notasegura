# Design: frontend-playground-modern-algorithms

## Context

`frontend/src/lib/playground/` has one module per algorithm, `types.ts`, `bytes.ts`, `web-crypto.ts` (`getSubtle`, `randomBytes`, `WebCryptoUnavailableError`), `validate.ts`, and `index.ts` (`ALGORITHMS`, seven entries).
`EncryptResult` is `{ output, details, decrypt? }`. `CryptoPlayground.tsx` shows "Encriptar", then "Decifrar" when `decrypt` exists, or the hash message.
`frontend/src/lib/algorithms/` holds one article per algorithm (`ARTICLES: Record<AlgorithmId, Article>`), and the pages `/algoritmos` and `/algoritmos/[id]` render them (`frontend-algorithm-pages`).
Node 22 (Vitest, `// @vitest-environment node`) provides `crypto.subtle` with SHA-1, SHA-512, HMAC, PBKDF2, ECDSA, ECDH, Ed25519, AES-CTR, and RSA-PSS. Browsers support Ed25519 in Web Crypto from Chrome 137, Firefox 129, and Safari 17.

## Decisions

### Decision: Types, categories, and order

**Chosen:** In `types.ts`:

```ts
export type AlgorithmId =
  | "aes-gcm" | "chacha20-poly1305" | "aes-cbc" | "aes-ctr" | "rsa-oaep"
  | "sha-256" | "sha-512" | "sha-1" | "md5"
  | "hmac-sha-256" | "ecdsa" | "ed25519" | "rsa-pss"
  | "ecdh" | "pbkdf2"
  | "base64"
  | "cesar" | "vigenere";
export type AlgorithmKind =
  | "Criptografia simétrica" | "Criptografia assimétrica" | "Hash"
  | "Autenticação de mensagem" | "Assinatura digital"
  | "Troca de chaves" | "Derivação de chave"
  | "Codificação" | "Cifra clássica";
export type EncryptResult = {
  output: string;
  details: Detail[];
  decrypt?: () => Promise<string>;
  verify?: (text: string) => Promise<boolean>;
};
```

`Algorithm.kind` uses `AlgorithmKind`. `safety` keeps its three values.
`frontend/src/lib/playground/categories.ts`:

```ts
export const CATEGORIES = [
  { name: "Criptografia", kinds: ["Criptografia simétrica", "Criptografia assimétrica"] },
  { name: "Hash", kinds: ["Hash"] },
  { name: "Autenticação e assinatura", kinds: ["Autenticação de mensagem", "Assinatura digital"] },
  { name: "Troca e derivação de chaves", kinds: ["Troca de chaves", "Derivação de chave"] },
  { name: "Codificação", kinds: ["Codificação"] },
  { name: "Cifras clássicas", kinds: ["Cifra clássica"] },
] as const;
export function algorithmsByCategory(): { name: string; algorithms: Algorithm[] }[];
```

`ALGORITHMS` order (button order, sitemap order):

| Category | Algorithms |
| --- | --- |
| Criptografia | AES-256-GCM, ChaCha20-Poly1305, AES-256-CBC, AES-256-CTR, RSA-OAEP |
| Hash | SHA-256, SHA-512, SHA-1, MD5 |
| Autenticação e assinatura | HMAC-SHA-256, ECDSA, Ed25519, RSA-PSS |
| Troca e derivação de chaves | ECDH, PBKDF2 |
| Codificação | Base64 |
| Cifras clássicas | Cifra de César, Cifra de Vigenère |

`algorithmsByCategory()` returns the categories in `CATEGORIES` order, each with its algorithms in `ALGORITHMS` order, and omits a category with no algorithm.

**Rationale:** One flat array keeps `ALGORITHMS`, the sitemap, and `generateStaticParams` simple. Categories derive from `kind`, so an algorithm cannot be in the wrong group.

### Decision: Algorithm parameters

**Chosen:**

| Algorithm | Kind / safety | Parameters | Output | Details | Way back |
| --- | --- | --- | --- | --- | --- |
| ChaCha20-Poly1305 | Criptografia simétrica / Seguro | pure TS (RFC 8439), random 32-byte key, random 12-byte nonce, no AAD | Base64 of ciphertext + 16-byte tag | "Chave", "Nonce" (Base64) | `decrypt`; a wrong tag throws |
| AES-256-CTR | Criptografia simétrica / Seguro | Web Crypto, 256-bit key, random 16-byte counter block, `length: 64` | Base64 of ciphertext (same length as the text) | "Chave", "Contador" | `decrypt` |
| SHA-512 | Hash / Não é criptografia | Web Crypto | 128 hex characters | none | none |
| SHA-1 | Hash / Inseguro | Web Crypto | 40 hex characters | none | none |
| MD5 | Hash / Inseguro | pure TS (RFC 1321) | 32 hex characters | none | none |
| HMAC-SHA-256 | Autenticação de mensagem / Seguro | Web Crypto, random 256-bit key | 64 hex characters | "Chave" | `verify(text)` with the same key |
| ECDSA | Assinatura digital / Seguro | Web Crypto, P-256, SHA-256 | Base64 of the 64-byte signature | "Chave pública" (Base64 SPKI) | `verify(text)` with the public key |
| Ed25519 | Assinatura digital / Seguro | Web Crypto `Ed25519` | Base64 of the 64-byte signature | "Chave pública" (Base64 of the 32-byte raw key) | `verify(text)` |
| RSA-PSS | Assinatura digital / Seguro | Web Crypto, 2048 bits, 65537, SHA-256, `saltLength: 32` | Base64 of the 256-byte signature | "Chave pública" (Base64 SPKI) | `verify(text)` |
| ECDH | Troca de chaves / Seguro | Web Crypto, P-256 key pairs for "Ana" and "Beto"; each side runs `deriveBits` (256 bits) with its private key and the other public key; Ana imports her bits as an AES-GCM key and encrypts the text with a random 12-byte IV | Base64 of the AES-GCM ciphertext | "Chave pública de Ana", "Chave pública de Beto" (Base64 raw), "Segredo calculado por Ana", "Segredo calculado por Beto" (Base64, equal), "IV" | `decrypt`: Beto imports his bits and decrypts |
| PBKDF2 | Derivação de chave / Seguro | Web Crypto, HMAC-SHA-256, random 16-byte salt, 600000 iterations, 256 bits | Base64 of the derived key | "Sal" (Base64), "Iterações" ("600000") | `verify(text)`: derive again with the same salt and compare |

Private keys and secret keys of signatures stay in the closure, except the HMAC key, AES key, and ChaCha20 key, which the playground shows like the AES key today. The ECDH demo shows both computed secrets so that the visitor sees that they are equal.
MD5 and ChaCha20-Poly1305 export pure functions that the tests call with fixed inputs: `md5Hex(bytes)`, `chacha20Poly1305Seal(key, nonce, plaintext, aad?)`, and `chacha20Poly1305Open(key, nonce, sealed, aad?)`. `hmac-sha-256.ts` exports `hmacSha256Hex(key, data)`, and `pbkdf2.ts` exports `pbkdf2Sha256(password, salt, iterations, bytes)`, for the RFC vectors.
`verify` compares with `subtle.verify` for HMAC and signatures, and with a constant-time byte comparison for PBKDF2.

**Rationale:** Web Crypto covers ten algorithms. MD5 is not in Web Crypto, and ChaCha20-Poly1305 is not in all browsers; both are small and are checked against official vectors.

**Alternatives considered:**

- `@noble/hashes` or `@noble/ciphers`: adds a dependency for two algorithms.
- X25519 for the key exchange: newer Web Crypto support than P-256. ECDH P-256 works in all current browsers.

### Decision: Action labels and the "Verificar" mode

**Chosen:** `frontend/src/lib/playground/actions.ts` maps each kind to labels:

| Kinds | Button | While running | Way back | Way-back result |
| --- | --- | --- | --- | --- |
| Criptografia simétrica, Criptografia assimétrica, Troca de chaves, Cifra clássica | "Encriptar" | "Encriptando..." | "Decifrar" | "Texto decifrado" |
| Hash | "Gerar hash" | "Gerando..." | — | — |
| Codificação | "Codificar" | "Codificando..." | "Decodificar" | "Texto decodificado" |
| Autenticação de mensagem | "Gerar código" | "Gerando..." | "Verificar" | — |
| Assinatura digital | "Assinar" | "Assinando..." | "Verificar" | — |
| Derivação de chave | "Derivar chave" | "Derivando..." | "Verificar" | — |

- The text box label is "Texto", or "Senha" for "Derivação de chave". The character limit stays 500.
- When the result has `verify`, the card shows a text box "Texto para verificar", filled with the text that was used, and a button "Verificar". After "Verificar", it shows "Válido: o texto confere com o resultado." or "Inválido: o texto não confere com o resultado." Editing the box clears the previous verification.
- When the result has neither `decrypt` nor `verify` (Hash), the card keeps the message "Um hash não pode ser desfeito: não existe chave para voltar ao texto original."
- The validation message for an empty text becomes "Escreva um texto." ("Escreva uma senha." for PBKDF2).
- If an algorithm is not available in the browser (`NotSupportedError`, for example Ed25519 in an old browser), the card shows "Seu navegador não permite este algoritmo." Other algorithms keep working.

**Rationale:** The same button word for a hash, a signature, and a cipher teaches the wrong idea. Editing the text before "Verificar" shows what a MAC and a signature are for.

### Decision: Grouped buttons

**Chosen:** Inside `div role="group" aria-label="Algoritmos"`, one `div role="group" aria-label="<category>"` per category, in `algorithmsByCategory()` order. Each has a visible label (`p`, `text-xs font-bold text-muted`) with the category name, and its buttons with `flex flex-wrap gap-2`. The outer group keeps all buttons in `ALGORITHMS` order. AES-256-GCM stays the default.

### Decision: Index page by category

**Chosen:** On `/algoritmos`, the section "Os algoritmos" renders one `section` per category: an `h3` with the category name and a `ul aria-label="<category>"`. Each item has an `h4` with the algorithm name, the type, the `SafetyBadge`, the summary, and the link "Ler sobre <name>". The list `ul aria-label="Lista de algoritmos"` is removed.
The introduction gains a paragraph on MACs, signatures, key exchange, and key derivation; it has 250 to 500 words. The highlight tiles stay.

### Decision: Summaries of the new algorithms

**Chosen:** pt-BR, two to three sentences each, in `summary`:

- **ChaCha20-Poly1305:** "Cifra moderna de fluxo com autenticação, criada para ser rápida mesmo sem aceleração de hardware. Como o AES-GCM, detecta se o texto cifrado foi alterado. É usada no TLS 1.3, no WireGuard e no SSH."
- **AES-256-CTR:** "Transforma o AES em uma cifra de fluxo: cifra um contador e combina o resultado com o texto. O resultado tem o mesmo tamanho do texto, mas o modo não detecta alterações."
- **SHA-512:** "Hash da mesma família do SHA-256, com resultado de 512 bits. É usado em assinaturas Ed25519 e em hashes de senhas do Linux. Como todo hash, não pode ser desfeito."
- **SHA-1:** "Hash de 160 bits muito usado no passado. Em 2017, pesquisadores criaram dois arquivos diferentes com o mesmo SHA-1, e ele deixou de ser seguro."
- **MD5:** "Hash de 128 bits dos anos 1990. Hoje é fácil criar dois textos com o mesmo MD5, então ele não serve para segurança, só para detectar erros de cópia."
- **HMAC-SHA-256:** "Combina uma chave secreta com o SHA-256 para gerar um código de autenticação. Quem tem a chave confere se a mensagem veio de quem também tem a chave e se não mudou."
- **ECDSA:** "Assinatura digital com curvas elípticas: a chave privada assina e a chave pública confere. É usada em certificados HTTPS, em passkeys e no Bitcoin."
- **Ed25519:** "Assinatura digital moderna em curvas de Edwards, rápida e com chaves de 32 bytes. Não depende de um número aleatório a cada assinatura, o que evita um erro comum do ECDSA."
- **RSA-PSS:** "Assinatura digital com RSA e um preenchimento aleatório. É o formato que o TLS 1.3 exige para assinaturas RSA."
- **ECDH:** "Troca de chaves Diffie-Hellman com curvas elípticas. Ana e Beto trocam apenas chaves públicas e chegam ao mesmo segredo, que vira uma chave AES."
- **PBKDF2:** "Transforma uma senha em uma chave, repetindo o HMAC centenas de milhares de vezes com um sal. Isso torna cada tentativa de adivinhar a senha mais lenta."

### Decision: Article content

**Chosen:** The structure, length (450 to 1100 words), and tone of `frontend-algorithm-pages`. The terms in `code` must appear verbatim.

- **ChaCha20-Poly1305** (related: `aes-gcm`, `aes-ctr`): ChaCha20 and Poly1305 by Daniel J. `Bernstein`; the combination standardized in `RFC 8439`. Key of `256 bits`, `nonce` of `12 bytes`, tag of 16 bytes; only additions, rotations, and XOR, so it is fast and constant-time without AES hardware. Example: "segredo" gives 23 bytes. Used in `TLS 1.3`, `WireGuard`, and SSH. The nonce must never repeat with the same key.
- **AES-256-CTR** (related: `aes-gcm`, `chacha20-poly1305`): AES encrypts a `contador` of `16 bytes`, and the result is combined with the text with `XOR`; the output has the `mesmo tamanho` as the text, with no padding; blocks can run in parallel. The counter must never repeat with the same key. No integrity: flipping a bit of the ciphertext flips the same bit of the text, so it needs an `HMAC`, or `GCM`, which is CTR plus authentication.
- **SHA-512** (related: `sha-256`, `hmac-sha-256`): SHA-2 family, `FIPS 180-4`; 512 bits shown as `128` hexadecimal characters; 64-bit words, `80` rounds, 1024-bit blocks, often faster than SHA-256 on 64-bit processors. Example: "abc" gives `ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f`. Used inside `Ed25519` and in Linux password hashes (`$6$`).
- **SHA-1** (related: `sha-256`, `md5`): published in 1995; `160 bits`, shown as `40` hexadecimal characters. Example: "abc" gives `a9993e364706816aba3e25717850c26c9cd0d89d`. Theoretical attack in 2005; the first practical collision, `SHAttered`, by Google and CWI Amsterdam in `2017`; a chosen-prefix collision in 2020. Browsers stopped accepting SHA-1 certificates. `Git` used SHA-1 and is moving to SHA-256.
- **MD5** (related: `sha-1`, `sha-256`): Ronald `Rivest`, 1991, `RFC 1321`; `128 bits`, `32` hexadecimal characters. Example: "abc" gives `900150983cd24fb0d6963f7d28e17f72`. Practical `colisão` in 2004 (Xiaoyun Wang); a false certificate authority in 2008; the `Flame` malware forged a Microsoft signature in 2012. Still acceptable only to detect accidental errors.
- **HMAC-SHA-256** (related: `sha-256`, `ecdsa`): `RFC 2104` (Bellare, Canetti, Krawczyk, 1996); a `chave secreta` combined with the hash in two passes; 32 bytes, 64 hex characters. Example from RFC 4231: key `Jefe`, text "what do ya want for nothing?", result `5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843`. Used in `JWT` (HS256), API request signing, and `webhook` signatures. Compare codes in `tempo constante`. Both sides have the key, so it does not prove to a third party who wrote the message.
- **PBKDF2** (related: `sha-256`, `hmac-sha-256`): PKCS #5, today `RFC 8018`; HMAC repeated many times with a random `sal`; OWASP recommends `600.000` iterations with HMAC-SHA-256. Example: password "password", salt "salt", 1 iteration gives `120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b`. Used in `WPA2` Wi-Fi (4096 iterations, the network name as salt), in password managers, and in `Django`. It uses little memory, so GPUs speed up attacks; `Argon2` and scrypt resist better.
- **ECDSA** (related: `rsa-pss`, `ed25519`): `curvas elípticas` (Koblitz and Miller, 1985); the NIST curve `P-256`; a 256-bit key is about as strong as RSA with 3072 bits; signature of `64 bytes`. Each signature needs a new random number; repeating it reveals the `chave privada`, which happened to the `PlayStation 3` in 2010. Used in HTTPS certificates, in `WebAuthn` passkeys, and in `Bitcoin` (curve secp256k1).
- **Ed25519** (related: `ecdsa`, `sha-512`): EdDSA on Curve25519, by `Bernstein` and others, 2011; `RFC 8032`; public key of `32 bytes`, signature of `64 bytes`. The signature is `determinística`: the secret number comes from the private key and the message with `SHA-512`, which avoids the PlayStation 3 error. Used in `SSH` keys, Tor, and Git signatures. Web Crypto support arrived in browsers between 2023 and 2025.
- **RSA-PSS** (related: `rsa-oaep`, `ecdsa`): Probabilistic Signature Scheme by `Bellare` and `Rogaway`, 1996; `RFC 8017`; a random `sal` makes each signature different; with a 2048-bit key the signature has `256 bytes`. `TLS 1.3` requires PSS for RSA signatures in the handshake. Many certificates still use `PKCS#1 v1.5`, which is older and deterministic.
- **ECDH** (related: `ecdsa`, `aes-gcm`): Whitfield `Diffie` and Martin `Hellman`, `1976`; each side combines its private key with the other public key and gets the same `segredo compartilhado`. Real protocols pass the secret through a key derivation function before use. Without authentication, a `homem no meio` can impersonate both sides, so protocols sign the keys. Temporary keys give `sigilo futuro`; `TLS 1.3` always uses this. A quantum computer would break it; browsers already combine it with ML-KEM.

**Rationale:** Same quality bar as the first seven articles.

### Decision: Errors

**Chosen:** `web-crypto.ts` gains `AlgorithmUnsupportedError`. Each Web Crypto module turns a `DOMException` named `NotSupportedError` from `generateKey` into this error. `failureMessage` in the component maps it to "Seu navegador não permite este algoritmo."

## Architecture

```text
lib/playground/
  types.ts (AlgorithmId x18, AlgorithmKind, EncryptResult.verify)
  categories.ts (CATEGORIES, algorithmsByCategory)
  actions.ts (labels by kind)
  index.ts (ALGORITHMS x18, ordered by category)
  chacha20-poly1305.ts, md5.ts               pure TS
  aes-ctr.ts, sha-512.ts, sha-1.ts, hmac-sha-256.ts,
  ecdsa.ts, ed25519.ts, rsa-pss.ts, ecdh.ts, pbkdf2.ts  ──> crypto.subtle
components/CryptoPlayground.tsx (category groups, action labels, verify box)
lib/algorithms/articles/*.ts (+11)
app/(site)/algoritmos/page.tsx (by category)
```

## Risks

- **Hand-written MD5 and ChaCha20-Poly1305.** Mitigation: tests with the RFC 1321 and RFC 8439 vectors, and a round trip with random keys. They are demonstration code; the notes still use the backend AES-256-GCM.
- **Ed25519 in older browsers.** Mitigation: the "Seu navegador não permite este algoritmo." message.
- **PBKDF2 with 600000 iterations is slow on old phones.** It takes about 70 ms in Node. Mitigation: the disabled button with "Derivando...".
- **Many existing test edits.** The labels, the order, and the grouping change. Each edit is listed in `tasks.md`; no assertion is weakened.
