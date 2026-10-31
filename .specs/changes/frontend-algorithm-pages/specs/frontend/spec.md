# Delta for Frontend

## ADDED Requirements

### Requirement: Algorithm index page

The site SHALL serve `/algoritmos` with HTTP 200 and one `h1` "Algoritmos de criptografia".
The server HTML SHALL contain an introduction of at least three paragraphs that explains encryption, hashing, and encoding.
The page SHALL list the seven algorithms of the playground in the playground order. Each item SHALL show the name, the type, the safety label, the short explanation, and a link "Ler sobre <name>" to `/algoritmos/<id>`.

Serves: find-the-algorithm-pages, choose-what-protects-a-secret

#### Scenario: Index without JavaScript

- **GIVEN** the site is running
- **WHEN** a client requests `/algoritmos` without executing JavaScript
- **THEN** the status is 200 and the HTML contains one `h1`
- **AND** the HTML contains links to `/algoritmos/aes-gcm`, `/algoritmos/aes-cbc`, `/algoritmos/rsa-oaep`, `/algoritmos/sha-256`, `/algoritmos/base64`, `/algoritmos/cesar`, and `/algoritmos/vigenere`, in this order

#### Scenario: Safety labels on the index

- **GIVEN** the page `/algoritmos`
- **WHEN** it is rendered
- **THEN** the item "Cifra de César" shows "Inseguro", the item "Base64" shows "Não é criptografia", and the item "AES-256-GCM" shows "Seguro"

### Requirement: Algorithm article pages

For each algorithm id (`aes-gcm`, `aes-cbc`, `rsa-oaep`, `sha-256`, `base64`, `cesar`, `vigenere`), the site SHALL serve `/algoritmos/<id>` with HTTP 200.
The page SHALL contain one `h1` "<name>: o que é e como funciona", and the document title SHALL be "<name>: o que é e como funciona | Nota Segura - BR".
The page SHALL show three highlight tiles with the type, the safety label, and the key of the algorithm.
The page SHALL contain six `h2` sections in this order: "O que é", "Como funciona", "Exemplo", "Onde é usado", "Pontos fortes e fracos", and "Quando usar".
The article text SHALL have from 450 to 1100 words, SHALL be in the server HTML, and SHALL state the facts listed for that algorithm in `design.md` (Decision: Article content).
The page SHALL have a meta description of 70 to 160 characters.

Serves: understand-an-algorithm, choose-what-protects-a-secret

#### Scenario: Article without JavaScript

- **GIVEN** the id `cesar`
- **WHEN** a client requests `/algoritmos/cesar` without executing JavaScript
- **THEN** the status is 200 and the HTML contains one `h1` "Cifra de César: o que é e como funciona"
- **AND** the HTML contains the six section titles in order
- **AND** the HTML contains "Def, abc!"

#### Scenario: Unsafe algorithm is labeled

- **GIVEN** the page `/algoritmos/vigenere`
- **WHEN** it is rendered
- **THEN** the highlight tiles show "Cifra clássica" and "Inseguro"

#### Scenario: Site algorithm is named

- **GIVEN** the page `/algoritmos/aes-gcm`
- **WHEN** it is rendered
- **THEN** the text states that the Nota Segura - BR uses AES-256-GCM for the notes

#### Scenario: Mobile viewport

- **GIVEN** a viewport of 375 x 812 pixels
- **WHEN** the user opens `/algoritmos` or any `/algoritmos/<id>`
- **THEN** the document scroll width is not larger than the viewport width

### Requirement: Playground on the article page

Each article page SHALL show the playground card with the algorithm of the page selected on first render (`aria-pressed="true"`).
The playground SHALL keep all the behavior of the home page playground.

Serves: understand-an-algorithm

#### Scenario: Preselected algorithm

- **GIVEN** the page `/algoritmos/base64`
- **WHEN** the user types "olá" and activates "Encriptar"
- **THEN** the button "Base64" has `aria-pressed="true"`
- **AND** the result is `b2zDoQ==`

