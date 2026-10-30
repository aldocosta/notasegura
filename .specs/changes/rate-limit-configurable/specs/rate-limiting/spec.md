# Delta for Rate Limiting

## ADDED Requirements

### Requirement: Rate limit configuration

The maximum number of `POST /api/notes` requests per IP in one window SHALL equal `RATE_LIMIT_CREATE_MAX`, and the window length in seconds SHALL equal `RATE_LIMIT_WINDOW_SECONDS`.
When a variable is not set, the system SHALL use 60 for the maximum and 60 for the window.
When a variable is set to a value that is not a positive integer, the system SHALL NOT start, and it SHALL report the variable name in the error.

Serves: higher-default-limit, reliable-test-runs, tunable-abuse-protection

#### Scenario: Defaults

- **GIVEN** neither variable is set
- **WHEN** one IP sends 61 `POST /api/notes` requests in one window
- **THEN** the first 60 are processed normally
- **AND** the 61st gets HTTP 429 with a `Retry-After` header

#### Scenario: Higher limit

- **GIVEN** `RATE_LIMIT_CREATE_MAX` is `70`
- **WHEN** one IP sends 70 `POST /api/notes` requests in one window
- **THEN** none of them gets HTTP 429

#### Scenario: Lower limit

- **GIVEN** `RATE_LIMIT_CREATE_MAX` is `2`
- **WHEN** one IP sends 3 `POST /api/notes` requests in one window
- **THEN** the 3rd gets HTTP 429

#### Scenario: Custom window

- **GIVEN** `RATE_LIMIT_WINDOW_SECONDS` is `120`
- **WHEN** a request exceeds the limit
- **THEN** the `Retry-After` value is between 1 and 120

#### Scenario: Invalid value

- **GIVEN** `RATE_LIMIT_CREATE_MAX` is `0`, `-1`, `1.5`, or `abc`
- **WHEN** the system starts
- **THEN** it does not start
- **AND** the error message contains `RATE_LIMIT_CREATE_MAX`

#### Scenario: Invalid window

- **GIVEN** `RATE_LIMIT_WINDOW_SECONDS` is `0`
- **WHEN** the system starts
- **THEN** it does not start
- **AND** the error message contains `RATE_LIMIT_WINDOW_SECONDS`
