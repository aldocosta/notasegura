# Backend Spec (Delta): env-config

## Requirements
- Backend MUST load `.env.development` then `.env` via ConfigModule.
- Repository MUST include `.env.example` documenting required vars.
- `.env*` (except .example) MUST be gitignored.

## Scenarios
- Given `.env.development` exists, when running `npm run start:dev`, then vars are loaded.
- Given only `.env.example`, when onboarding, then required vars are known.