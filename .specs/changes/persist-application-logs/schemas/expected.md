# Expected Schema Changes: Persist Application Logs

## MongoDB

### Added

- Collection `application_logs`: documents of kind `request` and kind `error`. Shared fields are `occurredAt` (date), `kind` (string), `method` (string), `route` (string, template only), and `status` (number). A `request` document also has `durationMs` (number). An `error` document also has `message` (string) and, only when status is 500 or higher, `stack` (string).
- TTL index on `application_logs.occurredAt`: `expireAfterSeconds` is 7776000. The database removes a document after that age. No application job is added.

### Modified

- None

### Removed

- None
