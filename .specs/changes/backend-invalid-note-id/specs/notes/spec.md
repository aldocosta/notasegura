# Delta for Notes

## ADDED Requirements

### Requirement: Malformed note ID

For any `id` that is not a valid note ID, `GET /api/notes/:id` SHALL respond with HTTP 404 and the same body as for a well-formed ID that matches no note.
The response SHALL NOT be HTTP 500, and the request SHALL NOT change any stored note.

Serves: clear-answer-for-bad-links

#### Scenario: Literal undefined

- **GIVEN** the API is running
- **WHEN** a client requests `GET /api/notes/undefined`
- **THEN** the status is 404
- **AND** the body equals the body of `GET /api/notes/000000000000000000000000`

#### Scenario: Short ID

- **GIVEN** the API is running
- **WHEN** a client requests `GET /api/notes/abc`
- **THEN** the status is 404

#### Scenario: Non-hex ID of valid length

- **GIVEN** the API is running
- **WHEN** a client requests `GET /api/notes/zzzzzzzzzzzzzzzzzzzzzzzz`
- **THEN** the status is 404

#### Scenario: Malformed ID with passphrase

- **GIVEN** the API is running
- **WHEN** a client requests `GET /api/notes/abc?passphrase=x`
- **THEN** the status is 404

#### Scenario: Well-formed unknown ID

- **GIVEN** the API is running
- **WHEN** a client requests `GET /api/notes/000000000000000000000000`
- **THEN** the status is 404
