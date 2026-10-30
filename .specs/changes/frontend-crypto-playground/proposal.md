# Proposal: frontend-crypto-playground

## Intent

The home page explains how a note works, but it does not show what encryption does to a text.
Visitors who are curious about encryption have nothing to try, and the page has little content of its own.
A card below "Criar uma nota" must let the visitor choose an algorithm, read a short explanation, type a text, and see the encrypted result.

## User Stories

### Story: try-the-algorithms

As a visitor, I want to choose an encryption algorithm, type a text, and see how it looks encrypted, so that I understand what protects my notes.

### Story: learn-what-is-safe

As a visitor, I want a short explanation of each algorithm, including which ones are not safe for secrets, so that I trust the algorithm that the site uses for my notes.

## Scope

**In scope:**

- A card "Teste os algoritmos" on `/`, directly below the card "Criar uma nota".
- Seven algorithm buttons: AES-256-GCM, AES-256-CBC, RSA-OAEP, SHA-256, Base64, Cifra de César, and Cifra de Vigenère.
- For the selected algorithm: its name, its type, a short pt-BR explanation, and a safety label.
- A text box and a button "Encriptar" that show the result, the key and the parameters used, and a button "Decifrar" that returns the original text when the algorithm can be reversed.
- Extra inputs where the algorithm needs them: the shift for César and the keyword for Vigenère.
- Unit and E2E tests.

**Out of scope:**

- Creating a real note from the card. The card is a demonstration only and saves nothing.
- Backend changes.
- Algorithms that the browser cannot run without a new dependency (for example ChaCha20).
- Decryption of a text that the visitor pastes from elsewhere.

## Approach

All seven algorithms run in the visitor's browser, so the text never leaves the device and the demo does not count toward the create rate limit.
AES, RSA, and SHA-256 use the browser's built-in cryptography; Base64, César, and Vigenère are small pure functions.
One module per algorithm shares a common interface, and a client component renders the buttons, the explanation, and the result.

## Resolved Questions

- 2026-10-30 Algorithms: AES-256-GCM, AES-256-CBC, RSA-OAEP, SHA-256, Base64, Cifra de César, and Cifra de Vigenère. Decided with the user.
- 2026-10-30 Result: show the result, the key and the parameters used, and a button "Decifrar" when the algorithm can be reversed. Decided with the user.
- 2026-10-30 The card is a demonstration only; it does not create a note. Decided with the user.
- 2026-10-30 Where the algorithms run: in the visitor's browser, for every algorithm. Decided with the user.
