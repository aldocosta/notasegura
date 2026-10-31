# Delta for Frontend

## ADDED Requirements

### Requirement: Verify the result

After a result is shown for HMAC-SHA-256, ECDSA, Ed25519, RSA-PSS, or PBKDF2, the card SHALL show a text box "Texto para verificar", filled with the text that produced the result, and a button "Verificar".
Activating "Verificar" SHALL show "Válido: o texto confere com o resultado." when the text in the box is the text that produced the result, and "Inválido: o texto não confere com o resultado." otherwise.
The card SHALL NOT show "Decifrar" for these algorithms.

Serves: try-modern-algorithms

#### Scenario: Unchanged text is valid

- **GIVEN** the algorithm "ECDSA", the text "segredo", and a shown signature
- **WHEN** the visitor activates "Verificar" without editing the box
- **THEN** the card shows "Válido: o texto confere com o resultado."

#### Scenario: Changed text is invalid

- **GIVEN** the algorithm "HMAC-SHA-256", the text "segredo", and a shown code
- **WHEN** the visitor changes the box to "segredO" and activates "Verificar"
- **THEN** the card shows "Inválido: o texto não confere com o resultado."

#### Scenario: Wrong password

- **GIVEN** the algorithm "PBKDF2", the password "senha123", and a shown key
- **WHEN** the visitor changes the box to "senha124" and activates "Verificar"
- **THEN** the card shows "Inválido: o texto não confere com o resultado."

### Requirement: Key exchange demonstration

For ECDH, the result SHALL show the public keys of "Ana" and "Beto", the secret computed by each side, and the text encrypted by Ana with that secret.
The two computed secrets SHALL be equal and SHALL have 32 bytes.
"Decifrar" SHALL decrypt with the secret computed by Beto and SHALL show the original text.

Serves: try-modern-algorithms

#### Scenario: Same secret on both sides

- **GIVEN** the algorithm "ECDH" and the text "segredo"
- **WHEN** the visitor activates "Encriptar"
- **THEN** "Segredo calculado por Ana" equals "Segredo calculado por Beto"
- **AND** "Decifrar" shows "segredo"

### Requirement: Unsupported algorithm

When the browser does not support an algorithm, the card SHALL show "Seu navegador não permite este algoritmo." and no result. The other algorithms SHALL keep working.

Serves: try-modern-algorithms

#### Scenario: Ed25519 not supported

- **GIVEN** a browser whose Web Crypto API rejects Ed25519 with `NotSupportedError`
- **WHEN** the visitor selects "Ed25519" and activates "Assinar"
- **THEN** the card shows "Seu navegador não permite este algoritmo."

## MODIFIED Requirements

### Requirement: Playground card on the home page

> Previously: the group "Algoritmos" had exactly seven buttons in one row.

The home page SHALL show a card with the `h2` "Teste os algoritmos" directly after the card "Criar uma nota".
The card SHALL contain a group named "Algoritmos" with eighteen buttons. Inside it, the buttons SHALL be in one group per category, named and labeled, in this order:

- "Criptografia": "AES-256-GCM", "ChaCha20-Poly1305", "AES-256-CBC", "AES-256-CTR", "RSA-OAEP";
- "Hash": "SHA-256", "SHA-512", "SHA-1", "MD5";
- "Autenticação e assinatura": "HMAC-SHA-256", "ECDSA", "Ed25519", "RSA-PSS";
- "Troca e derivação de chaves": "ECDH", "PBKDF2";
- "Codificação": "Base64";
- "Cifras clássicas": "Cifra de César", "Cifra de Vigenère".

Exactly one button SHALL carry `aria-pressed="true"`; on first render it SHALL be "AES-256-GCM".
The server HTML of `/` SHALL contain the card heading, the eighteen buttons, and the explanation of AES-256-GCM.

Serves: try-modern-algorithms, find-by-category

#### Scenario: Card position

- **GIVEN** the home page
- **WHEN** it is rendered
- **THEN** the section with the `h2` "Teste os algoritmos" comes after the section with the `h2` "Criar uma nota"

#### Scenario: Buttons by category

- **GIVEN** the home page
- **WHEN** a client requests `/` without executing JavaScript
- **THEN** the HTML contains the six category groups with their buttons in the order above
- **AND** "AES-256-GCM" has `aria-pressed="true"` and its explanation is present

#### Scenario: Mobile viewport

- **GIVEN** a viewport of 375 x 812 pixels
- **WHEN** the user opens `/`
- **THEN** the document scroll width is not larger than the viewport width

