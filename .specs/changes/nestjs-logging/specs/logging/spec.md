# Delta for Logging

## ADDED Requirements

### Requirement: Global Error Capture

The system SHALL persist an entry for every unhandled exception raised during request handling.

Serves: debug-production-incident

#### Scenario: Unhandled exception recorded

- **GIVEN** a request triggers an unhandled exception
- **WHEN** the global exception filter handles it
- **THEN** a log entry is persisted to MongoDB

### Requirement: Log Retention

Log entries SHALL be automatically removed after three months.

Serves: debug-production-incident

#### Scenario: Expired entry removed

- **GIVEN** a log entry older than three months
- **WHEN** MongoDB TTL cleanup runs
- **THEN** the entry is no longer present

### Requirement: Point-in-Time Logging

Any class SHALL be able to emit a log entry through the injectable logger.

Serves: debug-production-incident

#### Scenario: Service emits log

- **GIVEN** a service with the injectable logger
- **WHEN** it calls the logger
- **THEN** a log entry is persisted
```