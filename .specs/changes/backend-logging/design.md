# Design: backend-logging

## Approach (NestJS)
- Use built-in `Logger` (NestJS) with context per class/module.
- Levels: error, warn, log, debug, verbose (prod: log+; dev: debug+).
- Structured JSON in prod; pretty in dev.
- Log at boundaries: request in/out, use-case start/end, errors with stack.
- Never log secrets/passphrases/encrypted payloads or PII.
- Use `Logger#setLogLevels` via ConfigService.

## Risks
- Over-logging; mitigate with levels and context.