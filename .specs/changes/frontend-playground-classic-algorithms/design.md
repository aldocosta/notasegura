# Design: frontend-playground-classic-algorithms

## Context

This change starts after `frontend-playground-modern-algorithms`: `AlgorithmId` has 18 ids, `CATEGORIES` and `actions.ts` exist, and `/algoritmos` lists by category.
César and Vigenère are pure functions in `cesar.ts` and `vigenere.ts`. They keep case, and they leave accented letters and other characters unchanged. `CryptoPlayground.tsx` shows "Deslocamento" only for César and "Palavra-chave" only for Vigenère.

## Decisions

### Decision: Ids, names, order, and labels

**Chosen:**

| id | Name | Kind | Safety | Category position |
| --- | --- | --- | --- | --- |
| `hex` | Hexadecimal | Codificação | Não é criptografia | after Base64 |
| `rot13` | ROT13 | Cifra clássica | Inseguro | after Cifra de César |
| `atbash` | Cifra Atbash | Cifra clássica | Inseguro | after ROT13 |
| `playfair` | Cifra de Playfair | Cifra clássica | Inseguro | after Cifra de Vigenère |
| `rail-fence` | Cerca de trilho | Cifra clássica | Inseguro | after Playfair |
| `enigma` | Máquina Enigma | Cifra clássica | Inseguro | after Cerca de trilho |
| `vernam` | Cifra de Vernam | Cifra clássica | Seguro | last |

The full `ALGORITHMS` order becomes: AES-256-GCM, ChaCha20-Poly1305, AES-256-CBC, AES-256-CTR, RSA-OAEP, SHA-256, SHA-512, SHA-1, MD5, HMAC-SHA-256, ECDSA, Ed25519, RSA-PSS, ECDH, PBKDF2, Base64, Hexadecimal, Cifra de César, ROT13, Cifra Atbash, Cifra de Vigenère, Cifra de Playfair, Cerca de trilho, Máquina Enigma, Cifra de Vernam.
The labels come from `actions.ts`: Hexadecimal uses "Codificar" and "Decodificar"; the ciphers use "Encriptar" and "Decifrar".

### Decision: Algorithm parameters

**Chosen:**

| Algorithm | Rule | Options | Output | Details | Way back |
| --- | --- | --- | --- | --- | --- |
| Hexadecimal | UTF-8 bytes, two lowercase hex digits per byte | — | `"olá"` → `6f6cc3a1` | none | `decrypt` |
| ROT13 | shift 13 for A–Z and a–z; other characters unchanged | — | `"Hello, World!"` → `Uryyb, Jbeyq!` | none | `decrypt` (ROT13 again) |
| Cifra Atbash | A↔Z, B↔Y… for A–Z and a–z; other characters unchanged | — | `"Abc, xyz!"` → `Zyx, cba!` | none | `decrypt` (Atbash again) |
| Cifra de Playfair | Text and keyword: remove accents (NFD), keep only A–Z, uppercase, J→I. Pairs: an X between two equal letters of a pair, and an X at the end when the length is odd. 5x5 grid from the keyword, then the rest of the alphabet without J. Same row: letter to the right; same column: letter below; otherwise: the corners of the rectangle | "Palavra-chave" (A–Z, required) | keyword `PLAYFAIREXAMPLE`, `"Hide the gold in the tree stump"` → `BMODZBXDNABEKUDMUIXMMOUVIF` | "Palavra-chave", "Grade" (five groups of five letters separated by spaces) | `decrypt` returns the prepared text (for the example: `HIDETHEGOLDINTHETREXESTUMP`) |
| Cerca de trilho | Zigzag over N rails, read rail by rail; all characters, including spaces | "Trilhos" (integer 2 to 10, default 3) | 3 rails, `"WEAREDISCOVEREDFLEEATONCE"` → `WECRLTEERDSOEEFEAOCAIVDEN` | "Trilhos" | `decrypt` (exact text) |
| Máquina Enigma | Enigma I, rotors I-II-III (left to right), reflector B, rings A-A-A, no plugboard; the rotors step before each letter, with the double step of the middle rotor; letters A–Z and a–z become uppercase; other characters unchanged and do not step the rotors | "Posição inicial" (three letters A–Z, default `AAA`) | `AAA`, `"AAAAA"` → `BDZGO` | "Posição inicial", "Rotores" (`I-II-III, refletor B`) | `decrypt`: the same machine from the same start (returns the letters in uppercase) |
| Cifra de Vernam | random key of the same length as the UTF-8 bytes (`crypto.getRandomValues`); XOR byte by byte | — | Base64 of the result | "Chave" (Base64) | `decrypt` |

Exported helpers for tests: `playfairGrid(keyword)`, `enigmaStep(positions)`, and `enigma(text, start)`.
For Playfair and the Enigma, the card shows a note below "Texto decifrado": "A Playfair remove espaços e acentos, troca J por I e insere X entre letras repetidas." and "A Enigma só tinha letras maiúsculas.".

**Rationale:** The examples are the classic published vectors. Each rule is the historical one, simplified only where the playground must accept any text.

