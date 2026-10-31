# Delta for Frontend

## ADDED Requirements

### Requirement: Guide index page

The site SHALL serve `/guias` with HTTP 200.
The page SHALL contain one `h1` "Guias de criptografia e segurança", at least two paragraphs of introduction, and two lists named "Comparações" and "Guias práticos".
"Comparações" SHALL list the four comparison guides and "Guias práticos" the four practical guides, in the order of `design.md` (Decision: Guide content). Each item SHALL be a link, named with the guide title, to `/guias/<slug>`.
This text SHALL be in the HTML that the server sends, before any JavaScript runs.

Serves: choose-between-algorithms, protect-a-secret-in-practice, find-the-content

#### Scenario: Index without JavaScript

- **GIVEN** the site is running
- **WHEN** a client requests `/guias` without executing JavaScript
- **THEN** the status is 200 and the HTML contains one `h1`
- **AND** the HTML contains the links to the eight guides in order

### Requirement: Guide pages

For each of the eight guide slugs, the site SHALL serve `/guias/<slug>` with HTTP 200.
The page SHALL contain one `h1` with the guide title, and the document title SHALL be "<title> | Nota Segura - BR".
The page SHALL show three highlight tiles and the guide sections as `h2` headings, each with an icon.
A comparison guide SHALL have the sections "Resumo", "Como cada um funciona", "Comparação lado a lado", "Quando escolher cada um", and "Conclusão", in this order. A practical guide SHALL have from four to eight sections, and the first one SHALL be "Resumo".
The guide text SHALL have from 600 to 1400 words, SHALL be in pt-BR, SHALL be in the server HTML, and SHALL state the facts listed for that guide in `design.md` (Decision: Guide content).
The page SHALL have a meta description of 70 to 160 characters.

Serves: choose-between-algorithms, protect-a-secret-in-practice

#### Scenario: Guide without JavaScript

- **GIVEN** the slug `como-enviar-uma-senha-com-seguranca`
- **WHEN** a client requests `/guias/como-enviar-uma-senha-com-seguranca` without executing JavaScript
- **THEN** the status is 200 and the HTML contains one `h1` "Como enviar uma senha com segurança"
- **AND** the HTML contains "outro canal"

#### Scenario: Comparison sections

- **GIVEN** the slug `aes-gcm-ou-chacha20-poly1305`
- **WHEN** the page is rendered
- **THEN** its section `h2` headings are the five comparison titles in order

### Requirement: Comparison table

Each comparison guide SHALL show, in its section "Comparação lado a lado", a `table` with a `caption`, a header row of `th` cells with `scope="col"` whose first cell is "Critério", at least four body rows whose first cell is a `th` with `scope="row"`, and one cell for each column in every row.
The table SHALL NOT make the page wider than a 375px viewport.

Serves: choose-between-algorithms

#### Scenario: Table structure

- **GIVEN** the page `/guias/sha-256-sha-1-ou-md5`
- **WHEN** it is rendered
- **THEN** the table has the caption, the column headers "Critério", "MD5", "SHA-1", and "SHA-256", and at least four rows

#### Scenario: Mobile viewport

- **GIVEN** a viewport of 375 x 812 pixels
- **WHEN** the user opens any guide page
- **THEN** the document scroll width is not larger than the viewport width

### Requirement: Links on the guide page

Each guide page SHALL show a section "Algoritmos citados" with the links "Ler sobre <name>" to `/algoritmos/<id>` for each algorithm that the guide cites.
Each guide page SHALL show a section "Outros guias" with links, named with the guide titles, to its two related guides, and the link "Todos os guias" to `/guias`.
Each guide page SHALL show the link "Criar uma nota" to `/#criar-nota`.
A guide page SHALL NOT link to itself from "Outros guias".

Serves: choose-between-algorithms, protect-a-secret-in-practice, find-the-content

#### Scenario: Cited algorithm

- **GIVEN** the page `/guias/aes-gcm-ou-chacha20-poly1305`
- **WHEN** the user clicks "Ler sobre ChaCha20-Poly1305"
- **THEN** the browser shows `/algoritmos/chacha20-poly1305`

### Requirement: Unknown guide path

A request to `/guias/<slug>` with a slug that is not a guide SHALL receive HTTP 404.

Serves: find-the-content

#### Scenario: Unknown slug

- **GIVEN** the site is running
- **WHEN** a client requests `/guias/nao-existe`
- **THEN** the status is 404

### Requirement: Guides on the algorithm pages

Each algorithm page SHALL show, in "Veja também", after the links to the two related algorithms, one link "Ler o guia: <title>" to `/guias/<slug>` for each guide that cites the algorithm, in the order of the guides and at most three.
The page `/algoritmos` SHALL show the link "Ver todos os guias" to `/guias`.

Serves: find-the-content

#### Scenario: Algorithm cited by guides

