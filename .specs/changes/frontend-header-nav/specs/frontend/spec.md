# Delta for Frontend

## ADDED Requirements

### Requirement: Main menu in the header

Every page that the site renders SHALL show, in its header, a navigation landmark named "Principal" with the links "Como funciona" (`/#como-funciona`), "Sobre" (`/sobre`), "Privacidade" (`/privacidade`), "Termos" (`/termos`), and "Contato" (`/contato`), in this order.
The link of the current page SHALL carry `aria-current="page"`, and no other link SHALL carry it.

Serves: find-pages-from-the-top

#### Scenario: Home page

- **GIVEN** the home page
- **WHEN** it is rendered
- **THEN** the "Principal" navigation contains the five links with their paths in order

#### Scenario: Trust page

- **GIVEN** the page `/privacidade`
- **WHEN** it is rendered
- **THEN** the "Privacidade" link in the "Principal" navigation has `aria-current="page"`
- **AND** the other four links do not have `aria-current`

#### Scenario: Note and unknown pages

- **GIVEN** the page `/n/abc123` or a path that the site does not define
- **WHEN** it is rendered
- **THEN** the "Principal" navigation contains the five links

#### Scenario: Navigation to how it works

- **GIVEN** the page `/termos`
- **WHEN** the user clicks "Como funciona" in the "Principal" navigation
- **THEN** the browser shows the home page with the `#como-funciona` section in the viewport

### Requirement: Responsive main menu

From a viewport width of 640px, the five links SHALL be visible in the header without any user action.
Below 640px, the header SHALL show a button named "Menu" with `aria-expanded="false"`, and the links SHALL be hidden until the user activates the button.
When the menu is open, the button SHALL have `aria-expanded="true"`; activating the button again, pressing Escape, or following a link SHALL close it.

Serves: find-pages-from-the-top

#### Scenario: Desktop

- **GIVEN** a viewport of 1280 x 800 pixels
- **WHEN** the user opens any page
- **THEN** the five links are visible
- **AND** no "Menu" button is visible

#### Scenario: Mobile closed

- **GIVEN** a viewport of 375 x 812 pixels
- **WHEN** the user opens any page
- **THEN** the "Menu" button is visible with `aria-expanded="false"`
- **AND** the five links are not visible

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
