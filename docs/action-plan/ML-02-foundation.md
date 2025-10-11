# Action Plan — ML-02 Multilingual Foundation Upgrade

> Parent document: [Multilingual Foundation Upgrade Plan](../multi-language-foundation-plan.md)
>
> Objective: Strengthen the existing single-locale implementation so the later multilingual rollout lands on a stable base.

---

## Known Weak Spots to Address Early

- **Global HTML + metadata assume English** — `frontend/app/layout.tsx` hard-codes `<html lang="en">`, and `generatePageMetadata` returns `openGraph.locale: "en_US"` with canonical paths that lack locale awareness. These hit every page, so updating them during the foundation work prevents regressions later.
- **Fetch helpers leak implementation details** — several helpers (e.g., `fetchSanityProductBySlug`, `fetchSanityProducts`) omit `perspective: "published"` / `stega: false`, meaning draft content can slip into production responses when tokens are present. Standardizing helper options is critical before we widen usage with locales.
- **Routing helpers are single-locale** — `resolveHref` and navigation builders always emit English paths (`/blog/...`, `/products/...`). Without a locale-aware contract, every component callsite will break once we prepend `/${lang}`. Migrating them now limits churn.
- **Blocks rely on ad-hoc search param plumbing** — `Blocks` expects `searchParams` as a `Promise`, while callers (e.g., home/products pages) hand-roll pagination logic. This coupling will get more brittle with locale-specific filters; we should normalize the signature and centralize param parsing.
- **Share URL composition is duplicated** — product and post pages rebuild share URLs with raw `process.env.NEXT_PUBLIC_SITE_URL`. Centralizing this in a URL helper avoids bugs when locale prefixes arrive and removes the risk of inconsistent origins.
- **Test coverage gaps** — there are no unit tests for routing helpers, metadata, or fetch wrappers. Before layering locale behavior, we need baseline tests to catch regressions as we refactor.
- **Stakeholder alignment is informal** — locale priorities, fallback policies, and success metrics live in meeting notes only. Phase 0 must formalize these decisions in an ADR, risk register, and dashboard so downstream teams have a single source of truth.

These weaknesses map directly to the Phase 1–3 tasks below; tackling them early keeps the foundation stable while the site remains single-locale.

---

## Phase 0 — Preparation (Week 1)

- [x] **Confirm locale inputs**
  - ✅ Default locale: `en`; near-term expansion: `nl`; fallback hierarchy resolves to `en` for all locales.
  - ✅ Captured in `frontend/lib/i18n/config.ts` with locale labels, fallbacks, and format helpers.
- [x] **Stakeholder alignment**
  - ✅ Alignment meeting completed; notes recorded in [Phase 0 Alignment Meeting](./meetings/phase-0-alignment.md).
  - ✅ Risks reviewed and dashboard owner assigned (Product Manager) for weekly updates.
- [x] **Author ADR-001: Locale Routing Strategy**
  - ✅ ADR approved by stakeholders; see [`ADR-001-locale-routing.md`](./ADR-001-locale-routing.md).
  - ✅ Success metrics documented (English parity, locale propagation API).
- [x] **Define success metrics & tracking**
  - ✅ Initial KPIs: maintain `/` ≈ `/en` parity, zero critical regressions during scaffold, and readiness to demo `/nl` draft content before Phase 2.
  - ✅ Risk register initialized at `docs/action-plan/risk-register.md`; stakeholders to update during weekly sync.

### Phase 0 Open Questions

- Locale cookie confirmed as `next-lang` with 30-day expiry; opt-out handled via existing preference controls.
- `/app/api` routes remain locale-neutral for Phase 1; reassess when localized responses are introduced.
- Analytics dashboard updates assigned to product analytics owner; weekly status cadence established.
- Product Manager owns status dashboard and risk register updates (every Friday).

## Phase 1 — Infrastructure (Weeks 2-3)

