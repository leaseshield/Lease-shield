# ADR 0001: Adopt Next.js for SSR and improved DX

## Status
Accepted

## Context
The existing frontend uses Create React App, which lacks built‑in server‑side rendering (SSR) and provides limited SEO tooling. To deliver first‑class search engine visibility and a streamlined developer experience, we need a framework that offers:

- Native SSR and static site generation
- Zero‑config TypeScript support
- Automatic code splitting and routing
- Rich ecosystem for performance, i18n, and accessibility

## Decision
We will migrate the frontend to **Next.js**. Next.js meets our SEO and performance requirements while offering a mature plugin ecosystem for TypeScript, i18n, and accessibility. Its file‑based routing aligns with our current page structure and eases gradual migration.

## Consequences
- Introduce a Next.js application in this repository.
- Enable TypeScript strict mode and linting.
- Configure internationalization and accessibility tooling using Next.js plugins.
- Update CI to run `tsc --noEmit`, Playwright, and axe checks.
- Deprecate the existing Create React App setup once migration completes.