- **GIVEN** the page `/algoritmos/aes-gcm`
- **WHEN** it is rendered
- **THEN** "Veja também" contains the links "Ler o guia: AES-256-GCM ou ChaCha20-Poly1305: qual escolher?", "Ler o guia: Criptografia, hash ou codificação: qual é a diferença?", and "Ler o guia: Como enviar uma senha com segurança", in this order

#### Scenario: Algorithm not cited

- **GIVEN** the page `/algoritmos/rot13`
- **WHEN** it is rendered
- **THEN** "Veja também" contains no link "Ler o guia: …"

### Requirement: Breadcrumb

Each algorithm page and each guide page SHALL show, in its hero, a navigation landmark named "Trilha de navegação" with the items "Início" (link to `/`), "Algoritmos" (link to `/algoritmos`) or "Guias" (link to `/guias`), and the page name, in this order.
The last item SHALL NOT be a link and SHALL carry `aria-current="page"`.

Serves: find-the-content

#### Scenario: Algorithm breadcrumb

- **GIVEN** the page `/algoritmos/cesar`
- **WHEN** the user clicks "Algoritmos" in "Trilha de navegação"
- **THEN** the browser shows `/algoritmos`

### Requirement: Canonical URL and sharing metadata

The pages `/sobre`, `/privacidade`, `/contato`, `/algoritmos`, `/guias`, every `/algoritmos/<id>`, and every `/guias/<slug>` SHALL have, in the server HTML:

- a `link rel="canonical"` with the absolute URL of the page on `NEXT_PUBLIC_SITE_URL`;
- the Open Graph tags `og:title`, `og:description`, `og:url` (the same absolute URL), `og:site_name` "Nota Segura - BR", `og:locale` "pt_BR", and `og:type` ("article" on the algorithm and guide pages, "website" on the others);
- the tag `twitter:card` with the value "summary_large_image".

Every page that the site renders SHALL have an `og:image` with an absolute URL.

Serves: find-the-content

#### Scenario: Guide metadata

- **GIVEN** `NEXT_PUBLIC_SITE_URL` is `https://notasegura.example`
- **WHEN** a client requests `/guias/como-guardar-senhas`
- **THEN** the canonical URL and `og:url` are `https://notasegura.example/guias/como-guardar-senhas`
- **AND** `og:type` is "article" and `twitter:card` is "summary_large_image"

#### Scenario: Home image

- **GIVEN** `NEXT_PUBLIC_SITE_URL` is `https://notasegura.example`
- **WHEN** a client requests `/`
- **THEN** the HTML has an `og:image` that starts with `https://notasegura.example/opengraph-image`

### Requirement: Share images

The site SHALL serve a PNG share image of 1200 x 630 pixels for the whole site at `/opengraph-image`, for each algorithm page at `/algoritmos/<id>/opengraph-image`, and for each guide page at `/guias/<slug>/opengraph-image`.
The image of an algorithm page SHALL show the algorithm name, and the image of a guide page SHALL show the guide title.
The `og:image` of each algorithm page and each guide page SHALL point to its own image.

Serves: find-the-content

#### Scenario: Image response

- **GIVEN** the site is running
- **WHEN** a client requests `/algoritmos/aes-gcm/opengraph-image`
- **THEN** the status is 200 and the content type is `image/png`

### Requirement: Structured data

Each algorithm page and each guide page SHALL contain, in the server HTML, a `script type="application/ld+json"` with a schema.org `Article` whose `headline` equals the page `h1`, with `description`, `inLanguage` "pt-BR", `datePublished`, `dateModified`, the absolute `url` of the page, the absolute URL of its share image as `image`, and the organization "Nota Segura - BR" as `author` and `publisher`.
Each algorithm page, each guide page, `/algoritmos`, and `/guias` SHALL contain a schema.org `BreadcrumbList` whose items match the breadcrumb of the page, with absolute URLs and positions starting at 1.
The JSON-LD text SHALL NOT contain the character `<`.

Serves: find-the-content

#### Scenario: Enigma article data

- **GIVEN** `NEXT_PUBLIC_SITE_URL` is `https://notasegura.example`
- **WHEN** a client requests `/algoritmos/enigma` without executing JavaScript
- **THEN** the JSON-LD contains an `Article` with the `headline` "Máquina Enigma: o que é e como funciona" and the `url` `https://notasegura.example/algoritmos/enigma`
- **AND** a `BreadcrumbList` with the items "Início", "Algoritmos", and "Máquina Enigma"

### Requirement: AdSense code on the guide pages

The guide index and each guide page SHALL carry the AdSense code, like the other content pages.

Serves: find-the-content

#### Scenario: Guide page code

