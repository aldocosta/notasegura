# Delta for Frontend

## ADDED Requirements

### Requirement: Playground card on the home page

The home page SHALL show a card with the `h2` "Teste os algoritmos" directly after the card "Criar uma nota".
The card SHALL contain a group named "Algoritmos" with exactly seven buttons, in this order: "AES-256-GCM", "AES-256-CBC", "RSA-OAEP", "SHA-256", "Base64", "Cifra de César", and "Cifra de Vigenère".
Exactly one button SHALL carry `aria-pressed="true"`; on first render it SHALL be "AES-256-GCM".
The server HTML of `/` SHALL contain the card heading, the seven buttons, and the explanation of AES-256-GCM.

Serves: try-the-algorithms, learn-what-is-safe

#### Scenario: Card position

- **GIVEN** the home page
- **WHEN** it is rendered
- **THEN** the section with the `h2` "Teste os algoritmos" comes after the section with the `h2` "Criar uma nota"

#### Scenario: Buttons and default

- **GIVEN** the home page
- **WHEN** a client requests `/` without executing JavaScript
- **THEN** the HTML contains the seven algorithm buttons in order
- **AND** "AES-256-GCM" has `aria-pressed="true"` and its explanation is present

#### Scenario: Mobile viewport

- **GIVEN** a viewport of 375 x 812 pixels
- **WHEN** the user opens `/`
- **THEN** the document scroll width is not larger than the viewport width

### Requirement: Algorithm explanation

When the visitor selects an algorithm, the card SHALL show its name, its type, a pt-BR explanation of at least two sentences, and a safety label.
The type SHALL be "Criptografia simétrica" for AES-256-GCM and AES-256-CBC, "Criptografia assimétrica" for RSA-OAEP, "Hash" for SHA-256, "Codificação" for Base64, and "Cifra clássica" for César and Vigenère.
The safety label SHALL be "Seguro" for AES-256-GCM, AES-256-CBC, and RSA-OAEP, "Não é criptografia" for SHA-256 and Base64, and "Inseguro" for César and Vigenère.
The explanation of AES-256-GCM SHALL state that it is the algorithm that Nota Segura - BR uses for the notes.

Serves: learn-what-is-safe

#### Scenario: Safe algorithm

- **GIVEN** the playground card
- **WHEN** the visitor selects "AES-256-GCM"
- **THEN** the card shows "Criptografia simétrica", the label "Seguro", and a text that states that the site uses it for the notes

#### Scenario: Not encryption

- **GIVEN** the playground card
- **WHEN** the visitor selects "Base64"
- **THEN** the card shows "Codificação" and the label "Não é criptografia"

#### Scenario: Unsafe algorithm

- **GIVEN** the playground card
- **WHEN** the visitor selects "Cifra de César"
- **THEN** the card shows "Cifra clássica" and the label "Inseguro"

### Requirement: Encrypt and show the result

When the visitor types a non-empty text of at most 500 characters and activates "Encriptar", the card SHALL show the result of the selected algorithm applied to that text, and the key and parameters used, as listed here:

- AES-256-GCM: the ciphertext in Base64, a new random 256-bit key in Base64, and a new random 12-byte IV in Base64.
- AES-256-CBC: the ciphertext in Base64, a new random 256-bit key in Base64, and a new random 16-byte IV in Base64.
- RSA-OAEP: the ciphertext in Base64 and the public key in Base64; the private key SHALL NOT be shown.
- SHA-256: the 64-character hexadecimal digest; no key.
- Base64: the Base64 encoding of the UTF-8 bytes of the text; no key.
- Cifra de César: the text with each letter A–Z and a–z shifted by the chosen shift (1 to 25, default 3); other characters unchanged.
- Cifra de Vigenère: the text with each letter A–Z and a–z shifted by the matching letter of the keyword; other characters unchanged.

Each activation of "Encriptar" with AES or RSA SHALL use a new key and a new IV, so that the same text gives a different result.
The result SHALL be announced to assistive technology.

Serves: try-the-algorithms

#### Scenario: AES result differs each time

