# Delta for Frontend

## ADDED Requirements

### Requirement: Trust pages

The site SHALL serve the pages `/sobre`, `/privacidade`, `/termos`, and `/contato` with HTTP 200.
Each page SHALL contain exactly one `h1` and at least three paragraphs of complete pt-BR sentences, and this text SHALL be present in the HTML that the server sends, before any JavaScript runs.
Each page SHALL fit a 375px-wide viewport without horizontal scrolling.

Serves: trust-the-operator, fund-the-free-service

#### Scenario: Page text without JavaScript

- **GIVEN** the site is running
- **WHEN** a client requests `/sobre`, `/privacidade`, `/termos`, or `/contato` without executing JavaScript
- **THEN** the response status is 200
- **AND** the HTML contains one `h1` and at least three non-empty `p` elements

#### Scenario: Mobile viewport

- **GIVEN** a viewport of 375 x 812 pixels
- **WHEN** the user opens any trust page
- **THEN** the document scroll width is not larger than the viewport width

### Requirement: Site navigation

Every page that the site renders SHALL show a header with a link to `/` and a footer with links named "Sobre", "Privacidade", "Termos", and "Contato" that point to `/sobre`, `/privacidade`, `/termos`, and `/contato`.

Serves: trust-the-operator

#### Scenario: Home page

- **GIVEN** the home page
- **WHEN** it is rendered
- **THEN** the header links to `/`
- **AND** the footer contains the four trust links with their paths

#### Scenario: Trust page

- **GIVEN** the page `/termos`
- **WHEN** the user clicks the footer link "Privacidade"
- **THEN** the browser shows `/privacidade` with its `h1`

#### Scenario: Note page

- **GIVEN** the page `/n/{id}` for any `id`
- **WHEN** it is rendered
- **THEN** the header links to `/`
- **AND** the footer contains the four trust links

#### Scenario: Unknown page

- **GIVEN** a path that the site does not define
- **WHEN** it is rendered
- **THEN** the header and the footer are present

### Requirement: Privacy policy disclosures

The page `/privacidade` SHALL state, in pt-BR:

- that the site requires no account;
- which data the site stores: the encrypted note, its expiry date, and its view count, until the expiry date, also when the note is consumed earlier;
- that a consumed note can no longer be opened;
- that the site never stores the passphrase in clear text;
- that only notes protected by a passphrase cannot be decrypted by the operator;
- that the site keeps the visitor IP address for a short time to limit request rates;
- that third-party vendors, including Google, use cookies to serve ads based on the visitor's prior visits to this site or other sites;
- that Google's advertising cookies let Google and its partners serve ads based on those visits;
- how the visitor can opt out of personalized advertising, with links to `https://adssettings.google.com/` and `https://www.aboutads.info/`;
- the visitor's rights under the LGPD and how to contact the operator.

Serves: trust-the-operator, fund-the-free-service

#### Scenario: Advertising disclosure

- **GIVEN** the page `/privacidade`
- **WHEN** it is rendered
- **THEN** the text mentions "cookies" and "Google"
- **AND** it contains a link to `https://adssettings.google.com/` and a link to `https://www.aboutads.info/`

#### Scenario: Data disclosure

- **GIVEN** the page `/privacidade`
- **WHEN** it is rendered
- **THEN** the text states that the passphrase is not stored in clear text
- **AND** the text mentions "LGPD"
- **AND** the page links to `/contato`

### Requirement: Contact method

When `NEXT_PUBLIC_CONTACT_EMAIL` is set, the page `/contato` SHALL show a `mailto:` link to that address.
When it is not set, the page SHALL NOT render a `mailto:` link.

Serves: trust-the-operator

#### Scenario: Email configured

- **GIVEN** `NEXT_PUBLIC_CONTACT_EMAIL` is `contato@example.com`
- **WHEN** the page `/contato` is rendered
- **THEN** it contains a link with `href` `mailto:contato@example.com` and the visible text `contato@example.com`

#### Scenario: Email not configured

- **GIVEN** `NEXT_PUBLIC_CONTACT_EMAIL` is not set
- **WHEN** the page `/contato` is rendered
- **THEN** it contains no link whose `href` starts with `mailto:`

### Requirement: AdSense code on content pages only

When `NEXT_PUBLIC_ADSENSE_CLIENT` holds a valid client ID (`ca-pub-` followed by 16 digits), the server HTML of the home page and of each trust page SHALL include the AdSense script for that client ID and a `meta` element named `google-adsense-account` with that client ID.
The server HTML of the note page and of the 404 page SHALL NOT include either of them.
When `NEXT_PUBLIC_ADSENSE_CLIENT` is not set or is not valid, no page SHALL include either of them.

Serves: fund-the-free-service, keep-notes-private

#### Scenario: Content page with client ID

- **GIVEN** `NEXT_PUBLIC_ADSENSE_CLIENT` is `ca-pub-1234567890123456`
- **WHEN** a client requests `/` or `/privacidade` without executing JavaScript
- **THEN** the HTML contains a `script` whose `src` starts with `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456`
- **AND** the HTML contains `<meta name="google-adsense-account" content="ca-pub-1234567890123456">`

