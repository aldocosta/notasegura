# Agent Rules <!-- tessl-managed -->

@.tessl/RULES.md follow the [instructions](.tessl/RULES.md)

## Project

SafeNote POC: anonymous, self-destructing encrypted text sharing (clone of safenote.co). No auth. Monorepo: `frontend/` + `backend/`. Docs: `docs/poc.md` (PRD), `docs/DESIGN-nerdwallet.md` (design ref).

## Context on demand

| Topic | Read |
|---|---|
| Product requirements / business rules | `docs/poc.md` |
| Frontend design tokens & components | `docs/DESIGN-nerdwallet.md` |
| Backend commands & stack | `backend/AGENTS.md` |
| Backend architecture (clean arch + use cases) | `backend/AGENTS.md` |
| Frontend commands & stack | `frontend/AGENTS.md` |
| Tessl rules | `.tessl/RULES.md` |

## Running

- Backend: `cd backend && nvm use v24.13.0 && npm run start:dev` (MongoDB required via env; Node >=22).
- Frontend: `cd frontend && npm run dev`.
- Docker-compose: `docker-compose.yml` na raiz (mongo).

## Spec approval gate

- Before implementing a change, verify `.specs/changes/<name>/.approved` exists.
- If missing, stop and ask the user for approval (do not implement).
- Helper: `./check-approval.sh <change-name>`.
- Create the marker only after explicit user approval.

- Per-project scripts: `backend/validate.sh`, `frontend/validate.sh` (run independently).
- Aggregator: `./validate.sh` runs both (backend then frontend).
- Backend: lint, tsc --noEmit, jest, nest build (+ e2e opcional).
- Frontend: lint, tsc --noEmit, next build.
- Run before commits/PRs.

- MongoDB via Docker Compose: `docker compose up -d mongo` (porta 27017, volume `mongo_data`).
- Backend env: `MONGODB_URI=mongodb://localhost:27017/safenote` (ver `backend/.env`).
- Full stack (quando Dockerfiles existirem): `docker compose up -d` sobe mongo + backend + frontend.
- Ordem sugerida: mongo → backend (`npm run start:dev`) → frontend (`npm run dev`).

## Notes

- Expiry constraints: 1–7 days, 1–10 views.
- Optional passphrase is part of encryption key (never stored in clear).
- Tessl skills `sdd` and `prd` installed (see `tessl.json`).