### Decision: Inputs and validation

**Chosen:**

- "Palavra-chave" is shown for Vigenère and Playfair, with the Vigenère rule (only A–Z or a–z, not empty).
- "Trilhos" (`type="number"`, min 2, max 10) for the rail fence: "O número de trilhos deve ser um inteiro de 2 a 10."
- "Posição inicial" (`type="text"`, `maxLength` 3, default `AAA`) for the Enigma: "A posição inicial deve ter três letras de A a Z."
- Playfair: "O texto precisa ter pelo menos uma letra de A a Z." when the prepared text is empty.
- `EncryptOptions` gains `rails?: number` and `start?: string`.

### Decision: Summaries

**Chosen:**

- **Hexadecimal:** "Escreve cada byte com dois símbolos de 0 a 9 e de a até f. É muito usado para mostrar hashes e chaves. Não usa chave, então não protege nada."
- **ROT13:** "É a Cifra de César com deslocamento 13. Como o alfabeto tem 26 letras, aplicar o ROT13 duas vezes devolve o texto original."
- **Cifra Atbash:** "Troca a primeira letra do alfabeto pela última, a segunda pela penúltima, e assim por diante. Vem do alfabeto hebraico e não tem chave."
- **Cifra de Playfair:** "Cifra pares de letras com uma grade de 5 por 5 montada a partir de uma palavra-chave. Foi usada por militares britânicos, mas cai com a análise de frequência dos pares."
- **Cerca de trilho:** "Não troca nenhuma letra: escreve o texto em zigue-zague em alguns trilhos e lê trilho por trilho. É uma cifra de transposição, fácil de quebrar testando poucos números de trilhos."
- **Máquina Enigma:** "Máquina alemã da Segunda Guerra Mundial, com rotores que mudam a substituição a cada letra. Foi quebrada por matemáticos poloneses e britânicos, entre eles Alan Turing."
- **Cifra de Vernam:** "Combina o texto com uma chave aleatória do mesmo tamanho, usada uma única vez. Bem usada, é impossível de quebrar, mas é difícil entregar uma chave tão grande ao destinatário."

### Decision: Article content

**Chosen:** The structure, length, and tone of `frontend-algorithm-pages`. The terms in `code` must appear verbatim.

- **Hexadecimal** (related: `base64`, `sha-256`): base `16`, digits `0 a 9` and the letters a to f; each byte becomes two characters, so the text doubles in size (the `dobro`). Example: "olá" gives `6f6cc3a1`. Used to show a `hash`, keys, MAC addresses, and colors in `CSS` (`#ff0000`). Not protection.
- **ROT13** (related: `cesar`, `atbash`): `César` with shift `13`; applying it `duas vezes` returns the text. Example: "Hello" gives `Uryyb`. Used on `Usenet` in the 1980s to hide spoilers and joke answers.
- **Cifra Atbash** (related: `cesar`, `rot13`): from the `hebraico` alphabet (aleph↔tav); appears in the Book of `Jeremias`. It is a monoalphabetic `substituição` `sem chave`. Example: "Abc, xyz!" gives `Zyx, cba!`.
- **Cifra de Playfair** (related: `vigenere`, `enigma`): invented by Charles `Wheatstone` in `1854`, promoted by Lord Playfair; a `5x5` grid; it encrypts `pares` of letters. Example: `BMODZBXDNABEKUDMUIXMMOUVIF`. Used by the British army; in 1943, the crew of John F. `Kennedy` sent a rescue message in Playfair. Broken by frequency analysis of pairs.
- **Cerca de trilho** (related: `playfair`, `cesar`): a `transposição` cipher; the text goes in `zigue-zague` over the `trilhos`. Example: `WECRLTEERDSOEEFEAOCAIVDEN`. The letter `frequência` stays the same as the language, which shows that it is a transposition; few rail counts make it easy to test all.
- **Máquina Enigma** (related: `vigenere`, `vernam`): patented by Arthur `Scherbius` in 1918; `rotores`, a `refletor`, and a plugboard. The reflector means that a letter `nunca` becomes itself, a weakness used in the attacks. Marian `Rejewski` and the Polish cipher bureau broke it from 1932; Alan `Turing` and the bombe machines at `Bletchley Park` read it during the war. Example: `BDZGO`. The same settings decrypt.
- **Cifra de Vernam** (related: `vigenere`, `aes-gcm`): Gilbert Vernam, `1917`, at AT&T, with `XOR` on teleprinter tape. With a truly random key as long as the text, used `uma única vez`, Claude `Shannon` proved `sigilo perfeito` in 1949. Reusing the key is fatal: the American `Venona` project read Soviet messages because pads were reused. The Moscow–Washington hotline used one-time tapes.

## Risks

- **Enigma stepping errors.** Mitigation: tests for `BDZGO` and for the double step (`ADU` → `ADV` → `AEW` → `BFX` → `BFY`).
- **Playfair does not return the exact text.** Mitigation: the note below "Texto decifrado", and a test that checks the prepared text.
- **25 buttons on a phone.** Mitigation: the category groups wrap; the E2E test checks for horizontal scroll at 375px.
