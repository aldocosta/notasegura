# Delta for Rate Limiting

## ADDED Requirements

### Requirement: Create Rate Limit

The system SHALL allow at most 10 requests per minute from a single IP address to POST /api/notes.
The system SHALL return HTTP 429 with a Retry-After header when the limit is exceeded.
The system SHALL reset the counter after 60 seconds.

Serves: fair-usage, client-feedback

#### Scenario: Under limit

- **GIVEN** an IP has made 9 requests to POST /api/notes in the current minute
- **WHEN** a 10th request arrives
- **THEN** the request is processed normally

#### Scenario: Over limit

- **GIVEN** an IP has made 10 requests to POST /api/notes in the current minute
- **WHEN** an 11th request arrives
- **THEN** the response is 429 with a Retry-After header

### Requirement: Client IP Resolution

The system SHALL resolve the client IP from the request using Express req.ip.
When TRUST_PROXY is configured, the system SHALL trust the configured proxy and resolve the client IP from X-Forwarded-For.
When TRUST_PROXY is not configured, the system SHALL use the socket address.

Serves: fair-usage

#### Scenario: Direct request

- **GIVEN** TRUST_PROXY is not configured
- **WHEN** a request arrives directly
- **THEN** the rate limit uses the socket address

#### Scenario: Proxied request

- **GIVEN** TRUST_PROXY is configured for the reverse proxy
- **WHEN** a request arrives through the proxy with X-Forwarded-For
- **THEN** the rate limit uses the client IP from X-Forwarded-For

### Requirement: Health Check Exemption

The system SHALL NOT apply rate limiting to GET /api/health.

Serves: fair-usage

#### Scenario: Unlimited health checks

- **GIVEN** an IP has made 100 requests to GET /api/health
- **WHEN** another health check arrives
- **THEN** the response is 200

### Requirement: Rate Limit Persistence

The system SHALL persist rate limit counters in MongoDB.
The system SHALL remove expired counters automatically via TTL.

Serves: fair-usage

#### Scenario: Counter persists

- **GIVEN** an IP has made 5 requests to POST /api/notes
- **WHEN** the counter is queried in MongoDB
- **THEN** the count is 5

#### Scenario: Expired counter removed

- **GIVEN** a rate limit counter older than 60 seconds
- **WHEN** MongoDB TTL cleanup runs
- **THEN** the counter is no longer present
