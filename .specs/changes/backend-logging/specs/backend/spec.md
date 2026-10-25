# Backend Spec (Delta): logging

## Requirements
- Backend MUST use NestJS Logger with per-class context.
- Log levels MUST be configurable via env.
- Secrets/passphrases/encrypted data MUST NOT be logged.

## Scenarios
- Given an error in a use case, when thrown, then Logger.error logs stack and context.
- Given production env, when running, then debug/verbose are disabled.