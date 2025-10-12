# Multilingual Foundation Upgrade Plan

> **Goal:** Refactor the current single-locale implementation so that the codebase, content model, and delivery workflows form a resilient base for rolling out multiple languages without regressions.

---

## Immediate Cross-Cutting Objectives

1. **Surface locale as first-class state** across routing, data fetching, components, and metadata helpers.
2. **Eliminate hard-coded English strings** by centralizing UI copy in dictionaries or localized Sanity fields.
3. **Guarantee editorial confidence** via validation, previews, and guardrails that block incomplete translations.
4. **Automate quality gates** (tests, lint, previews) that verify locale-aware behavior before merge/deploy.

---

## Initiative 1 — Locale-Centric Routing Infrastructure

| Why it matters                                                                                                             | Current gaps                                                                   | Proposed actions                                                                                                                                                                                                                                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[lang]` segments ensure every request scopes to a locale, enabling correct metadata, caching, and analytics segmentation. | Legacy `(main)` routes, shared layouts, and helpers assume English-only slugs. | 1. Scaffold `/app/[lang]/` with locale context providers and default-locale redirect logic handled directly in `/app/page.tsx` (no middleware). 2. Introduce `frontend/lib/i18n/{config,routing}.ts` for locale constants, path builders, and parsing utilities. 3. Implement cookie-based locale persistence using App Router APIs (`headers`, `cookies`). |

**Deliverables**

- Root `layout.tsx` that hydrates locale context, passes `lang` to recursive rendering.
- `/app/page.tsx` redirect that inspects Accept-Language/cookie and forwards to the correct locale.
- Routing helpers and types shared across navigation and fetch layers.

---

## Initiative 2 — Sanity Content Modeling & Editorial Workflows

| Why it matters                                                           | Current gaps                                                                                                         | Proposed actions                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Editors need per-locale variants with validation to publish confidently. | Documents (`settings`, `navigation`, `page`, `product`, `post`) still single-locale; no translation status tracking. | 1. Enable Sanity document internationalization and migrate core docs to localized variants. 2. Add translation status fields (`readyForReview`, `lastTranslatedAt`) and dashboards highlighting missing locales. 3. Extend schema validation to enforce localized slugs, metadata, and alt text before publish. |

**Deliverables**

- Updated schemas with document i18n + validation lift.
- Studio dashboard widgets summarizing translation coverage.
- Updated editorial SOP describing translation flow.

---

## Initiative 3 — Query Layer & Fetch Helpers

| Why it matters                                                                | Current gaps                                                                                    | Proposed actions                                                                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A unified GROQ strategy prevents divergence between locales and reduces bugs. | Queries lack `$lang` params; helpers hard-code English slugs; metadata relies on default paths. | 1. Parameterize every GROQ fragment with `$lang` (using fragments + query composition). 2. Refactor `sanityFetch` helpers to accept `{ lang, preview }` and enforce `perspective: "published"` defaults. 3. Generate shared TypeScript types per locale from Sanity TypeGen and expose via `sanity.types.ts`. |

**Deliverables**

- Locale-aware query modules (`page`, `product`, `post`, taxonomies) with tests.
- Fetch helpers returning typed results keyed by locale.
- CI sanity check ensuring queries include `$lang` when required.

---

## Initiative 4 — Component Architecture & UI Copy Strategy

| Why it matters                                                                     | Current gaps                                                                                      | Proposed actions                                                                                                                                                                                                                                                                                                                         |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Consistent locale propagation prevents partial translations and broken navigation. | Blocks/components assume English text; `resolveHref` & navigation elements lack locale awareness. | 1. Update `Blocks` renderer to accept `lang` and propagate to every block (hero, grids, product cards). 2. Extract UI copy into locale dictionaries or Sanity-driven strings; add ESLint rule banning inline English text. 3. Refine `resolveHref`, navigation components, inquiry forms, and share buttons to use locale-prefixed URLs. |

**Deliverables**

- Component contract change log with migration checklist.
- Locale dictionaries (e.g., `frontend/lib/i18n/messages/{en,nl}.ts`).
- Regression tests verifying locale-specific navigation/menu output.

---

## Initiative 5 — Tooling, Testing, and Automation

| Why it matters                                                  | Current gaps                                                | Proposed actions                                                                                                                                                                                                                                                                                             |
| --------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Automated checks de-risk multi-locale deployments and speed QA. | No locale-aware test matrix; manual verification dominates. | 1. Add unit tests for i18n helpers, metadata builder, and URL resolver (Jest/Vitest). 2. Introduce Playwright smoke tests for `/[lang]/` routes (home, blog, product, contact). 3. Configure CI pipelines to run locale matrix (lint, typecheck, unit + e2e) and fail builds with translation coverage gaps. |

**Deliverables**

- New test suites + fixtures covering en/nl sample data.
- CI updates (GitHub Actions or Vercel checks) reporting locale pass/fail.
- QA checklist for release candidates.

---

## Initiative 6 — Performance & Observability Enhancements

| Why it matters                                                                             | Current gaps                                                                             | Proposed actions                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Locale routing changes caching patterns and analytics; observability prevents regressions. | No locale dimensions in analytics/logging; caching headers not tuned for per-locale ISR. | 1. Review `revalidate`/ISR strategy per route and adjust caching headers to isolate locales. 2. Instrument analytics (Fathom, GA4, etc.) with locale context. 3. Expand logging/monitoring (Sentry) to include locale tags for error triage. |

**Deliverables**

- Updated caching policy doc; tests verifying locale-specific `Cache-Control` headers.
- Analytics + monitoring dashboards segmented by locale.

---

## Phased Implementation Roadmap

| Phase                                         | Focus                       | Key outputs                                                | Success criteria                                         |
| --------------------------------------------- | --------------------------- | ---------------------------------------------------------- | -------------------------------------------------------- |
| 0. Preparation (1 sprint)                     | Planning & scaffolding      | i18n config, roadmap approval, core stakeholders aligned   | Sign-off from product/engineering; risk register created |
| 1. Infrastructure (1-2 sprints)               | Routing, helpers, schemas   | `/[lang]/` scaffold, locale-aware helpers, schema updates  | English locale continues to function; tests green        |
| 2. Content & Component Refactor (2-3 sprints) | Blocks, queries, navigation | Locale-aware blocks, GROQ updates, navigation rewrite      | Demo of home/product/blog in EN + NL from draft data     |
| 3. Tooling & Automation (1 sprint)            | Tests, CI, monitoring       | Locale test matrix, dashboards, translation status tooling | CI catches missing translations; QA sign-off             |
| 4. Launch Prep (1 sprint)                     | Migration & support         | Migration scripts, editor training, fallback strategy      | Go/No-Go checklist completed; support plan in place      |

---

## Action Tracker (Initial Backlog)

1. Draft `frontend/lib/i18n/config.ts` with locale constants and helper stubs.
2. Schedule pair working sessions with content team to enable Sanity document i18n settings.
3. Create ADR describing the `[lang]` routing decision and `/app/page.tsx` redirect strategy (no middleware).
4. Prototype localized `resolveHref` and navigation updates in a feature branch.
5. Spin up test fixtures with duplicate English/Dutch content to drive query and component tests.
6. Update CI configuration to include translation coverage lint (e.g., ensure message keys exist in every locale file).
7. Plan analytics/schema updates with marketing stakeholders to ensure locale tagging.

---

## Risks & Mitigations

| Risk                              | Impact                               | Mitigation                                                                       |
| --------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------- |
| Partial translations shipped live | Broken UX/SEO for non-default locale | Validation rules blocking publish; CI translation coverage checks                |
| Increased code complexity         | Slower velocity, bugs                | Adopt shared helpers, TypeScript types, and ADRs to document decisions           |
| Editor workflow disruption        | Content freeze delays                | Provide training, preview links, and staged rollout (pilot locale → full launch) |

---

## Next Steps

- Review and prioritize initiatives with engineering + content stakeholders.
- Convert top-priority actions into GitHub issues aligned with the roadmap phases.
- Begin Phase 0 preparation immediately: confirm locale list, draft ADR, and establish success metrics.
