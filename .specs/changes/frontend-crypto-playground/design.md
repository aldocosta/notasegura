# Design: frontend-crypto-playground

## Context

`frontend/src/app/(site)/page.tsx` is a client component with three sections: the hero, `#como-funciona`, and `#criar-nota`.
Next.js renders the first state of a client component on the server, so the default text of the card is in the server HTML (useful for the AdSense content review).
The backend encrypts notes with AES-256-GCM, a 12-byte IV, and a key derived with scrypt (`backend/src/modules/notes/infrastructure/crypto/aes-gcm-crypto.adapter.ts`).
The browser provides `crypto.subtle` (Web Crypto API) with AES-GCM, AES-CBC, RSA-OAEP, and SHA-256. The frontend has no crypto dependency, and this change adds none.

## Decisions

### Decision: Run every algorithm in the browser

**Chosen:** AES-256-GCM, AES-256-CBC, RSA-OAEP, and SHA-256 use `crypto.subtle`. Base64, César, and Vigenère are pure TypeScript functions.

**Rationale:** Decided with the user. The visitor can choose any of the seven algorithms. The text never leaves the device, the demo does not use the create rate limit, and it does not need a backend endpoint.

**Alternatives considered:**

- A backend demo endpoint: sends the typed text to the server, uses the rate limit, and needs a new endpoint for a demo.

### Decision: One module per algorithm with a shared interface

**Chosen:** `frontend/src/lib/playground/types.ts`:

```ts
export type AlgorithmId = "aes-gcm" | "aes-cbc" | "rsa-oaep" | "sha-256" | "base64" | "cesar" | "vigenere";
export type Detail = { label: string; value: string };
export type EncryptResult = { output: string; details: Detail[]; decrypt?: () => Promise<string> };
export type Algorithm = {
  id: AlgorithmId;
  name: string;
  kind: "Criptografia simétrica" | "Criptografia assimétrica" | "Hash" | "Codificação" | "Cifra clássica";
  safety: "Seguro" | "Não é criptografia" | "Inseguro";
  summary: string[];
  encrypt(text: string, options: { shift?: number; keyword?: string }): Promise<EncryptResult>;
};
```

Files: `aes-gcm.ts`, `aes-cbc.ts`, `rsa-oaep.ts`, `sha-256.ts`, `base64.ts`, `cesar.ts`, `vigenere.ts`, `bytes.ts` (UTF-8 and Base64 helpers), `validate.ts`, and `index.ts` (`ALGORITHMS` in the button order).
`decrypt` is a closure over the key, the IV, and the ciphertext of that result. It is absent for SHA-256, so the component shows "Decifrar" only when `decrypt` exists.
Keys live only in memory, in the closure. They are never stored and never sent.

**Rationale:** Each algorithm can be tested alone, and the component has no algorithm-specific branches.

**Alternatives considered:**

- One `switch` in the component: mixes UI and crypto, and is harder to test.

### Decision: Algorithm parameters

**Chosen:**

| Algorithm | Parameters | Output | Details shown |
| --- | --- | --- | --- |
| AES-256-GCM | `generateKey` 256 bits, IV 12 random bytes, tag 128 bits | Base64 of ciphertext + tag | "Chave" (Base64 of the raw key), "IV" (Base64) |
| AES-256-CBC | `generateKey` 256 bits, IV 16 random bytes, PKCS#7 padding (built in) | Base64 of ciphertext | "Chave", "IV" |
| RSA-OAEP | `modulusLength` 2048, `publicExponent` 65537, hash SHA-256 | Base64 of ciphertext | "Chave pública" (Base64 of SPKI); the private key stays in the closure |
| SHA-256 | — | lowercase hex digest | none |
| Base64 | UTF-8 bytes | standard Base64 with padding | none |
| César | shift 1–25, default 3 | shifted letters A–Z, a–z | "Deslocamento" |
| Vigenère | keyword of A–Z/a–z, case-insensitive; the keyword index moves only on letters | shifted letters A–Z, a–z | "Palavra-chave" |

Accented letters (for example "á") and other characters stay unchanged in César and Vigenère, so the round trip is exact.
The RSA limit of 190 bytes is `256 − 2 × 32 − 2` for OAEP with SHA-256 and a 2048-bit key.
The RSA key pair is generated on each "Encriptar". This takes less than a second on current devices. The button shows "Encriptando..." and is disabled while it runs.

**Rationale:** AES-256-GCM matches what the backend uses for the notes. The other values are the common defaults.

### Decision: Component and layout

