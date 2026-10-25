# SafeNote Backend

NestJS 11 + Mongoose/MongoDB backend for the SafeNote POC.

## Commands

- dev: `npm run start:dev`
- build: `npm run build`
- test: `npm test`
- e2e: `npm run test:e2e`
- lint: `npm run lint`
- format: `npm run format`

## Module map

- `src/modules/notes/` - notes capability (domain, application, infrastructure, presentation).
- `src/platform/` - logging, rate-limit, health, errors.

## Validation

Run `./validate.sh` (lint, tsc, build) before commits/PRs. Tests run via `npm test` and `npm run test:e2e`.
