# Proposal: Frontend SafeNote (POC)

## Summary

Implement the Next.js frontend for SafeNote: create note flow, open note flow, responsive minimalist UI following `docs/DESIGN-nerdwallet.md`.

## Scope

- Page `/`: create note (textarea, optional passphrase, expiry selectors 1-7 days / 1-10 views), generate link.
- Page `/n/[id]`: open note (passphrase prompt if needed), display text, expired/consumed states.
- Responsive, minimalist, reserve <=8% screen for future ads/add-ons.

## Out of scope

- Auth, analytics, theming beyond design ref.