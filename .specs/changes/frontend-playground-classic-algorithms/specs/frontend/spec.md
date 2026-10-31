# Delta for Frontend

## ADDED Requirements

### Requirement: Classic cipher inputs

The card SHALL show "Palavra-chave" only for Vigenère and Playfair, "Trilhos" only for Cerca de trilho (default 3), and "Posição inicial" only for Máquina Enigma (default `AAA`).
After "Decifrar", the card SHALL show, below "Texto decifrado", "A Playfair remove espaços e acentos, troca J por I e insere X entre letras repetidas." for Playfair, and "A Enigma só tinha letras maiúsculas." for the Enigma.

Serves: try-classic-ciphers

#### Scenario: Enigma field

- **GIVEN** the playground card
- **WHEN** the visitor selects "Máquina Enigma"
- **THEN** the field "Posição inicial" has the value `AAA`
- **AND** the fields "Trilhos" and "Palavra-chave" do not exist

#### Scenario: Playfair note

- **GIVEN** the algorithm "Cifra de Playfair", the keyword `PLAYFAIREXAMPLE`, and the text "Hide the gold in the tree stump"
- **WHEN** the visitor activates "Encriptar" and then "Decifrar"
- **THEN** "Texto decifrado" shows `HIDETHEGOLDINTHETREXESTUMP` and the Playfair note

## MODIFIED Requirements

### Requirement: Playground card on the home page

> Previously: eighteen buttons; "Codificação" had Base64 only, and "Cifras clássicas" had César and Vigenère.

The home page SHALL show a card with the `h2` "Teste os algoritmos" directly after the card "Criar uma nota".
The card SHALL contain a group named "Algoritmos" with twenty-five buttons. Inside it, the buttons SHALL be in one group per category, named and labeled, in this order:

- "Criptografia": "AES-256-GCM", "ChaCha20-Poly1305", "AES-256-CBC", "AES-256-CTR", "RSA-OAEP";
- "Hash": "SHA-256", "SHA-512", "SHA-1", "MD5";
- "Autenticação e assinatura": "HMAC-SHA-256", "ECDSA", "Ed25519", "RSA-PSS";
- "Troca e derivação de chaves": "ECDH", "PBKDF2";
- "Codificação": "Base64", "Hexadecimal";
- "Cifras clássicas": "Cifra de César", "ROT13", "Cifra Atbash", "Cifra de Vigenère", "Cifra de Playfair", "Cerca de trilho", "Máquina Enigma", "Cifra de Vernam".

Exactly one button SHALL carry `aria-pressed="true"`; on first render it SHALL be "AES-256-GCM".
The server HTML of `/` SHALL contain the card heading, the twenty-five buttons, and the explanation of AES-256-GCM.

Serves: try-classic-ciphers

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

> Previously: types and safety labels for eighteen algorithms.

When the visitor selects an algorithm, the card SHALL show its name, its type, a pt-BR explanation of at least two sentences, and a safety label.
The types SHALL be: "Criptografia simétrica" for AES-256-GCM, ChaCha20-Poly1305, AES-256-CBC, and AES-256-CTR; "Criptografia assimétrica" for RSA-OAEP; "Hash" for SHA-256, SHA-512, SHA-1, and MD5; "Autenticação de mensagem" for HMAC-SHA-256; "Assinatura digital" for ECDSA, Ed25519, and RSA-PSS; "Troca de chaves" for ECDH; "Derivação de chave" for PBKDF2; "Codificação" for Base64 and Hexadecimal; "Cifra clássica" for César, ROT13, Atbash, Vigenère, Playfair, Cerca de trilho, Máquina Enigma, and Vernam.
The safety labels SHALL be: "Inseguro" for SHA-1, MD5, César, ROT13, Atbash, Vigenère, Playfair, Cerca de trilho, and Máquina Enigma; "Não é criptografia" for SHA-256, SHA-512, Base64, and Hexadecimal; "Seguro" for all the others, including Cifra de Vernam.
The explanation of AES-256-GCM SHALL state that it is the algorithm that Nota Segura - BR uses for the notes.

Serves: try-classic-ciphers, understand-an-algorithm

#### Scenario: Enigma

- **GIVEN** the playground card
- **WHEN** the visitor selects "Máquina Enigma"
- **THEN** the card shows "Cifra clássica" and the label "Inseguro"

#### Scenario: Vernam

- **GIVEN** the playground card
- **WHEN** the visitor selects "Cifra de Vernam"
- **THEN** the card shows "Cifra clássica" and the label "Seguro"

### Requirement: Encrypt and show the result

> Previously: results for eighteen algorithms.

The labels and limits of `frontend-playground-modern-algorithms` SHALL still apply.
For the seven new algorithms, the card SHALL show the result and the details listed in `design.md` (Decision: Algorithm parameters).

Serves: try-classic-ciphers

#### Scenario: Enigma result

- **GIVEN** the algorithm "Máquina Enigma", the start `AAA`, and the text "AAAAA"
- **WHEN** the visitor activates "Encriptar"
- **THEN** the result is `BDZGO`

#### Scenario: Playfair result

- **GIVEN** the algorithm "Cifra de Playfair", the keyword `PLAYFAIREXAMPLE`, and the text "Hide the gold in the tree stump"
- **WHEN** the visitor activates "Encriptar"
- **THEN** the result is `BMODZBXDNABEKUDMUIXMMOUVIF`

#### Scenario: Rail fence result