#### Scenario: Note page with client ID

- **GIVEN** `NEXT_PUBLIC_ADSENSE_CLIENT` is `ca-pub-1234567890123456`
- **WHEN** a client requests `/n/abc123`
- **THEN** the HTML contains no `adsbygoogle.js` script and no `google-adsense-account` meta element

#### Scenario: Unknown page with client ID

- **GIVEN** `NEXT_PUBLIC_ADSENSE_CLIENT` is `ca-pub-1234567890123456`
- **WHEN** a client requests a path that the site does not define
- **THEN** the HTML contains no `adsbygoogle.js` script and no `google-adsense-account` meta element

#### Scenario: No client ID

- **GIVEN** `NEXT_PUBLIC_ADSENSE_CLIENT` is not set
- **WHEN** a client requests `/`
- **THEN** the HTML contains no `adsbygoogle.js` script and no `google-adsense-account` meta element

#### Scenario: Invalid client ID

- **GIVEN** `NEXT_PUBLIC_ADSENSE_CLIENT` is `pub-123`
- **WHEN** a client requests `/`
- **THEN** the HTML contains no `adsbygoogle.js` script and no `google-adsense-account` meta element

### Requirement: Crawler access

The site SHALL serve `/robots.txt` with HTTP 200.
It SHALL allow `/` and disallow `/n/` and `/api/` for every crawler, with an explicit group for `Mediapartners-Google` in addition to the `*` group.
It SHALL reference the sitemap at `{NEXT_PUBLIC_SITE_URL}/sitemap.xml`.
The note page SHALL carry `<meta name="robots" content="noindex, nofollow">`.

Serves: keep-notes-private, fund-the-free-service

#### Scenario: Generic crawler

- **GIVEN** the site is running
- **WHEN** a client requests `/robots.txt`
- **THEN** the group for `User-Agent: *` contains `Allow: /`, `Disallow: /n/`, and `Disallow: /api/`

#### Scenario: AdSense crawler

- **GIVEN** the site is running
- **WHEN** a client requests `/robots.txt`
- **THEN** a group for `User-Agent: Mediapartners-Google` contains `Allow: /`, `Disallow: /n/`, and `Disallow: /api/`

#### Scenario: Sitemap reference

- **GIVEN** `NEXT_PUBLIC_SITE_URL` is `https://notasegura.example`
- **WHEN** a client requests `/robots.txt`
- **THEN** it contains `Sitemap: https://notasegura.example/sitemap.xml`

#### Scenario: Note page not indexed

- **GIVEN** the page `/n/abc123`
- **WHEN** a client requests it without executing JavaScript
- **THEN** the HTML contains `<meta name="robots" content="noindex, nofollow">`

### Requirement: Sitemap

The site SHALL serve `/sitemap.xml` with HTTP 200.
It SHALL list exactly the home page and the four trust pages as absolute URLs on `NEXT_PUBLIC_SITE_URL`.
It SHALL NOT list any URL under `/n/`.

Serves: fund-the-free-service, keep-notes-private

#### Scenario: Listed pages

- **GIVEN** `NEXT_PUBLIC_SITE_URL` is `https://notasegura.example`
- **WHEN** a client requests `/sitemap.xml`
- **THEN** it contains exactly five `loc` entries: `https://notasegura.example`, `https://notasegura.example/sobre`, `https://notasegura.example/privacidade`, `https://notasegura.example/termos`, and `https://notasegura.example/contato`
- **AND** no entry contains `/n/`

### Requirement: ads.txt

When `NEXT_PUBLIC_ADSENSE_CLIENT` holds a valid client ID, the site SHALL serve `/ads.txt` with HTTP 200, content type `text/plain`, and the line `google.com, pub-{16 digits}, DIRECT, f08c47fec0942fa0`, where the digits are those of the client ID.
When the client ID is not set or is not valid, `/ads.txt` SHALL return HTTP 404.

Serves: fund-the-free-service

#### Scenario: Client ID configured

- **GIVEN** `NEXT_PUBLIC_ADSENSE_CLIENT` is `ca-pub-1234567890123456`
- **WHEN** a client requests `/ads.txt`
- **THEN** the status is 200, the content type starts with `text/plain`, and the body is `google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0` followed by a newline

#### Scenario: Client ID not configured

- **GIVEN** `NEXT_PUBLIC_ADSENSE_CLIENT` is not set
- **WHEN** a client requests `/ads.txt`
- **THEN** the status is 404

#### Scenario: Client ID invalid

- **GIVEN** `NEXT_PUBLIC_ADSENSE_CLIENT` is `ca-pub-12AB`
- **WHEN** a client requests `/ads.txt`
- **THEN** the status is 404

### Requirement: Not found page

For any path that the site does not define, the site SHALL respond with HTTP 404 and a pt-BR page that explains that the page does not exist and links to `/`.

Serves: trust-the-operator, fund-the-free-service

#### Scenario: Unknown path

- **GIVEN** the site is running
- **WHEN** a client requests `/pagina-que-nao-existe`
- **THEN** the status is 404
- **AND** the page contains the text "Página não encontrada" and a link to `/`
