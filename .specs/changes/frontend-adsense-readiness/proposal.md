# Proposal: frontend-adsense-readiness

## Intent

The owner wants to monetize the site with Google AdSense.
AdSense reviews the whole site before it approves an account, and it rejects sites that look unfinished, have no trust pages, or cannot be crawled.
Today the site has only the home page and the note page, no footer, no legal pages, no `robots.txt`, no sitemap, and no `ads.txt`.
This change adds the mandatory, non-editorial items so that the site can apply for AdSense without a rejection for missing basics.

## User Stories

### Story: trust-the-operator

As a visitor, I want to see who runs the site, how it treats my data, and how to contact the operator, so that I can trust it with secret text.

### Story: fund-the-free-service

As the site owner, I want the site to pass the AdSense review and to serve ads only where policy allows, so that ad revenue keeps the service free without an account.

### Story: keep-notes-private

As a note sender, I want crawlers to never open my note link, so that a bot does not consume a view or destroy my note.

## Scope

**In scope:**

- Shared site header and footer on every page, with links to the trust pages.
- Trust pages with complete prose in pt-BR: `/sobre`, `/privacidade`, `/termos`, `/contato`.
- A privacy policy that contains the disclosures AdSense requires for advertising cookies.
- `robots.txt`, `sitemap.xml`, and `ads.txt` served from the site root.
- The AdSense site code (script and `google-adsense-account` meta tag) on content pages only, enabled by configuration.
- `noindex` on the note page, and no AdSense code on it.
- A pt-BR 404 page that returns HTTP 404 and links to the home page.
- Build-time configuration for the site URL, the AdSense client ID, and the contact email, including the Docker build.
- Unit and E2E tests for all of the above.

**Out of scope:**

- Editorial content: security tips, guides, articles about algorithms, and any other content pages. The owner writes them later.
- Ad units and ad slot placement. A later change adds them after AdSense approves the site.
- Domain purchase, DNS, HTTPS, and the HTTP-to-HTTPS redirect. The owner handles hosting.
- Consent banner code. The consent message for EEA, UK, and Switzerland is configured in the AdSense "Privacy & messaging" panel, not in code.
- Backend changes.
- Legal review of the policy text.

## Approach

Move the home page and the trust pages into an App Router route group `(site)`.
The group layout loads the AdSense script only when the client ID is configured.
The note page stays outside the group, so it never loads AdSense code.
The root layout holds the shared header and footer, so every page, including the note page and the 404 page, shows them.
Next.js metadata files generate `robots.txt` and `sitemap.xml`.
A route handler serves `ads.txt` from the configured client ID.
All site-specific values come from `NEXT_PUBLIC_*` variables, which Next.js inlines at build time.

## Resolved Questions

- 2026-10-30 Contact email: the contact page shows `aldocostasantos@gmail.com` for now. It stays configurable through `NEXT_PUBLIC_CONTACT_EMAIL`, and `docker-compose.yml` uses this address as the default. Decided with the user.
- 2026-10-30 Operator name: the terms and the privacy policy name "Nota Segura - BR" as the operator. Decided with the user.
- 2026-10-30 Privacy requirement: note data stays until the expiry date, also when the note is consumed earlier; a consumed note can no longer be opened. Decided with the user.
- 2026-10-30 Decryption statement: the policy and the terms say the operator does not read notes and cannot decrypt passphrase-protected notes; they do not claim that the operator cannot decrypt any note. Decided with the user.
- 2026-10-30 Contact reply time: up to 5 business days. Decided with the user.