- [x] **Scaffold `/app/[lang]/`**
  - ✅ `[lang]/layout.tsx` wraps the legacy `(main)` layout inside a locale provider.
  - ✅ `/app/page.tsx` now redirects using cookie → Accept-Language → fallback order.
- [x] **Build i18n helper modules**
  - ✅ `frontend/lib/i18n/routing.ts` + `locale-context.tsx` provide locale parsing, builders, and context; config already in place.
  - ✅ `resolveHref` upgraded to accept locale-aware paths via `buildLocalizedPath`.
- [x] **Database & schema groundwork** _(manual Studio task — completed in Studio repo)_
  - Enabled document i18n for `settings`, `navigation`, `page`, `post`, `product`, and the current taxonomy set. Confirm if nested associations need follow-up once taxonomy inventory is finalized.
  - Added hidden `language` fields plus translation status validations on every schema; linting and Studio compile now pass.
  - **Status:** Complete pending verification checklist; open question filed to double-check whether any downstream taxonomies still require localization.
- [~] **Fixtures & preview data** _(deferred — continue using live English content for now)_
  - Decision logged: existing production documents remain the baseline; create an NDJSON snapshot only if automated tests demand it later.

## Phase 2 — Content & Component Refactor (Weeks 4-6)

- [ ] **Blocks & components**
  - [x] Update `Blocks` renderer to accept `lang` and pass it to child components (locale now forwarded to `section-header`, `hero-12`, `hero-174`; remaining blocks to audit for language-aware links).
  - Extract shared UI copy into locale dictionaries or Sanity fields (start with navigation/header/footer/inquiry).
  - Introduce centralized Next props types (non-Promise) and migrate all pages/layouts to use them, removing async/await for params/searchParams resolution.
- [ ] **Query layer upgrade**
  - [x] Parameterize GROQ fragments with `$lang` starting with `page`, `post`, and blog category queries (fallback-aware lookup, language field exposure).
  - [x] Update `sanity/lib/fetch.ts` helpers and blog/page routes to accept `{ lang }` and forward fallback locales.
- [ ] **Navigation & inquiry flow**
  - Refactor header/footer/navigation components to build locale-prefixed URLs.
  - Ensure inquiry/cart flows store both locale-specific copy and stable identifiers.

## Phase 3 — Tooling & Automation (Week 7)

- [ ] **Testing matrix**
  - Add unit tests covering routing helpers, metadata builders, and share URL utilities.
  - Run `vitest` on each refactor PR to confirm no regressions, and add tests for new shared Next props types usage where appropriate.
  - Introduce Playwright smoke tests for `/[lang]/` routes using the English baseline data.
- [ ] **CI enforcement**
  - Configure pipeline to run lint/typecheck/tests with locale fixtures.
  - Add translation coverage lint (e.g., ensure every message key exists in the active locale file).
- [ ] **QA checklist**
  - Draft a release checklist for verifying locale behavior pre-merge (routing, metadata, navigation, inquiry).

## Phase 4 — Launch Prep (Week 8)

- [ ] **Migration scripts & documentation**
  - Create scripts or docs for migrating existing English content into localized document variants.
  - Publish updated editorial SOP covering translation workflow and validation gates.
- [ ] **Monitoring & analytics**
  - Instrument analytics with locale dimensions.
  - Add locale tagging to Sentry/logging dashboards.
- [ ] **Go/No-Go review**
  - Conduct readiness review against risks identified in ML-02.
  - Decide whether to proceed to ML-03 (Content Surface Standardization).

---

## Completion Criteria

- English locale remains functional throughout (`/[lang]/en` parity with legacy `/`).
- All critical schemas support localized variants with validation.
- Routing, fetch, and metadata helpers accept `lang` consistently.
- Test suites and CI gates catch missing translations or routing regressions.
- Stakeholders sign off on moving to ML-03 once tasks above are complete.
