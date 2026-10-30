# Frontend Spec (Delta)

## ADDED Requirements

### Requirement: Call to action at the end of "Como funciona"
The "Como funciona" card on the home page MUST end with a button labeled exactly "Criar a primeira nota" that takes the user to the "Criar uma nota" form.

#### Scenario: Button is rendered at the end of the card
- Given the home page
- When it is rendered
- Then the `#como-funciona` section contains a link named "Criar a primeira nota"
- And it is the last interactive element of the card
- And its `href` is `#criar-nota`

#### Scenario: Clicking scrolls to the form
- Given the user is viewing the "Como funciona" card
- When the user clicks "Criar a primeira nota"
- Then the page smoothly scrolls to the section `#criar-nota` (heading "Criar uma nota")
- And the note textarea receives focus without an extra scroll jump

#### Scenario: Works without JavaScript
- Given JavaScript has not run
- When the user activates "Criar a primeira nota"
- Then the browser navigates to the `#criar-nota` anchor

#### Scenario: Responsive and accessible
- Given a mobile viewport (< 640px)
- Then the button spans the full card width
- Given a viewport of 640px or more
- Then the button has auto width
- And in every viewport the button is keyboard-focusable with a visible focus ring and follows the `button-primary` tokens

### Requirement: Order of the home sections
On the home page, the "Como funciona" card (`#como-funciona`) MUST come directly after the hero, and the "Criar uma nota" form section (`#criar-nota`) MUST come after the card, both in document order and on screen.

#### Scenario: Document order
- Given the home page
- When it is rendered
- Then `#como-funciona` precedes `#criar-nota` in document order

#### Scenario: Visual order
- Given the home page in a viewport of 375 x 812 or 1280 x 800 pixels
- When it is rendered
- Then the top of `#como-funciona` is above the top of `#criar-nota`
