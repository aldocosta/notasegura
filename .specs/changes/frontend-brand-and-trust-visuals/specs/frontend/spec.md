# Delta for Frontend

## ADDED Requirements

### Requirement: Site logo

Every page that the site renders SHALL show the logo (symbol and wordmark) in the header as a link to `/` whose accessible name is "Nota Segura - BR".
The footer and the 404 page SHALL show the logo.
The site SHALL serve the symbol as its icon at `/icon.svg` with content type `image/svg+xml`, and every page SHALL reference it with a `link` element whose `rel` is `icon`.
The default Next.js icon SHALL NOT be served at `/favicon.ico`.

Serves: recognize-the-brand

#### Scenario: Header logo

- **GIVEN** any page, including `/`, `/sobre`, `/n/abc123`, and a path that the site does not define
- **WHEN** it is rendered
- **THEN** the header contains a link to `/` named "Nota Segura - BR"
- **AND** the link contains an `svg` and the visible text "Nota Segura" and "BR"

#### Scenario: Footer and 404 logo

- **GIVEN** a path that the site does not define
- **WHEN** it is rendered
- **THEN** the main content and the footer each contain the logo symbol

#### Scenario: Site icon

- **GIVEN** the site is running
- **WHEN** a client requests `/icon.svg`
- **THEN** the status is 200 and the content type starts with `image/svg+xml`
- **AND** the HTML of `/` contains a `link` with `rel="icon"` whose `href` starts with `/icon.svg`

#### Scenario: No default icon

- **GIVEN** the site is running
- **WHEN** a client requests `/favicon.ico`
- **THEN** the status is 404

### Requirement: Decorative graphics are hidden from assistive technology

Every logo symbol, icon, and decorative shape on the site SHALL be hidden from assistive technology, so that screen readers announce only text and accessible names.

Serves: recognize-the-brand, scan-trust-pages

#### Scenario: Hidden icons

- **GIVEN** any trust page or the header
- **WHEN** it is rendered
- **THEN** every `svg` element has `aria-hidden="true"`

### Requirement: Trust page layout

Each trust page (`/sobre`, `/privacidade`, `/termos`, `/contato`) SHALL open with a hero band that contains an icon, the page `h1`, and a lead sentence.
Each trust page SHALL show, below the hero, at least three highlight tiles, each with an icon, a bold title, and one short sentence.
Each content section with a heading SHALL show an icon next to its heading.
The previous guarantees SHALL still hold: one `h1`, at least three paragraphs of complete sentences in the server HTML, and no horizontal scrolling at 375px.

Serves: scan-trust-pages

#### Scenario: Hero and highlights

- **GIVEN** any trust page
- **WHEN** a client requests it without executing JavaScript
- **THEN** the HTML contains one `h1` inside an element marked as the hero
- **AND** it contains at least three highlight tiles, each with an `svg` and a title

#### Scenario: Section icons

- **GIVEN** the page `/privacidade`
- **WHEN** it is rendered
- **THEN** every `h2` has an icon next to it

#### Scenario: Mobile viewport

- **GIVEN** a viewport of 375 x 812 pixels
- **WHEN** the user opens any trust page
- **THEN** the document scroll width is not larger than the viewport width
- **AND** the highlight tiles are stacked in one column

#### Scenario: Desktop viewport

- **GIVEN** a viewport of 1280 x 800 pixels
- **WHEN** the user opens any trust page
- **THEN** the highlight tiles are shown side by side in one row

### Requirement: Contact call to action

When `NEXT_PUBLIC_CONTACT_EMAIL` is set, the page `/contato` SHALL show a button-styled link named "Enviar e-mail" whose `href` is `mailto:` followed by that address, in addition to the visible address.
When it is not set, the page SHALL NOT show the button.

Serves: scan-trust-pages

#### Scenario: Email configured

- **GIVEN** `NEXT_PUBLIC_CONTACT_EMAIL` is `contato@example.com`
- **WHEN** the page `/contato` is rendered
- **THEN** a link named "Enviar e-mail" has `href` `mailto:contato@example.com`

#### Scenario: Email not configured

- **GIVEN** `NEXT_PUBLIC_CONTACT_EMAIL` is not set
- **WHEN** the page `/contato` is rendered
- **THEN** no link named "Enviar e-mail" exists