### Requirement: Related links on the article page

Each article page SHALL show a section "Veja também" with the links "Ler sobre <name>" to the two related algorithms and the link "Todos os algoritmos" to `/algoritmos`.
Each article page SHALL show the link "Criar uma nota" to `/#criar-nota`.
An article page SHALL NOT link to itself from "Veja também".

Serves: understand-an-algorithm, find-the-algorithm-pages

#### Scenario: Related links

- **GIVEN** the page `/algoritmos/cesar`
- **WHEN** the user clicks "Ler sobre Cifra de Vigenère"
- **THEN** the browser shows `/algoritmos/vigenere`

#### Scenario: Link to the product

- **GIVEN** any article page
- **WHEN** it is rendered
- **THEN** a link "Criar uma nota" points to `/#criar-nota`

### Requirement: Unknown algorithm path

A request for `/algoritmos/<value>`, where `<value>` is not one of the seven ids, SHALL return HTTP 404.

Serves: find-the-algorithm-pages

#### Scenario: Unknown id

- **GIVEN** the site is running
- **WHEN** a client requests `/algoritmos/rot13`
- **THEN** the status is 404

### Requirement: Learn-more links in the playground

The playground card SHALL show, below the explanation, a link "Saiba mais sobre <name>" to `/algoritmos/<id>` of the selected algorithm, and a link "Ver todos os algoritmos" to `/algoritmos`.
The link "Saiba mais sobre <name>" SHALL NOT be shown when the current page is `/algoritmos/<id>` of the selected algorithm.

Serves: find-the-algorithm-pages

#### Scenario: Link follows the selection

- **GIVEN** the home page
- **WHEN** the user selects "Cifra de César" and clicks "Saiba mais sobre Cifra de César"
- **THEN** the browser shows `/algoritmos/cesar`
- **AND** the button "Cifra de César" has `aria-pressed="true"`

#### Scenario: Default link in the server HTML

- **GIVEN** the site is running
- **WHEN** a client requests `/` without executing JavaScript
- **THEN** the HTML contains a link to `/algoritmos/aes-gcm` and a link to `/algoritmos`

#### Scenario: No link to the current page

- **GIVEN** the page `/algoritmos/cesar` with "Cifra de César" selected
- **WHEN** it is rendered
- **THEN** no link "Saiba mais sobre Cifra de César" exists

### Requirement: Correct RSA-OAEP explanation

The playground explanation of RSA-OAEP SHALL NOT state that OAEP is used to sign data. It SHALL state that RSA signatures use the PSS padding.

Serves: choose-what-protects-a-secret

#### Scenario: RSA text

- **GIVEN** the playground card
- **WHEN** the visitor selects "RSA-OAEP"
- **THEN** the explanation contains "PSS"

### Requirement: AdSense code on the algorithm pages

`/algoritmos` and every `/algoritmos/<id>` SHALL carry the AdSense code and the `google-adsense-account` meta when `NEXT_PUBLIC_ADSENSE_CLIENT` is valid, like the other content pages.

Serves: understand-an-algorithm

#### Scenario: Ads code present

- **GIVEN** `NEXT_PUBLIC_ADSENSE_CLIENT` is `ca-pub-1234567890123456`
- **WHEN** a client requests `/algoritmos` or `/algoritmos/aes-gcm`
- **THEN** the HTML contains the `adsbygoogle.js` script for that client and the `google-adsense-account` meta

## MODIFIED Requirements

### Requirement: Sitemap

> Previously: the sitemap listed exactly the home page and the three trust pages.

The site SHALL serve `/sitemap.xml` with HTTP 200.
It SHALL list exactly, in this order, the home page, the three trust pages, `/algoritmos`, and the seven algorithm pages in the playground order, as absolute URLs on `NEXT_PUBLIC_SITE_URL`.
It SHALL NOT list any URL under `/n/`, and it SHALL NOT list `/termos`.

