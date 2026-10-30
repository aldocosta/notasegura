# Delta for Notes

## ADDED Requirements

### Requirement: Note lifetime and view limits

The system SHALL accept a `POST /api/notes` request whose `expiresInDays` is an integer from 1 to 30 and whose `maxViews` is an integer from 1 to 50.
The system SHALL reject a request whose `expiresInDays` or `maxViews` is outside these ranges with HTTP 400.
The system SHALL make the note unavailable `expiresInDays` days after its creation.

Serves: longer-lifetime, more-readers

#### Scenario: Maximum values

- **GIVEN** a create payload with `expiresInDays` equal to `30` and `maxViews` equal to `50`
- **WHEN** the client sends `POST /api/notes`
- **THEN** the response status is `201`

#### Scenario: Lifetime above the maximum

- **GIVEN** a create payload with `expiresInDays` equal to `31`
- **WHEN** the client sends `POST /api/notes`
- **THEN** the response status is `400`

#### Scenario: Views above the maximum

- **GIVEN** a create payload with `maxViews` equal to `51`
- **WHEN** the client sends `POST /api/notes`
- **THEN** the response status is `400`

#### Scenario: Values below the minimum

- **GIVEN** a create payload with `expiresInDays` equal to `0`, or with `maxViews` equal to `0`
- **WHEN** the client sends `POST /api/notes`
- **THEN** the response status is `400`

#### Scenario: Expiry date of a 30-day note

- **GIVEN** a note created with `expiresInDays` equal to `30`
- **WHEN** the note is stored
- **THEN** its expiry date is 30 days after its creation
