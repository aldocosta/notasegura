# Design: backend-env-config

## Approach
- Add `backend/.env.example` with required vars (MONGODB_URI, PORT, NODE_ENV, LOG_LEVEL).
- Add `.env.development` (gitignored) for local debug; npm script `start:dev` loads it (via dotenv or Nest ConfigModule envFilePath).
- ConfigModule.forRoot({ isGlobal, envFilePath: ['.env.development', '.env'] }).
- Document in backend/AGENTS.md and root context table.