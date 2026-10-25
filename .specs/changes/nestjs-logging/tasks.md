# Tasks: NestJS Logging

> Do not apply. Superseded on 2026-10-24 by `persist-application-logs`.

## Backend

- [ ] Create Mongoose log schema with TTL index (90 days)
- [ ] Create LogService to persist log entries
- [ ] Create global exception filter capturing unhandled errors
- [ ] Register global exception filter in AppModule/main
- [ ] Create injectable AppLogger service wrapping Logger
- [ ] Add unit tests for LogService and exception filter

## Verification

- [ ] Run backend tests (jest)
- [ ] Run tsc --noEmit
```