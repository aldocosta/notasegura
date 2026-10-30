# Proposal: frontend-header-nav

## Intent

The links to "Sobre", "Privacidade", "Termos", and "Contato" exist only in the footer.
Visitors look for navigation at the top of the page, so they do not find these pages.
The header must carry a main menu on every page, and the menu must work on mobile.

## User Stories

### Story: find-pages-from-the-top

As a visitor, I want a menu at the top of every page, so that I find how the site works, who runs it, and how it treats my data without scrolling to the bottom.

## Scope

**In scope:**

- A main menu in the header of every page with the links "Como funciona", "Sobre", "Privacidade", "Termos", and "Contato".
- Inline links from 640px; a "Menu" button that opens and closes the list below 640px.
- Marking of the current page.
- Unit and E2E tests.

**Out of scope:**

- Removing the footer links. The footer keeps them.
- Links to editorial content pages. The owner adds them later to the same list.
- Backend changes.

## Approach

A client component `SiteNav` in the header reads one shared list of links.
It uses the current path to mark the active link, and it holds the open state of the mobile menu.