Serves: find-the-algorithm-pages

#### Scenario: Listed pages

- **GIVEN** `NEXT_PUBLIC_SITE_URL` is `https://notasegura.example`
- **WHEN** a client requests `/sitemap.xml`
- **THEN** it contains exactly twelve `loc` entries: `https://notasegura.example`, `/sobre`, `/privacidade`, `/contato`, `/algoritmos`, `/algoritmos/aes-gcm`, `/algoritmos/aes-cbc`, `/algoritmos/rsa-oaep`, `/algoritmos/sha-256`, `/algoritmos/base64`, `/algoritmos/cesar`, and `/algoritmos/vigenere`, each on `https://notasegura.example`
- **AND** no entry contains `/n/` or `/termos`

### Requirement: Main menu in the header

> Previously: the menu had three links: "Sobre", "Privacidade e Termos", and "Contato".

Every page that the site renders SHALL show, in its header, a navigation landmark named "Principal" with the links "Algoritmos" (`/algoritmos`), "Sobre" (`/sobre`), "Privacidade e Termos" (`/privacidade`), and "Contato" (`/contato`), in this order.
The link whose path equals the current path SHALL carry `aria-current="page"`, and no other link SHALL carry it.

Serves: find-the-algorithm-pages

#### Scenario: Home page

- **GIVEN** the home page
- **WHEN** it is rendered
- **THEN** the "Principal" navigation contains the four links with their paths in order

#### Scenario: Index page

- **GIVEN** the page `/algoritmos`
- **WHEN** it is rendered
- **THEN** the "Algoritmos" link has `aria-current="page"`
- **AND** the other three links do not have `aria-current`

#### Scenario: Article page

- **GIVEN** the page `/algoritmos/cesar`
- **WHEN** it is rendered
- **THEN** no link in the "Principal" navigation has `aria-current`

#### Scenario: Trust page

- **GIVEN** the page `/privacidade`
- **WHEN** it is rendered
- **THEN** the "Privacidade e Termos" link has `aria-current="page"`
- **AND** the other three links do not have `aria-current`

#### Scenario: Note and unknown pages

- **GIVEN** the page `/n/abc123` or a path that the site does not define
- **WHEN** it is rendered
- **THEN** the "Principal" navigation contains the four links

### Requirement: Responsive main menu

> Previously: the requirement referred to three links.

From a viewport width of 640px, the four links SHALL be visible in the header without any user action.
Below 640px, the header SHALL show a button named "Menu" with `aria-expanded="false"`, and the links SHALL be hidden until the user activates the button.
When the menu is open, the button SHALL have `aria-expanded="true"`; activating the button again, pressing Escape, or following a link SHALL close it.

Serves: find-the-algorithm-pages

#### Scenario: Desktop

- **GIVEN** a viewport of 1280 x 800 pixels
- **WHEN** the user opens any page
- **THEN** the four links are visible
- **AND** no "Menu" button is visible

#### Scenario: Tablet

- **GIVEN** a viewport of 640 x 800 pixels
- **WHEN** the user opens `/`
- **THEN** the four links are visible
- **AND** the document scroll width is not larger than the viewport width

#### Scenario: Mobile closed

- **GIVEN** a viewport of 375 x 812 pixels
- **WHEN** the user opens any page
- **THEN** the "Menu" button is visible with `aria-expanded="false"`
- **AND** the four links are not visible

#### Scenario: Mobile open and follow

- **GIVEN** a viewport of 375 x 812 pixels and the menu is open
- **WHEN** the user clicks "Algoritmos"
- **THEN** the browser shows `/algoritmos`
- **AND** the "Menu" button has `aria-expanded="false"`

#### Scenario: No horizontal scroll

- **GIVEN** a viewport of 375 x 812 pixels
- **WHEN** the menu is open or closed
- **THEN** the document scroll width is not larger than the viewport width