- **GIVEN** the algorithm "AES-256-GCM" and the text "segredo"
- **WHEN** the visitor activates "Encriptar" twice
- **THEN** the two results are different
- **AND** each shows a key of 44 Base64 characters and an IV of 16 Base64 characters

#### Scenario: Hash result

- **GIVEN** the algorithm "SHA-256" and the text "abc"
- **WHEN** the visitor activates "Encriptar"
- **THEN** the result is `ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad`

#### Scenario: Base64 result

- **GIVEN** the algorithm "Base64" and the text "olá"
- **WHEN** the visitor activates "Encriptar"
- **THEN** the result is `b2zDoQ==`

#### Scenario: César result

- **GIVEN** the algorithm "Cifra de César", the shift 3, and the text "Abc, xyz!"
- **WHEN** the visitor activates "Encriptar"
- **THEN** the result is `Def, abc!`

#### Scenario: Vigenère result

- **GIVEN** the algorithm "Cifra de Vigenère", the keyword "LEMON", and the text "ATTACKATDAWN"
- **WHEN** the visitor activates "Encriptar"
- **THEN** the result is `LXFOPVEFRNHR`

#### Scenario: RSA hides the private key

- **GIVEN** the algorithm "RSA-OAEP" and the text "segredo"
- **WHEN** the visitor activates "Encriptar"
- **THEN** the card shows the ciphertext and a public key
- **AND** the card does not show a private key

### Requirement: Decrypt the result

After a result is shown for AES-256-GCM, AES-256-CBC, RSA-OAEP, Base64, César, or Vigenère, the card SHALL show a button "Decifrar".
Activating "Decifrar" SHALL show a text equal to the text that was encrypted.
For SHA-256, the card SHALL NOT show the button "Decifrar" and SHALL state that a hash cannot be reversed.

Serves: try-the-algorithms, learn-what-is-safe

#### Scenario: Round trip for each reversible algorithm

- **GIVEN** each of AES-256-GCM, AES-256-CBC, RSA-OAEP, Base64, Cifra de César, and Cifra de Vigenère, and the text "Olá, mundo! 123"
- **WHEN** the visitor activates "Encriptar" and then "Decifrar"
- **THEN** the decrypted text is "Olá, mundo! 123"

#### Scenario: Hash has no decrypt

- **GIVEN** the algorithm "SHA-256" and a shown result
- **WHEN** the card is rendered
- **THEN** no button "Decifrar" exists
- **AND** the card states that the hash cannot be reversed

### Requirement: Input validation

The card SHALL NOT produce a result, and SHALL show a pt-BR error message, when:

- the text is empty;
- the text has more than 500 characters;
- the algorithm is RSA-OAEP and the text has more than 190 bytes in UTF-8;
- the algorithm is Cifra de Vigenère and the keyword is empty or contains a character other than A–Z or a–z;
- the algorithm is Cifra de César and the shift is not an integer from 1 to 25.

Serves: try-the-algorithms

#### Scenario: Empty text

- **GIVEN** an empty text
- **WHEN** the visitor activates "Encriptar"
- **THEN** no result is shown and an error message is shown

#### Scenario: RSA text too long

- **GIVEN** the algorithm "RSA-OAEP" and a text of 191 ASCII characters
- **WHEN** the visitor activates "Encriptar"
- **THEN** no result is shown and the error message mentions the limit of 190 bytes

#### Scenario: RSA text at the limit

- **GIVEN** the algorithm "RSA-OAEP" and a text of 190 ASCII characters
- **WHEN** the visitor activates "Encriptar"
- **THEN** a result is shown

#### Scenario: Invalid Vigenère keyword

- **GIVEN** the algorithm "Cifra de Vigenère" and the keyword "chave1"
- **WHEN** the visitor activates "Encriptar"
- **THEN** no result is shown and an error message is shown

### Requirement: Playground stays on the device

The playground SHALL NOT send the typed text, the result, or any key over the network, and SHALL NOT create a note.

Serves: try-the-algorithms

#### Scenario: No request

- **GIVEN** the home page is loaded
- **WHEN** the visitor encrypts and decrypts a text with each of the seven algorithms
- **THEN** the browser sends no request to `/api/`