### Requirement: Algorithm explanation

> Previously: the requirement listed types and safety labels for seven algorithms.

When the visitor selects an algorithm, the card SHALL show its name, its type, a pt-BR explanation of at least two sentences, and a safety label.
The types SHALL be: "Criptografia simétrica" for AES-256-GCM, ChaCha20-Poly1305, AES-256-CBC, and AES-256-CTR; "Criptografia assimétrica" for RSA-OAEP; "Hash" for SHA-256, SHA-512, SHA-1, and MD5; "Autenticação de mensagem" for HMAC-SHA-256; "Assinatura digital" for ECDSA, Ed25519, and RSA-PSS; "Troca de chaves" for ECDH; "Derivação de chave" for PBKDF2; "Codificação" for Base64; "Cifra clássica" for César and Vigenère.
The safety labels SHALL be: "Inseguro" for SHA-1, MD5, César, and Vigenère; "Não é criptografia" for SHA-256, SHA-512, and Base64; "Seguro" for all the others.
The explanation of AES-256-GCM SHALL state that it is the algorithm that Nota Segura - BR uses for the notes.

Serves: try-modern-algorithms, understand-an-algorithm

#### Scenario: Broken hash

- **GIVEN** the playground card
- **WHEN** the visitor selects "MD5"
- **THEN** the card shows "Hash" and the label "Inseguro"

#### Scenario: Signature

- **GIVEN** the playground card
- **WHEN** the visitor selects "Ed25519"
- **THEN** the card shows "Assinatura digital" and the label "Seguro"

### Requirement: Encrypt and show the result

> Previously: one button "Encriptar" for every algorithm, the text box "Texto para encriptar", and results for seven algorithms.

The text box SHALL be labeled "Texto", or "Senha" for PBKDF2. The action button SHALL be labeled by type: "Encriptar" (encryption, key exchange, classic cipher), "Gerar hash" (hash), "Codificar" (encoding), "Gerar código" (message authentication), "Assinar" (digital signature), or "Derivar chave" (key derivation).
When the visitor types a non-empty text of at most 500 characters and activates the button, the card SHALL show the result and the details listed in `design.md` (Decision: Algorithm parameters) for the eleven new algorithms, and the results defined before for the other seven.
Each activation with a random key, IV, nonce, counter, or salt SHALL use new random values.
The result SHALL be announced to assistive technology.

Serves: try-modern-algorithms

#### Scenario: SHA-512 result

- **GIVEN** the algorithm "SHA-512" and the text "abc"
- **WHEN** the visitor activates "Gerar hash"
- **THEN** the result is `ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f`

#### Scenario: MD5 result

- **GIVEN** the algorithm "MD5" and the text "abc"
- **WHEN** the visitor activates "Gerar hash"
- **THEN** the result is `900150983cd24fb0d6963f7d28e17f72`

#### Scenario: SHA-1 result

- **GIVEN** the algorithm "SHA-1" and the text "abc"
- **WHEN** the visitor activates "Gerar hash"
- **THEN** the result is `a9993e364706816aba3e25717850c26c9cd0d89d`

#### Scenario: AES-CTR keeps the length

- **GIVEN** the algorithm "AES-256-CTR" and the text "segredo"
- **WHEN** the visitor activates "Encriptar"
- **THEN** the decoded result has 7 bytes

#### Scenario: Base64 label

- **GIVEN** the algorithm "Base64" and the text "olá"
- **WHEN** the visitor activates "Codificar"
- **THEN** the result is `b2zDoQ==`

### Requirement: Decrypt the result

> Previously: "Decifrar" for six algorithms, including Base64.

After a result is shown for AES-256-GCM, ChaCha20-Poly1305, AES-256-CBC, AES-256-CTR, RSA-OAEP, ECDH, César, or Vigenère, the card SHALL show a button "Decifrar", and activating it SHALL show "Texto decifrado" with the original text.
For Base64, the button SHALL be "Decodificar" and the result "Texto decodificado".
For a hash, the card SHALL show no way back and SHALL state that a hash cannot be reversed.

Serves: try-modern-algorithms

#### Scenario: Round trip

- **GIVEN** each algorithm with "Decifrar" or "Decodificar", and the text "Olá, mundo! 123"
- **WHEN** the visitor activates the action button and then the way-back button
- **THEN** the shown text is "Olá, mundo! 123"

#### Scenario: Hash has no way back

