# Frontend Spec (Delta)

## ADDED Requirements

### Requirement: Call to action at the end of "Como funciona"
The "Como funciona" card on the home page MUST end with a button labeled exactly "Criar 1 Nota" that takes the user to the "Criar uma nota" form.

#### Scenario: Button is rendered at the end of the card
- Given the home page
- When it is rendered
- Then the `#como-funciona` section contains a link named "Criar 1 Nota"
- And it is the last interactive element of the card
- And its `href` is `#criar-nota`

#### Scenario: Clicking scrolls to the form
- Given the user is viewing the "Como funciona" card
- When the user clicks "Criar 1 Nota"
- Then the page smoothly scrolls to the section `#criar-nota` (heading "Criar uma nota")
- And the note textarea receives focus without an extra scroll jump

#### Scenario: Works without JavaScript
- Given JavaScript has not run
- When the user activates "Criar 1 Nota"
- Then the browser navigates to the `#criar-nota` anchor

#### Scenario: Responsive and accessible
- Given a mobile viewport (< 640px)
- Then the button spans the full card width
- Given a viewport of 640px or more
- Then the button has auto width
- And in every viewport the button is keyboard-focusable with a visible focus ring and follows the `button-primary` tokens
