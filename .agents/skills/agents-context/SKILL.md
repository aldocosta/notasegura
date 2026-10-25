---
name: agents-context
description: Maintain AGENTS.md files (root and per-project) with context-on-demand tables. Use when a change introduces a new topic, architecture decision, or convention that should be discoverable via AGENTS.md. Ensures root AGENTS.md points to child AGENTS.md and child files document the specifics.
user-invocable: true
---

# AGENTS.md Context Management

Keep project context discoverable on demand.

## Rules

- Root `AGENTS.md` holds a "Context on demand" table mapping Topic -> Read (child file).
- Each project (`backend/`, `frontend/`) has its own `AGENTS.md` documenting commands, stack, architecture, and conventions.
- When adding a new topic (e.g., logging, auth, caching), add a row to root table pointing to the relevant child `AGENTS.md` section/file.
- Child `AGENTS.md` must document the specifics (commands, env, patterns, decisions).
- Never duplicate large docs; link instead.

## Workflow

1. Identify the topic and affected scope (root/backend/frontend).
2. Update the child `AGENTS.md` with concise specifics.
3. Add/update a row in root `AGENTS.md` "Context on demand" table.
4. Verify links/paths are correct.

## Example

Root table row:
| Logging architecture | `backend/AGENTS.md` (Logging) |
