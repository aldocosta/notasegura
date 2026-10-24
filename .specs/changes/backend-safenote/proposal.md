# Proposal: Backend SafeNote (POC)

## Summary

Implement the NestJS backend for SafeNote: anonymous creation of encrypted text notes with configurable expiry (time and/or views) and a passphrase that is part of the encryption key.

## Motivation

Provide a secure, non-persistent way to share text via a link. No authentication required.

## Scope

- Create note endpoint (encrypt + persist).
- Retrieve note endpoint (decrypt on view, consume a view).
- Expiry by time (1–7 days) and by views (1–10).
- MongoDB persistence with TTL.
- Clean architecture + design patterns.

## Out of scope

- Auth, analytics, attachments, rate limiting.

## User stories

- As a user, I create a note with optional passphrase and expiry, and receive a link.
- As a recipient, I open the link (passphrase if required) and read the text; the link expires after limits.