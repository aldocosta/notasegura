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
| Backend logging standard | `backend/AGENTS.md` (Logging) |
| Backend testing standard | `backend/AGENTS.md` (Testing) |
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

## Specs & Tests

- **Test plan is MANDATORY.** Every new change under `.specs/changes/<name>/` MUST define tests in `tasks.md`. If a change alters behavior, there is NO "add tests later". 
- **Be explicit.** Don't write "add tests". Write the exact file path, test case and assertion. Ex: `backend/src/application/use-cases/create-note.use-case.spec.ts` - "it('throws when note is expired')" asserting behavior.
- **Unit tests:** use cases, domain, services, guards, interceptors, pure functions -> `src/**/*.spec.ts` next to the file.
- **E2E/Integration:** controllers/endpoints/modules -> `test/**/*.e2e-spec.ts` with `supertest`.
- **Infra tests:** schemas, indexes, TTL, persistence -> assert real behavior (e.g. `listIndexes()`).
- **NO test execution during RPI/spec phase.** While researching, planning or writing specs (`proposal.md`, `design.md`, `tasks.md`, `specs/`), DO NOT run `npm test`, `jest`, `./validate.sh` or any test command. Stay in writing mode only.
- **Tests are delegated.** Any test execution (unit/e2e/validate) MUST be delegated to **QA Tester** via `maestri ask "Tester" ...`. The Mestre does NOT run tests directly.
- **Don't weaken tests.** Never change assertions to make failing tests pass. Fix implementation or raise with user.
- **QA Tester may use the attached browser.** The QA Tester is allowed (and encouraged) to use the browser portal for end-to-end/UI validation when it adds coverage beyond unit/e2e tests (smoke, visual checks, form flows).

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

- **Delegação de validação**: O Mestre (este agente) não executa `./validate.sh`, testes ou E2E diretamente. Toda validação é delegada ao agente **QA Tester**, que reporta o resultado.

- Expiry constraints: 1–30 days, 1–50 views.
- Optional passphrase is part of encryption key (never stored in clear).
- Tessl skills `sdd` and `prd` installed (see `tessl.json`).