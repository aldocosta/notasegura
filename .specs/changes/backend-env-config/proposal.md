# Proposal: backend-env-config

## Summary
Standardize environment configuration for the backend: add `.env.example`, support `.env.development` for debug runs.

## Motivation
Make local setup explicit and avoid hidden defaults/fallback confusion.

## Scope
- In scope: .env.example, npm scripts for dev/debug using .env.development, docs.
- Out of scope: secret management in CI.