- **GIVEN** `NEXT_PUBLIC_ADSENSE_CLIENT` is `ca-pub-1234567890123456`
- **WHEN** a client requests `/guias` or `/guias/rsa-ou-curvas-elipticas`
- **THEN** the HTML contains the `adsbygoogle.js` script for that client and the `google-adsense-account` meta tag

## MODIFIED Requirements

### Requirement: Main menu in the header

> Previously: the menu had four links: "Algoritmos", "Sobre", "Privacidade e Termos", and "Contato".

Every page that the site renders SHALL show, in its header, a navigation landmark named "Principal" with the links "Algoritmos" (`/algoritmos`), "Guias" (`/guias`), "Sobre" (`/sobre`), "Privacidade e Termos" (`/privacidade`), and "Contato" (`/contato`), in this order.
The link whose path equals the current path SHALL carry `aria-current="page"`, and no other link SHALL carry it.

Serves: find-the-content

#### Scenario: Home page

- **GIVEN** the home page
- **WHEN** it is rendered
- **THEN** the "Principal" navigation contains the five links with their paths in order

#### Scenario: Index page

- **GIVEN** the page `/algoritmos`
- **WHEN** it is rendered
- **THEN** the "Algoritmos" link has `aria-current="page"`
- **AND** the other four links do not have `aria-current`

#### Scenario: Guide index page

- **GIVEN** the page `/guias`
- **WHEN** it is rendered
- **THEN** the "Guias" link has `aria-current="page"`
- **AND** the other four links do not have `aria-current`

#### Scenario: Article and guide pages

- **GIVEN** the page `/algoritmos/cesar` or `/guias/como-guardar-senhas`
- **WHEN** it is rendered
- **THEN** no link in the "Principal" navigation has `aria-current`

#### Scenario: Trust page

- **GIVEN** the page `/privacidade`
- **WHEN** it is rendered
- **THEN** the "Privacidade e Termos" link has `aria-current="page"`
- **AND** the other four links do not have `aria-current`

#### Scenario: Note and unknown pages

- **GIVEN** the page `/n/abc123` or a path that the site does not define
- **WHEN** it is rendered
- **THEN** the "Principal" navigation contains the five links

### Requirement: Responsive main menu

> Previously: the requirement referred to four links, and the links were visible from 640px.

From a viewport width of 768px, the five links SHALL be visible in the header, in one line, without any user action.
Below 768px, the header SHALL show a button named "Menu" with `aria-expanded="false"`, and the links SHALL be hidden until the user activates the button.
When the menu is open, the button SHALL have `aria-expanded="true"`; activating the button again, pressing Escape, or following a link SHALL close it.

Serves: find-the-content

#### Scenario: Desktop

- **GIVEN** a viewport of 1280 x 800 pixels
- **WHEN** the user opens any page
- **THEN** the five links are visible
- **AND** no "Menu" button is visible

#### Scenario: Tablet

- **GIVEN** a viewport of 768 x 1024 pixels
- **WHEN** the user opens `/`
- **THEN** the five links are visible in one line
- **AND** the document scroll width is not larger than the viewport width

#### Scenario: Small tablet

- **GIVEN** a viewport of 640 x 800 pixels
- **WHEN** the user opens `/`
- **THEN** the "Menu" button is visible with `aria-expanded="false"`
- **AND** the document scroll width is not larger than the viewport width

#### Scenario: Mobile closed

- **GIVEN** a viewport of 375 x 812 pixels
- **WHEN** the user opens any page
- **THEN** the "Menu" button is visible with `aria-expanded="false"`
- **AND** the five links are not visible

#### Scenario: Mobile open and follow

- **GIVEN** a viewport of 375 x 812 pixels and the menu is open
- **WHEN** the user clicks "Guias"
- **THEN** the browser shows `/guias`
- **AND** the "Menu" button has `aria-expanded="false"`

#### Scenario: No horizontal scroll

- **GIVEN** a viewport of 375 x 812 pixels
- **WHEN** the menu is open or closed
- **THEN** the document scroll width is not larger than the viewport width

### Requirement: Sitemap

> Previously: the sitemap listed the home page, the three trust pages, `/algoritmos`, and twenty-five algorithm pages.

The site SHALL serve `/sitemap.xml` with HTTP 200.
It SHALL list exactly, in this order, the home page, the three trust pages, `/algoritmos`, the twenty-five algorithm pages in the playground order, `/guias`, and the eight guide pages in the order of the guide index, as absolute URLs on `NEXT_PUBLIC_SITE_URL`.
It SHALL NOT list any URL under `/n/`, and it SHALL NOT list `/termos`.

Serves: find-the-content

#### Scenario: Listed pages

- **GIVEN** `NEXT_PUBLIC_SITE_URL` is `https://notasegura.example`
- **WHEN** a client requests `/sitemap.xml`
- **THEN** it contains exactly thirty-nine `loc` entries in the order above
- **AND** no entry contains `/n/` or `/termos`
