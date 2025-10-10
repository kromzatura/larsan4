# ADR-001 — Locale Routing Strategy

- **Status:** Draft
- **Date:** 2025-10-10
- **Related work:** [Action Plan — ML-02](./ML-02-foundation.md)

## Context

- The application currently serves a single locale (English) under `/`.
- ML-02 introduces locale-aware routing using the Next.js App Router.
- We must retain English parity while preparing for Dutch (`/nl`) and future locales.

## Decision

1. Introduce a dynamic `/app/[lang]/` segment that hosts all public routes.
2. Implement `/app/page.tsx` as a server redirect that resolves the preferred locale using (in priority order):
   - Explicit locale cookie (`next-lang`, 30-day expiry).
   - `Accept-Language` header matching a supported locale.
   - `DEFAULT_LOCALE` fallback (`en`).
3. Avoid middleware-based locale rewriting to keep static generation and caching predictable.
4. Maintain locale context via React providers initialized in `[lang]/layout.tsx`.
5. Keep `/app/api` routes locale-neutral during Phase 1; revisit once localized payloads are required.

## Consequences

- Requires updates to navigation, metadata, and fetch helpers to accept a `lang` parameter.
- Enables locale-specific caching strategies and analytics segmentation.
- Simplifies previews by keeping locale resolution inside the App Router tree.

## Open Questions

- Analytics instrumentation plan for locale dashboards (product analytics owner to propose before Phase 1 kickoff).

## Next Steps

- Review with product, content, and engineering leads for approval.
- Capture agreed success metrics and regression gates in the project dashboard.
- Update action plan items based on review feedback.
