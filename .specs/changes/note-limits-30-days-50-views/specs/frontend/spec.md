# Delta for Frontend

## ADDED Requirements

### Requirement: Create form limits

The create form on `/` SHALL let the user choose a lifetime from 1 to 30 days and a view limit from 1 to 50.
The form SHALL show both ranges next to the inputs.

Serves: longer-lifetime, more-readers

#### Scenario: Input ranges

- **GIVEN** the home page
- **WHEN** the page renders
- **THEN** the days input has a minimum of `1` and a maximum of `30`
- **AND** the views input has a minimum of `1` and a maximum of `50`

#### Scenario: Range labels

- **GIVEN** the home page
- **WHEN** the page renders
- **THEN** the days input label contains `1-30`
- **AND** the views input label contains `1-50`

### Requirement: Limits in page texts

Every page text that states the note limits SHALL state a maximum lifetime of 30 days and a maximum of 50 views.
No page SHALL state the old maximums of 7 days or 10 views.

Serves: longer-lifetime, more-readers

#### Scenario: How it works

- **GIVEN** the home page
- **WHEN** the "Como funciona" card renders
- **THEN** it states the ranges `1-30` for days and `1-50` for views

#### Scenario: About page

- **GIVEN** the page `/sobre`
- **WHEN** the page renders
- **THEN** it states a lifetime from 1 to 30 days and a view limit from 1 to 50

#### Scenario: Privacy page

- **GIVEN** the page `/privacidade`
- **WHEN** the page renders
- **THEN** it states that the expiry date is at most 30 days after the creation
- **AND** it does not contain `7 dias`