- **GIVEN** the algorithm "SHA-1" and a shown result
- **WHEN** the card is rendered
- **THEN** no button "Decifrar", "Decodificar", or "Verificar" exists
- **AND** the card states that the hash cannot be reversed

### Requirement: Input validation

> Previously: the empty-text message asked for a text to encrypt.

The card SHALL NOT produce a result, and SHALL show a pt-BR error message, when:

- the text is empty ("Escreva um texto.", or "Escreva uma senha." for PBKDF2);
- the text has more than 500 characters;
- the algorithm is RSA-OAEP and the text has more than 190 bytes in UTF-8;
- the algorithm is Cifra de Vigenère and the keyword is empty or contains a character other than A–Z or a–z;
- the algorithm is Cifra de César and the shift is not an integer from 1 to 25.

Serves: try-modern-algorithms

#### Scenario: Empty password

- **GIVEN** the algorithm "PBKDF2" and an empty text
- **WHEN** the visitor activates "Derivar chave"
- **THEN** no result is shown and "Escreva uma senha." is shown

### Requirement: Algorithm index page

> Previously: one list of seven algorithms.

The site SHALL serve `/algoritmos` with HTTP 200 and one `h1` "Algoritmos de criptografia".
The server HTML SHALL contain an introduction of at least four paragraphs that explains encryption, hashing, message authentication, signatures, key exchange, key derivation, and encoding.
The page SHALL show one section per category, in the playground order, each with an `h3` category name and a list of its algorithms. Each item SHALL show the name, the type, the safety label, the short explanation, and a link "Ler sobre <name>" to `/algoritmos/<id>`.

Serves: find-by-category, understand-an-algorithm

#### Scenario: Index by category

- **GIVEN** the site is running
- **WHEN** a client requests `/algoritmos` without executing JavaScript
- **THEN** the HTML contains the six category headings in order
- **AND** it contains links to the eighteen `/algoritmos/<id>` in the playground order

### Requirement: Algorithm article pages

> Previously: seven algorithm ids.

For each of the eighteen algorithm ids (`aes-gcm`, `chacha20-poly1305`, `aes-cbc`, `aes-ctr`, `rsa-oaep`, `sha-256`, `sha-512`, `sha-1`, `md5`, `hmac-sha-256`, `ecdsa`, `ed25519`, `rsa-pss`, `ecdh`, `pbkdf2`, `base64`, `cesar`, `vigenere`), the site SHALL serve `/algoritmos/<id>` with HTTP 200.
The page SHALL contain one `h1` "<name>: o que é e como funciona", and the document title SHALL be "<name>: o que é e como funciona | Nota Segura - BR".
The page SHALL show three highlight tiles with the type, the safety label, and the key of the algorithm.
The page SHALL contain six `h2` sections in this order: "O que é", "Como funciona", "Exemplo", "Onde é usado", "Pontos fortes e fracos", and "Quando usar".
The article text SHALL have from 450 to 1100 words, SHALL be in the server HTML, and SHALL state the facts listed for that algorithm in the `design.md` of the change that added it.
The page SHALL have a meta description of 70 to 160 characters.

Serves: understand-an-algorithm

#### Scenario: New article without JavaScript

- **GIVEN** the id `sha-1`
- **WHEN** a client requests `/algoritmos/sha-1` without executing JavaScript
- **THEN** the status is 200 and the HTML contains one `h1` "SHA-1: o que é e como funciona"
- **AND** the HTML contains "SHAttered"

#### Scenario: Mobile viewport

- **GIVEN** a viewport of 375 x 812 pixels
- **WHEN** the user opens `/algoritmos` or any `/algoritmos/<id>`
- **THEN** the document scroll width is not larger than the viewport width

### Requirement: Sitemap

> Previously: the sitemap listed seven algorithm pages.

The site SHALL serve `/sitemap.xml` with HTTP 200.
It SHALL list exactly, in this order, the home page, the three trust pages, `/algoritmos`, and the eighteen algorithm pages in the playground order, as absolute URLs on `NEXT_PUBLIC_SITE_URL`.
It SHALL NOT list any URL under `/n/`, and it SHALL NOT list `/termos`.

Serves: understand-an-algorithm

#### Scenario: Listed pages

- **GIVEN** `NEXT_PUBLIC_SITE_URL` is `https://notasegura.example`
- **WHEN** a client requests `/sitemap.xml`
- **THEN** it contains exactly twenty-three `loc` entries in the order above
- **AND** no entry contains `/n/` or `/termos`