**Chosen:** `frontend/src/components/CryptoPlayground.tsx` (`"use client"`), rendered in `page.tsx` as a new `<section id="testar-algoritmos">` after `#criar-nota` and before the ads `aside`. The card uses the same classes as the card "Criar uma nota" (`rounded border border-hairline-strong bg-mint-50 p-5 sm:p-7`).

Content from top to bottom:

1. `h2` "Teste os algoritmos" and one line: "Escolha um algoritmo, escreva um texto e veja como ele fica. Tudo acontece no seu navegador e nada é salvo."
2. `div role="group" aria-label="Algoritmos"` with seven `button type="button"` and `aria-pressed`. They wrap with `flex flex-wrap gap-2`; the pressed button uses `bg-primary text-on-primary`.
3. The explanation box: the name (`h3`), the type, the safety label as a badge (Seguro: mint; Não é criptografia: neutral; Inseguro: `text-error` with a border), and the `summary` paragraphs.
4. The form: `textarea` "Texto para encriptar" (`maxLength` 500, with a character counter), the field "Deslocamento" (number 1–25) only for César, the field "Palavra-chave" only for Vigenère, and the button "Encriptar".
5. The result in a `div aria-live="polite"`: "Resultado" in `code` with `break-all`, the details as a `dl`, and the button "Decifrar" or, for SHA-256, the text "Um hash não pode ser desfeito: não existe chave para voltar ao texto original." After "Decifrar": "Texto decifrado" with the text.

Changing the algorithm clears the result and the error. The text stays.

**Rationale:** Same look as the other cards. `aria-pressed` buttons match the request for "botões com o nome do algoritmo".

**Alternatives considered:**

- A `select`: hides the options; the user asked for buttons.
- Tabs (`role="tablist"`): the content is one form, not separate panels.

### Decision: Explanation texts

**Chosen:** pt-BR, two to three sentences each, in `summary`:

- **AES-256-GCM:** "Padrão moderno de criptografia simétrica: a mesma chave cifra e decifra. O modo GCM também detecta se o texto cifrado foi alterado. É o algoritmo que o Nota Segura - BR usa para proteger as notas."
- **AES-256-CBC:** "Usa o mesmo AES, mas encadeia os blocos com um vetor de inicialização (IV). Ainda é seguro quando bem usado, mas sozinho não detecta alterações no texto cifrado."
- **RSA-OAEP:** "Criptografia assimétrica: a chave pública cifra e só a chave privada decifra. É usada para trocar chaves e assinar dados, e só cifra textos curtos."
- **SHA-256:** "Gera uma impressão digital de tamanho fixo do texto. O mesmo texto sempre gera o mesmo hash, mas não é possível voltar ao texto original."
- **Base64:** "Transforma bytes em letras e números para transporte. Não usa chave: qualquer pessoa desfaz a codificação, então não protege nada."
- **Cifra de César:** "Desloca cada letra um número fixo de posições no alfabeto. Usada na Roma antiga, é quebrada em segundos testando os 25 deslocamentos."
- **Cifra de Vigenère:** "Usa uma palavra-chave para deslocar cada letra de forma diferente. Resistiu por séculos, mas hoje é quebrada facilmente com análise de frequência."

**Rationale:** Short, correct, and explicit about which algorithms are not safe for secrets.

## Architecture

```text
page.tsx (client)
└── <section id="testar-algoritmos">
    └── CryptoPlayground
        ├── ALGORITHMS (lib/playground/index.ts)
        │   ├── aes-gcm, aes-cbc, rsa-oaep, sha-256 ──> crypto.subtle
        │   └── base64, cesar, vigenere ──> pure functions
        └── validate.ts (text, RSA bytes, shift, keyword)

No network: nothing calls lib/api.
```

## Risks

- **`crypto.subtle` in Vitest with jsdom.** jsdom may not expose `crypto.subtle`. Mitigation: the algorithm tests run with `// @vitest-environment node` (Node 22 provides `globalThis.crypto.subtle`); if the component test lacks it, `vitest.setup.ts` sets `globalThis.crypto` from `node:crypto` `webcrypto` when `crypto.subtle` is missing.
- **RSA key generation is slow on old phones.** Mitigation: a disabled button with "Encriptando..." while it runs.
- **`crypto.subtle` exists only in secure contexts (HTTPS or localhost).** Production runs on HTTPS. Mitigation: if `crypto.subtle` is missing, the card shows "Seu navegador não permite criptografia nesta página." for the four Web Crypto algorithms. Base64, César, and Vigenère still work.
- **Visitors may think César or Base64 protect their notes.** Mitigation: the "Inseguro" and "Não é criptografia" labels, and the AES-256-GCM text that names it as the site's algorithm.
