# Proposal: frontend-unify-privacy-terms

## Intent

The site has two separate legal pages: "Política de Privacidade" at `/privacidade` and "Termos de Uso" at `/termos`.
The two pages repeat the same facts (the passphrase, the contact page, the change policy), and the terms only point to the policy.
Visitors must open two pages to know the rules before they share a secret.
One page must hold both texts, and the old `/termos` links must keep working.

## User Stories

### Story: one-place-for-the-rules

As a visitor, I want the privacy policy and the terms of use on one page, so that I read all the rules for my data and my notes in one place before I share a secret.

### Story: keep-old-links-working

As a visitor who follows an old link or a search result to `/termos`, I want to land on the terms of use, so that the link does not break.

## Scope

**In scope:**

- One page at `/privacidade` with the `h1` "Política de Privacidade e Termos de Uso".
- Two parts on the page, in this order: "Política de Privacidade" (anchor `#privacidade`) and "Termos de Uso" (anchor `#termos`), with links to both anchors at the top.
- Removal of the text that the two pages repeat.
- A permanent redirect (HTTP 308) from `/termos` to `/privacidade#termos`.
- The menu and the footer show one link "Privacidade e Termos" to `/privacidade` instead of "Privacidade" and "Termos".
- The sitemap lists `/privacidade` and no longer lists `/termos`.
- The links on `/sobre` point to the unified page only.
- Unit and E2E tests.

**Out of scope:**

- New legal content. The texts keep their current meaning.
- The link on `/contato` to `/privacidade`. It stays as it is, because it still points to the right page.
- Backend changes.
- The AdSense privacy policy URL. It stays `/privacidade`.

## Approach

Keep the route `/privacidade` and move the terms text into it.
Add a small `TrustPart` component that renders a part heading (`h2`) with an anchor and an icon, and let `TrustSection` render its heading as `h3` inside a part.
Delete the route `frontend/src/app/(site)/termos/`, and add the redirect in `next.config.ts`.
Remove the `/termos` entry from `TRUST_PAGES` and rename the `/privacidade` label, so that the menu, the footer, and the sitemap follow.

## Resolved Questions

- 2026-10-30 URL of the unified page: keep `/privacidade`. Decided with the user.
- 2026-10-30 Old URL `/termos`: permanent redirect (308) to the unified page. Decided with the user.
- 2026-10-30 Names: the link is "Privacidade e Termos"; the `h1` is "Política de Privacidade e Termos de Uso". Decided with the user.
- 2026-10-30 Structure: two parts on one page (privacy first, then terms) with the anchors `#privacidade` and `#termos`; repeated text is removed. Decided with the user.
