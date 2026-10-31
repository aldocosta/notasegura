# Delta for Frontend

## ADDED Requirements

### Requirement: Unified privacy and terms page

The page `/privacidade` SHALL have exactly one `h1` with the text "Política de Privacidade e Termos de Uso".
The page SHALL contain two parts, in this order: a part with the `h2` "Política de Privacidade" in an element with the id `privacidade`, and a part with the `h2` "Termos de Uso" in an element with the id `termos`.
Before the first part, the page SHALL show a link to `#privacidade` and a link to `#termos`.
The page SHALL NOT contain a link to `/termos`.

Serves: one-place-for-the-rules

#### Scenario: Title and parts

- **GIVEN** the site is running
- **WHEN** a client requests `/privacidade` without executing JavaScript
- **THEN** the HTML contains one `h1` with the text "Política de Privacidade e Termos de Uso"
- **AND** the element with the id `privacidade` contains the `h2` "Política de Privacidade"
- **AND** the element with the id `termos` contains the `h2` "Termos de Uso"
- **AND** the privacy part comes before the terms part

#### Scenario: Links to both parts

- **GIVEN** the page `/privacidade`
- **WHEN** it is rendered
- **THEN** a link with `href` `#privacidade` and a link with `href` `#termos` come before the privacy part
- **AND** no link has `href` `/termos`

### Requirement: Terms of use disclosures

The terms part of the page `/privacidade` SHALL state, in pt-BR:

- that using the service means accepting these terms;
- that the user is responsible for the content sent and for the people who get the link;
- that sending illegal content, distributing malware, and applying scams are forbidden, and that the operator can block requests and remove notes on signs of abuse;
- that the operator cannot recover a forgotten passphrase, nor a note that expired, reached its view limit, or was deleted;
- that the service is free, provided as it is, without a guarantee of availability, and with liability limited as far as the law allows;
- that the laws of the Federative Republic of Brazil govern these terms;
- how to contact the operator, with a link to `/contato`.

Serves: one-place-for-the-rules

#### Scenario: Terms text

- **GIVEN** the page `/privacidade`
- **WHEN** it is rendered
- **THEN** the element with the id `termos` contains the texts "conteúdo ilegal", "malware", "no estado em que se encontra", and "República Federativa do Brasil"
- **AND** it contains a link to `/contato`

### Requirement: Legacy terms URL

A request to `/termos` SHALL receive a permanent redirect with HTTP status 308 to `/privacidade#termos`.

Serves: keep-old-links-working

#### Scenario: Redirect response

- **GIVEN** the site is running
- **WHEN** a client requests `/termos` without following redirects
- **THEN** the status is 308
- **AND** the `location` header ends with `/privacidade#termos`

#### Scenario: Browser lands on the terms

- **GIVEN** the site is running
- **WHEN** a browser opens `/termos`
- **THEN** the URL is `/privacidade#termos`
- **AND** the `h2` "Termos de Uso" is in the viewport

## MODIFIED Requirements

### Requirement: Trust pages

> Previously: the site served four trust pages, including `/termos`.

The site SHALL serve the pages `/sobre`, `/privacidade`, and `/contato` with HTTP 200.
Each page SHALL contain exactly one `h1` and at least three paragraphs of complete pt-BR sentences, and this text SHALL be present in the HTML that the server sends, before any JavaScript runs.
Each page SHALL fit a 375px-wide viewport without horizontal scrolling.

Serves: one-place-for-the-rules

#### Scenario: Page text without JavaScript

- **GIVEN** the site is running
- **WHEN** a client requests `/sobre`, `/privacidade`, or `/contato` without executing JavaScript
- **THEN** the response status is 200
- **AND** the HTML contains one `h1` and at least three non-empty `p` elements

#### Scenario: Mobile viewport

- **GIVEN** a viewport of 375 x 812 pixels
- **WHEN** the user opens any trust page
- **THEN** the document scroll width is not larger than the viewport width

### Requirement: Site navigation

> Previously: the footer had four links, with "Privacidade" and "Termos" as separate links.

Every page that the site renders SHALL show a header with a link to `/` and a footer with links named "Sobre", "Privacidade e Termos", and "Contato" that point to `/sobre`, `/privacidade`, and `/contato`.
The footer SHALL NOT contain a link to `/termos`.

Serves: one-place-for-the-rules

#### Scenario: Home page

- **GIVEN** the home page
- **WHEN** it is rendered
- **THEN** the header links to `/`
- **AND** the footer contains the three trust links with their paths

#### Scenario: Trust page

- **GIVEN** the page `/sobre`
- **WHEN** the user clicks the footer link "Privacidade e Termos"
- **THEN** the browser shows `/privacidade` with its `h1`

#### Scenario: Note page

- **GIVEN** the page `/n/{id}` for any `id`
- **WHEN** it is rendered
- **THEN** the header links to `/`
- **AND** the footer contains the three trust links

#### Scenario: Unknown page

- **GIVEN** a path that the site does not define
- **WHEN** it is rendered
- **THEN** the header and the footer are present

### Requirement: Sitemap