- **GIVEN** the algorithm "Cerca de trilho", 3 rails, and the text "WEAREDISCOVEREDFLEEATONCE"
- **WHEN** the visitor activates "Encriptar"
- **THEN** the result is `WECRLTEERDSOEEFEAOCAIVDEN`

#### Scenario: Hexadecimal result

- **GIVEN** the algorithm "Hexadecimal" and the text "olá"
- **WHEN** the visitor activates "Codificar"
- **THEN** the result is `6f6cc3a1`

#### Scenario: Vernam key length

- **GIVEN** the algorithm "Cifra de Vernam" and the text "segredo"
- **WHEN** the visitor activates "Encriptar"
- **THEN** the "Chave" detail decodes to 7 bytes

### Requirement: Decrypt the result

> Previously: the way back for eighteen algorithms.

After a result is shown for any algorithm in "Criptografia", ECDH, or "Cifras clássicas", the card SHALL show "Decifrar". For "Codificação", it SHALL show "Decodificar".
The way back SHALL show the original text, except for Playfair (the prepared text) and the Enigma (the text with the letters in uppercase).
For a hash, the card SHALL show no way back and SHALL state that a hash cannot be reversed.

Serves: try-classic-ciphers

#### Scenario: Exact round trip

- **GIVEN** each of Hexadecimal, ROT13, Cifra Atbash, Cerca de trilho, and Cifra de Vernam, and the text "Olá, mundo! 123"
- **WHEN** the visitor activates the action button and then the way-back button
- **THEN** the shown text is "Olá, mundo! 123"

#### Scenario: Enigma round trip

- **GIVEN** the algorithm "Máquina Enigma", the start `QWE`, and the text "Ataque ao amanhecer"
- **WHEN** the visitor activates "Encriptar" and then "Decifrar"
- **THEN** "Texto decifrado" shows "ATAQUE AO AMANHECER"

### Requirement: Input validation

> Previously: rules for the text, RSA-OAEP, Vigenère, and César.

The card SHALL NOT produce a result, and SHALL show a pt-BR error message, when:

- the text is empty ("Escreva um texto.", or "Escreva uma senha." for PBKDF2);
- the text has more than 500 characters;
- the algorithm is RSA-OAEP and the text has more than 190 bytes in UTF-8;
- the algorithm is Cifra de Vigenère or Cifra de Playfair and the keyword is empty or contains a character other than A–Z or a–z;
- the algorithm is Cifra de Playfair and the text has no letter A–Z after removing accents;
- the algorithm is Cifra de César and the shift is not an integer from 1 to 25;
- the algorithm is Cerca de trilho and the number of rails is not an integer from 2 to 10;
- the algorithm is Máquina Enigma and the start is not three letters A–Z or a–z.

Serves: try-classic-ciphers

#### Scenario: Bad Enigma start

- **GIVEN** the algorithm "Máquina Enigma" and the start "A1"
- **WHEN** the visitor activates "Encriptar"
- **THEN** no result is shown and "A posição inicial deve ter três letras de A a Z." is shown

#### Scenario: Bad rail count

- **GIVEN** the algorithm "Cerca de trilho" and 11 rails
- **WHEN** the visitor activates "Encriptar"
- **THEN** no result is shown and "O número de trilhos deve ser um inteiro de 2 a 10." is shown

### Requirement: Algorithm article pages

> Previously: eighteen algorithm ids.

For each of the twenty-five algorithm ids (the eighteen of `frontend-playground-modern-algorithms` and `hex`, `rot13`, `atbash`, `playfair`, `rail-fence`, `enigma`, `vernam`), the site SHALL serve `/algoritmos/<id>` with HTTP 200.
The page SHALL contain one `h1` "<name>: o que é e como funciona", and the document title SHALL be "<name>: o que é e como funciona | Nota Segura - BR".
The page SHALL show three highlight tiles with the type, the safety label, and the key of the algorithm.
The page SHALL contain six `h2` sections in this order: "O que é", "Como funciona", "Exemplo", "Onde é usado", "Pontos fortes e fracos", and "Quando usar".
The article text SHALL have from 450 to 1100 words, SHALL be in the server HTML, and SHALL state the facts listed for that algorithm in the `design.md` of the change that added it.
The page SHALL have a meta description of 70 to 160 characters.

Serves: understand-an-algorithm

#### Scenario: Enigma article without JavaScript

- **GIVEN** the id `enigma`
- **WHEN** a client requests `/algoritmos/enigma` without executing JavaScript
- **THEN** the status is 200 and the HTML contains one `h1` "Máquina Enigma: o que é e como funciona"
- **AND** the HTML contains "Bletchley Park"

### Requirement: Sitemap

> Previously: the sitemap listed eighteen algorithm pages.

The site SHALL serve `/sitemap.xml` with HTTP 200.
It SHALL list exactly, in this order, the home page, the three trust pages, `/algoritmos`, and the twenty-five algorithm pages in the playground order, as absolute URLs on `NEXT_PUBLIC_SITE_URL`.
It SHALL NOT list any URL under `/n/`, and it SHALL NOT list `/termos`.

Serves: understand-an-algorithm

#### Scenario: Listed pages

- **GIVEN** `NEXT_PUBLIC_SITE_URL` is `https://notasegura.example`
- **WHEN** a client requests `/sitemap.xml`
- **THEN** it contains exactly thirty `loc` entries in the order above
- **AND** no entry contains `/n/` or `/termos`
