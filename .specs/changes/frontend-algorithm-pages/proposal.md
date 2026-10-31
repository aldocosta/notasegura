# Proposal: frontend-algorithm-pages

## Intent

The site has about four indexable pages, and most of their text is the tool, institutional text, or legal text.
AdSense reviewers reject sites with little original content, and the content pages are the only place where ads are acceptable.
The playground on `/` explains each algorithm in one paragraph, and the server HTML contains only the explanation of AES-256-GCM.
One page for each algorithm, with a long pt-BR explanation, adds original educational content on its own URL.

## User Stories

### Story: understand-an-algorithm

As a visitor, I want a full page about one algorithm, with how it works, an example, where it is used, and its weak points, so that I understand it without other sources.

### Story: find-the-algorithm-pages

As a visitor, I want to reach the algorithm pages from the menu and from the playground, so that I can read more about the algorithm that I just tried.

### Story: choose-what-protects-a-secret

As a visitor, I want each page to say clearly when the algorithm protects a secret and when it does not, so that I do not trust Base64, a hash, or a classic cipher with a secret.

## Scope

**In scope:**

- A page `/algoritmos` that introduces encryption, hashing, and encoding, and lists the seven algorithms with links.
- One page for each algorithm at `/algoritmos/<id>`, with `<id>` from `ALGORITHMS`: `aes-gcm`, `aes-cbc`, `rsa-oaep`, `sha-256`, `base64`, `cesar`, and `vigenere`.
- Each algorithm page: a hero, three highlight tiles, six fixed sections of pt-BR text (450 to 1100 words in total), the playground with that algorithm selected, two related algorithm links, and a link to create a note.
- The link "Algoritmos" (`/algoritmos`) as the first item of the main menu in the header.
- In the playground card: a link "Saiba mais sobre <name>" to the page of the selected algorithm, and a link "Ver todos os algoritmos" to `/algoritmos`.
- The eight new URLs in `/sitemap.xml`.
- A correction of the RSA-OAEP summary in the playground: OAEP is for encryption; RSA signatures use PSS.
- Unit and E2E tests, including the updates of the existing menu and sitemap tests that this change requires.

**Out of scope:**

- Removing AdSense from `/`. This is a separate decision.
- A guides or blog section.
- New algorithms, or changes to how the playground encrypts.
- Changes to the footer. The footer keeps the three trust links.
- Structured data (JSON-LD), images, or translations.
- Backend changes.

## Approach

The article text lives in TypeScript modules, one per algorithm, next to the playground data, so that one test can check the structure, the word count, and the required facts of every article.
The pages are server components, prerendered with `generateStaticParams`, so the full text is in the server HTML.
They reuse `TrustPage` and `TrustSection` for the hero, the highlight tiles, and the sections, and they live in the `(site)` group, so they carry the AdSense code like the other content pages.

## Resolved Questions

- 2026-10-30 Scope: only the algorithm pages. Guides and the removal of AdSense from `/` are not in this change. Decided with the user.
- 2026-10-30 Discovery: the link "Algoritmos" goes first in the main menu, and the playground card links to the pages. The footer does not change. Decided with the user.
- 2026-10-30 RSA-OAEP summary: correct it in this change, because OAEP does not sign data. Decided with the user.
- 2026-10-30 URL of each page: the `AlgorithmId` (for example `/algoritmos/cesar`), because the ids are already short, kebab-case, and stable.