> Previously: the sitemap listed the home page and four trust pages, including `/termos`.

The site SHALL serve `/sitemap.xml` with HTTP 200.
It SHALL list exactly the home page and the three trust pages as absolute URLs on `NEXT_PUBLIC_SITE_URL`.
It SHALL NOT list any URL under `/n/`, and it SHALL NOT list `/termos`.

Serves: one-place-for-the-rules, keep-old-links-working

#### Scenario: Listed pages

- **GIVEN** `NEXT_PUBLIC_SITE_URL` is `https://notasegura.example`
- **WHEN** a client requests `/sitemap.xml`
- **THEN** it contains exactly four `loc` entries: `https://notasegura.example`, `https://notasegura.example/sobre`, `https://notasegura.example/privacidade`, and `https://notasegura.example/contato`
- **AND** no entry contains `/n/` or `/termos`

### Requirement: Main menu in the header

> Previously: the menu had four links, with "Privacidade" and "Termos" as separate links.

Every page that the site renders SHALL show, in its header, a navigation landmark named "Principal" with the links "Sobre" (`/sobre`), "Privacidade e Termos" (`/privacidade`), and "Contato" (`/contato`), in this order.
The link of the current page SHALL carry `aria-current="page"`, and no other link SHALL carry it.

Serves: one-place-for-the-rules

#### Scenario: Home page

- **GIVEN** the home page
- **WHEN** it is rendered
- **THEN** the "Principal" navigation contains the three links with their paths in order

#### Scenario: Trust page

- **GIVEN** the page `/privacidade`
- **WHEN** it is rendered
- **THEN** the "Privacidade e Termos" link in the "Principal" navigation has `aria-current="page"`
- **AND** the other two links do not have `aria-current`

#### Scenario: Note and unknown pages

- **GIVEN** the page `/n/abc123` or a path that the site does not define
- **WHEN** it is rendered
- **THEN** the "Principal" navigation contains the three links

### Requirement: Responsive main menu

> Previously: the requirement referred to four links.

From a viewport width of 640px, the three links SHALL be visible in the header without any user action.
Below 640px, the header SHALL show a button named "Menu" with `aria-expanded="false"`, and the links SHALL be hidden until the user activates the button.
When the menu is open, the button SHALL have `aria-expanded="true"`; activating the button again, pressing Escape, or following a link SHALL close it.

Serves: one-place-for-the-rules

#### Scenario: Desktop

- **GIVEN** a viewport of 1280 x 800 pixels
- **WHEN** the user opens any page
- **THEN** the three links are visible
- **AND** no "Menu" button is visible

#### Scenario: Mobile closed

- **GIVEN** a viewport of 375 x 812 pixels
- **WHEN** the user opens any page
- **THEN** the "Menu" button is visible with `aria-expanded="false"`
- **AND** the three links are not visible

#### Scenario: Mobile open and follow

- **GIVEN** a viewport of 375 x 812 pixels and the menu is open
- **WHEN** the user clicks "Sobre"
- **THEN** the browser shows `/sobre`
- **AND** the "Menu" button has `aria-expanded="false"`

#### Scenario: Mobile Escape

- **GIVEN** a viewport of 375 x 812 pixels and the menu is open
- **WHEN** the user presses Escape
- **THEN** the "Menu" button has `aria-expanded="false"` and has focus

#### Scenario: No horizontal scroll

- **GIVEN** a viewport of 375 x 812 pixels
- **WHEN** the menu is open or closed
- **THEN** the document scroll width is not larger than the viewport width

### Requirement: Trust page layout

> Previously: the layout applied to four trust pages, including `/termos`, and only `h2` headings carried icons.

Each trust page (`/sobre`, `/privacidade`, `/contato`) SHALL open with a hero band that contains an icon, the page `h1`, and a lead sentence.
Each trust page SHALL show, below the hero, at least three highlight tiles, each with an icon, a bold title, and one short sentence.
Each part heading and each content section heading (`h2` or `h3`) SHALL show an icon next to it.
The previous guarantees SHALL still hold: one `h1`, at least three paragraphs of complete sentences in the server HTML, and no horizontal scrolling at 375px.

Serves: one-place-for-the-rules

#### Scenario: Hero and highlights

- **GIVEN** any trust page
- **WHEN** a client requests it without executing JavaScript
- **THEN** the HTML contains one `h1` inside an element marked as the hero
- **AND** it contains at least three highlight tiles, each with an `svg` and a title

#### Scenario: Section icons

- **GIVEN** the page `/privacidade`
- **WHEN** it is rendered
- **THEN** every `h2` and every `h3` has an icon next to it

#### Scenario: Mobile viewport

- **GIVEN** a viewport of 375 x 812 pixels
- **WHEN** the user opens any trust page
- **THEN** the document scroll width is not larger than the viewport width
- **AND** the highlight tiles are stacked in one column

#### Scenario: Desktop viewport

- **GIVEN** a viewport of 1280 x 800 pixels
- **WHEN** the user opens any trust page
- **THEN** the highlight tiles are shown side by side in one row
