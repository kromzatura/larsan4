# Multi-Language Migration Audit Plan (largseeds.nl)

**Objective:** Prepare the architecture for a robust, SEO-friendly, maintainable multi-language implementation supporting Dutch (`nl`, default) and English (`en`).

---
## Phase 1: Content & CMS Architecture Audit (Sanity)
Ensures content is structured for efficient translation and long-term scalability.

### 1.1 Translation Strategy
- **Decision:** Adopt a document-level translation approach. Each translated version (e.g., English) is its own document in Sanity.
- **Linking:** Use a translation metadata plugin (e.g., `sanity-plugin-internationalization`) or custom reference fields to connect language variants.
- **Rationale:** Independent documents allow language-specific publishing, SEO fields, and differential scheduling.

### 1.2 Schema Review
- **Action:** Add a required `language` (string) field to all translatable document types (e.g., `page`, `post`, `product`, `category`). Enforce `options.list: [{title:"Dutch", value:"nl"}, {title:"English", value:"en"}]` with radio layout.
- **Shared vs Translated Fields:**
  - Translated: `title`, `slug`, `excerpt`, `body`, `seo` fields, `image alt text`, and potentially `pricing` if future currency / market variants are anticipated.
  - Shared (initially): `sku`, `baseImage` reference, stable taxonomy references (unless taxonomy itself becomes localized later).
- **Price Strategy (Deliberate Decision Point):** Even if only EUR is used now, model `pricing` as an object to future-proof (e.g., `{ amount: number, currency: 'EUR', display?: string }`) OR create a localized price wrapper `{ nl: { amount, currency }, en: { amount, currency } }`. Choose one of:
  1. Minimal (shared numeric): lowest setup, later migration cost higher.
  2. Structured shared object: moderate prep, still single price.
  3. Localized object: highest initial effort, zero migration cost if multi-currency emerges.
  Recommendation: Option 2 (structured shared object) unless differentiated pricing is already on roadmap (< 6 months), then Option 3.
- **Validation:** Ensure uniqueness of slug per language (e.g., custom rule combining `language + slug.current`).

#### 1.2.1 Translation Model Matrix
Defines which content types use document-level translation (separate doc per locale) versus embedded (localized fields inside parent). Chosen per rubric: SEO surface, independent publish cadence, structural divergence risk, and editorial ergonomics.

| Type | Purpose | SEO Surface? | Structural Divergence Risk | Chosen Model | Notes |
|------|---------|--------------|----------------------------|--------------|-------|
| page | Marketing / static routes | High | Medium–High | Document-level | Unique slug + metadata per locale |
| post | Blog articles | High | Medium | Document-level | Essential for hreflang + canonicals |
| product | Product detail | High | Medium | Document-level | Future pricing / compliance differences |
| category (blog/post) | Taxonomy listing | Medium | Low | Document-level | Slug impacts URL & sitemap |
| productCategory | Product taxonomy | Medium | Low | Document-level | Consistent with blog taxonomy |
| settings | Global UI / defaults | Indirect | Low | Document-level (per locale) | One per locale via `language` field |
| navigation root | Structural container | Low | Low | Embedded localized fields | Only label text varies |
| navigation link item | Link label override | Low | Low | Embedded localized fields | Localize `label` object |
| hero block | Section object | Indirect | Low | Embedded localized fields | Localize copy fields only |
| feature block | Repeated feature list | Indirect | Low | Embedded localized fields | Keys stable, text varies |
| pricing tier | In-page card | Indirect | Low | Embedded localized fields | Amount shared (Option 2) + localized label |
| faq item | Q & A pairs | Indirect | Low | Embedded localized fields | Question / answer localized |
| form definition | Field labels, messages | Indirect | Low | Embedded localized fields | Validation messages localized |
| image alt | Accessibility text | Indirect | None | Embedded localized fields | `{ nl, en }` object |
| CTA microcopy tokens | Buttons / small text | Indirect | None | Embedded localized fields | Managed via locale JSON |
| structured data overrides | Per-page schema | Mirrors doc | Mirrors doc | Matches parent model | If override needed, keep per doc |

Rubric Enforcement:
- Document-level items MUST include `language` in schema + queries filtered by `$lang`.
- Embedded localized fields MUST never appear with fallback content from another locale (strict policy).
- Adding a new locale requires: (1) new `settings` doc, (2) backfill for all document-level types, (3) schema unchanged for embedded fields (add language key if object-based).

Operational Guardrails:
- Preflight script enumerates document-level types and asserts each has at least one doc per supported locale (except during phased rollout where gaps are tracked).
- Dashboard panels: missing translation counts per document-level type; alt text completion per locale; pricing localization readiness.

### 1.3 Global Content Strategy
- **Action:** Reuse and extend existing singleton document `settings` (do NOT introduce a parallel `siteSettings`) to become the authoritative localized global config.
- **Planned Additions:** Navigation label overrides (if not already fully derived from structured nav docs), footer legal / utility text blocks, cookie banner strings, default SEO fallback fields (title, description), optional social meta defaults, structured data defaults, language switcher labels.
- **Localization Model:** Per-locale `settings` documents (recommended) by adding a required `language` field and creating one document per locale (`language == 'nl'`, `language == 'en'`). Alternative (single document with localized field objects) only if global field count remains minimal.
- **Fetch Pattern:** `*[_type == "settings" && language == $lang][0]` with strict locale-only (no fallback) as adopted.
- **Enforcement:** Validation or tooling to ensure at most one `settings` document per language; editorial dashboard surfaces missing counterpart.
- **Image Alt Text Translation:** All image-bearing blocks or objects must expose a translated `alt` field. Pattern: `alt` becomes `{ nl: string; en: string }` or separate localized sibling docs. Fallback rule: Do not silently use the other language's alt text—if missing, output empty `alt=""` for decorative treatment unless the image conveys critical meaning (then flag in QA).

### 1.4 Slug Management
- **Action:** Ensure slug generation respects language. Dutch lives at root (`/over-ons`), English under `/en/about-us`.
- **Constraint:** Prevent cross-language slug conflicts only within the same language namespace.
- **Migration Note:** For existing Dutch slugs, no prefix changes required.

---
## Phase 2: URL, Routing & SEO Audit (Next.js)
Defines URL shape and search visibility strategy.

### 2.1 URL Structure
- **Default Locale (nl):** Served from root (`/nieuws`, `/contact`).
- **Secondary Locale (en):** Served from `/en/*` namespace (`/en/news`).
- **Future-Proofing:** Reserve structure for possible third locale expansion without breaking existing URLs.

### 2.2 Next.js Configuration
- **Update:** In `next.config.js` set:
  ```js
  i18n: {
    locales: ['nl', 'en'],
    defaultLocale: 'nl',
    localeDetection: true,
  }
  ```
- **App Router:** Adopt `[lang]` segment structure for dynamic pages where locale-specific content is queried.

### 2.3 Link Resolution Logic
- **Action:** Refactor `resolveHref` to accept `(docType, slug, lang)`.
- **Rule:** If `lang === 'nl'` → no prefix. Else prefix `/en`.
- **Example:** `resolveHref('post','winter-tips','nl') => /blog/winter-tips`; `resolveHref('post','winter-tips','en') => /en/blog/winter-tips`.
- **Internal Links:** Store only document references; resolve per-request with active locale.
- **Invariant (Must Adopt):** Every GROQ query fetching localized documents MUST include `language == $lang` (or equivalent param filter). Add a lintable util (string search) or code review checklist item to prevent leakage.

### 2.4 SEO Metadata Strategy
- **Dynamic `<html lang>`:** Inject via root layout using current locale param.
- **`hreflang` Tags:** For each page with both languages, output:
  ```html
  <link rel="alternate" hreflang="nl" href="https://largseeds.nl/pad" />
  <link rel="alternate" hreflang="en" href="https://largseeds.nl/en/path" />
  <link rel="alternate" hreflang="x-default" href="https://largseeds.nl/pad" />
  ```
- **Canonical URL:** Use locale-specific absolute path.
- **Meta Source:** Metadata pulled from the correct language document; fallback strategy if translation missing (e.g., Dutch fallback when EN absent) must be explicitly defined.
- **Sitemaps:** Generate per-locale sitemap or a combined one listing both alternates.

---
## Phase 3: Frontend & UI Component Audit
Ensures UI supports localization gracefully.

### 3.1 Hardcoded Text Extraction
- **Action:** Scan components for static strings (CTAs, headings, button labels, form errors, 404 page text, accessibility labels).
- **Tooling:** Introduce `next-intl` or similar; store translations in `locales/nl.json` and `locales/en.json`.
- **Convention:** Namespace keys (`nav.home`, `cta.readMore`, `form.submit`).

### 3.2 Component Flexibility
- **Action:** Manually test with artificially long Dutch labels and English edge cases (short forms) to verify wrapping, truncation, and responsiveness.
- **Focus Areas:** Navigation menu width, buttons with icons, card titles, table headers.

### 3.3 Localization of Formats
- **Action:** Replace custom date formatting with `Intl.DateTimeFormat(lang, options)`.
- **Numbers/Prices:** Use `Intl.NumberFormat` with proper locale; consider currency variants if introduced later.
- **Accessibility:** Ensure language switch does not break aria-label semantics.

### 3.4 Language Switcher
- **Requirements:**
  - Shows available locales with current highlighted.
  - Links to exact translated path (if exists) else fallback root of target language.
  - Accessible (aria-current, focus ring, keyboard nav, discernible text or lang code).
  - Persists user choice: write explicit selection to `NEXT_LOCALE` cookie so future visits honor preference over `Accept-Language`.
- **Lookup:** Use translation linkage from Sanity to resolve the alternate document slug.
- **Behavioral Edge Case:** If user selects a language lacking a translation for current page, redirect to that locale's home (302) and optionally surface a subtle notice.

---
## Phase 4: Pre-Flight Checklist
Must answer **Yes** before implementation begins.

### Content
- [ ] `language` field added & validated on all translatable docs (including `settings`).
- [ ] `settings` localization strategy (per-locale docs vs single localized fields) implemented and documented.
- [ ] Translation linkage established (plugin or custom reference array).
- [ ] Image alt text fields localized across all image usages.
- [ ] Pricing localization strategy (Option 1/2/3) explicitly chosen & documented.

### Routing & SEO
- [ ] `next.config.js` updated with `i18n` block.
- [ ] `resolveHref` extended to accept language + tests updated.
- [ ] All GROQ queries audited to enforce `language == $lang` (no leaks).
- [ ] `hreflang` generation plan implemented (layout or metadata helper).
- [ ] Sitemap(s) updated to include alternates.

### Frontend
- [ ] All hardcoded strings extracted into locale files.
- [ ] Key components verified for layout resilience.
- [ ] Dates/numbers & potential future prices use `Intl` APIs.
- [ ] Language switcher designed, wired to translation map, and persists cookie.
- [ ] Fallback messaging UX defined for missing translations.

### Risk & Fallbacks
- [ ] Defined policy for missing translation (fallback to Dutch vs hide link).
- [ ] Monitoring plan (e.g., log untranslated keys in development).

---
## Implementation Sequencing Recommendation
Each step lists required engineering tasks and explicit editor / operations actions.

1. Foundation: Schema + Settings Expansion
  - Dev: Add `language` field to document-level types (`page`,`post`,`product`,`category`,`settings`). Add pricing object (Option 2) & alt text localization shape.
  - Dev: Extend `settings` schema with planned global fields.
  - Editor Action: Review new fields; confirm no missing global text categories.

2. Backup & Plugin Install
  - Ops: Export current dataset (snapshot) before structural change.
  - Dev: Install & configure `sanity-plugin-internationalization` (or custom translation linkage) WITHOUT creating translations yet.
  - Editor Action: Confirm studio shows language selector for configured types.

3. Classification & Language Backfill
  - Dev Script: Set all existing documents' `language` to `en` (since current content is English-first) via a migration.
  - Dev: Add guard to prevent creating second `settings` for same language.
  - Editor Action: Spot check a random sample to verify `language: en` persisted.

4. Dutch Baseline Creation (High-Impact Pages First)
  - Editor Action: Create Dutch (`nl`) versions for Home, About, Contact, top navigation pages, priority product/category pages.
  - Dev: Implement translation linkage UI enhancements (ordering, preview badges) if needed.
  - Dev: Add dashboard query counting missing Dutch counterparts.

5. Introduce `[lang]` Routing & Query Filtering
  - Dev: Add `i18n` block in `next.config.js` (still keep defaultLocale = `en` UNTIL parity threshold met—defer flip to Step 9.)
  - Dev: Introduce `[lang]` segment pages; update all GROQ queries to filter by `language == $lang`.
  - Dev: Extend `resolveHref(docType, slug, lang)` + tests (including language prefix rules).
  - Editor Action: Validate that English pages resolve correctly under `/en/...` test path (staging) and Dutch under root temp preview (if prototyped) OR under `/nl/` if temporary dual-prefixed phase is used.

6. Metadata & SEO Layer
  - Dev: Implement `generateMetadata` locale-aware; add `hreflang` builder using translation linkage.
  - Dev: Generate locale-aware sitemaps (only list hreflang pairs where both exist).
  - Editor Action: Verify sample pages produce correct `<html lang>` & hreflang tags.

7. Content Localization Expansion
  - Editor Action: Translate remaining medium-priority pages (articles, secondary products) to reach defined parity threshold (e.g., 80%).
  - Dev: Add automated report for untranslated slugs.
  - Dev: Begin embedding localized structured data for pages that now have both locales.

8. UI Internationalization Framework
  - Dev: Introduce `next-intl` (or chosen lib) + extract hardcoded UI strings into `locales/nl.json`, `locales/en.json`.
  - Dev: Implement `pickLocale` helpers for embedded localized fields.
  - Editor Action: Validate UI strings in both locales; flag overflows.

9. Default Locale Flip to Dutch
  - Preconditions: Baseline parity achieved; critical nav & SEO pages localized.
  - Dev: Change `defaultLocale` to `nl`; move English under `/en/` prefix; add 301 redirects from old root English URLs → `/en/...`.
  - Dev: Update sitemap canonical entries; confirm hreflang pairs stable.
  - Editor Action: Regression pass on navigation + legacy external links.

10. Language Switcher & UX Hardening
  - Dev: Implement persistent `NEXT_LOCALE` cookie logic & missing translation redirect notice.
  - Dev: Add monitoring events (locale switch usage, missing translation redirects).
  - Editor Action: Confirm switch only lists locales where translation exists.

11. QA & Compliance Gate
  - Dev: Run audit scripts (no query leaks, alt coverage %, pricing completeness).
  - Editor Action: Approve dashboards (translation coverage, alt warnings, pricing readiness).

12. Launch & Post-Launch Monitoring
  - Dev: Deploy feature flag removal; enable production caching for dual locales.
  - Ops: Monitor GSC indexing, hreflang validation, 404/redirect logs.
  - Editor Action: Continue filling remaining translations; escalate alt text from warn → error at target date.

13. Continuous Improvement
  - Dev: Add potential third-locale scaffolding (generic locale arrays) only when business signals ready.
  - Editor Action: Maintain translation SLAs (e.g., new English page must ship Dutch within X days).

---
## Success Metrics
- 0 broken internal links post-launch.
- 100% coverage of required `language` field across translatable docs.
- < 5% pages temporarily missing translation (tracked via dashboard).
- 100% localized image alt coverage on pages containing media.
- 0 queries returning cross-locale documents (enforced by audit script / tests).
- All pages emit correct `hreflang` pairs within first crawl cycle.

---
## Adopted Decisions (Previously Open)
**Content Fallback Policy:** Strict locale-only. No cross-language content rendering; untranslated pages simply do not expose a language switch link.

**Structured Data:** Localized schema.org required from day one; each locale's page emits matching language structured data (Product, Article, BreadcrumbList, etc.).

**Search Strategy:** Segmented by active locale. `/en` searches return only English documents; `/` (nl) returns only Dutch. Future enhancement: optional cross-locale toggle.

**Pricing Strategy Fallback:** No fallback allowed across locales. Price must exist for a product to be publishable in that locale. Missing price ⇒ product hidden or marked "Price unavailable" (non-purchasable state).

**Alt Text Validation:** Phase 1 (first 3–6 months): `warn` validation + dashboard tracking. Phase 2 (after stabilization): escalate to `error` (publish-blocking) for required semantic images.

**Missing Translation Redirect UX:** If user requests non-existent translation, redirect to that locale root with a dismissible notice: "That page is not yet available in English." Provide telemetry event for tracking frequency.

**Additional Operational Notes:**
- Introduce an editor dashboard surfacing: (1) pages missing counterpart translation, (2) images missing alt in any locale, (3) products missing localized price.
- Add automated preflight script in CI to fail if new queries omit `language == $lang`.

**Status:** Draft (ready for review)

---
## Risks & Mitigations
| Risk | Impact | Probability | Mitigation | Owner | Detection Signal |
|------|--------|-------------|-----------|-------|------------------|
| Missing language filter in new GROQ query | Cross-locale content bleed, SEO confusion | Medium | Lint script + CI test scanning `language == $lang` | Dev | CI fails build |
| Incomplete translation at locale flip | Broken UX or excessive redirects | Medium | Flip only after parity >= threshold & dashboard green | Product Lead | Dashboard parity < threshold |
| Alt text gaps for semantic images | Accessibility / SEO issues | Medium | Phase gating: warn -> error; weekly report | Accessibility Champ | Alt coverage < target |
| Incorrect 301 mapping at flip | Loss of rankings / 404 spikes | Low-Med | Pre-generate redirect map & dry run in staging logs | DevOps | 404 log spike post flip |
| Editors create duplicate settings doc per locale | Config ambiguity | Low | Unique constraint check pre-publish | Dev | Validation error logs |
| Performance regression from language filter | Slower TTFB | Low | Add query duration logging; index `language` field | Dev | APM query > baseline |
| Hreflang mismatch (one side missing) | SEO inefficiency | Medium | Sitemaps list only valid pairs; nightly hreflang audit | SEO | Audit diff report |
| Fallback leakage due to manual component bypass | Policy violation | Low | Add runtime dev assertion if language mismatch object detected | Dev | Console warnings |
| Translation backlog growth | Brand inconsistency | Medium | SLA metric & weekly triage | Content Lead | Backlog count > threshold |
| Misconfigured locale cookie | Wrong locale persistence | Low | Integration test + telemetry event when cookie applied | Dev | Error log + event anomaly |

## Cutover & Rollback Playbook
Cutover = Step 9 (Default Locale Flip to Dutch)
1. Preconditions Checklist:
  - Parity >= agreed threshold (e.g., 85% of document-level types localized).
  - All critical SEO pages (home, category roots, top 20 posts/products) localized.
  - Redirect map generated & validated in staging (no 404s in sample crawl).
  - Sitemaps built with hreflang pairs; validation script green.
2. Execution Order (Deployment Window):
  - Deploy config change (`defaultLocale: 'nl'`).
  - Apply redirect rules (root English → `/en/...`).
  - Purge CDN caches for affected paths.
  - Trigger sitemap regeneration job.
  - Verify sample pages (desktop/mobile) for canonical + hreflang tags.
3. Post-Deployment Verification (T+15m):
  - Check 404/redirect logs for anomalies.
  - Confirm no mixed-language documents in home/feed queries.
  - Validate language switcher mapping on random sample.
4. Rollback Criteria:
  - >5% of root traffic returns 404 or mislocalized page.
  - Hreflang audit shows >10% orphan alternates.
  - Redirect latency > acceptable threshold (TTFB regression).
5. Rollback Steps:
  - Revert config to previous commit (`defaultLocale: 'en'`).
  - Disable redirect rules, restore prior sitemap.
  - Issue CDN purge again, announce rollback internally.

## Instrumentation & Monitoring
Metrics & Events:
- Translation Coverage % per document-level type (dashboard + timeseries).
- Missing Translation Redirect count (event: `i18n_missing_redirect`).
- Language Switch Usage (event: `i18n_switch` with from/to, page type).
- Query Duration (log execution time for key GROQ queries with language filter).
- Alt Text Coverage % (semantic images only).
- Hreflang Pair Completeness (# pages with both locales / total localized pages).
- Redirect Effectiveness (success vs unexpected 404).

Alert Thresholds (examples):
- Coverage < 70% after flip → warn.
- Missing translation redirects > 5% of locale switch events daily → investigate.
- Query p95 latency increase > 30% week-over-week → performance review.
- Alt coverage < 95% after enforcement phase → accessibility escalation.

## Migration Scripts Outline
1. Add Language Field Migration: Iterate over target types; patch docs with `language: 'en'` (initial state) using Sanity mutation script.
2. Slug Uniqueness Assertion: Query duplicates by composite key `${language}::${slug.current}`; output list; fail script if any collisions.
3. Translation Coverage Report: For each doc-level type, build map of base slug → locales present; emit missing list (JSON) for dashboard ingestion.
4. Alt Text Gap Report: Scan image-bearing blocks for empty localized alt fields per locale; tag severity by page traffic if analytics integrated.
5. Redirect Map Generator (Cutover Prep): For each English root URL pre-flip, produce mapping to `/en/...`; export CSV + JSON for infra.

## Validation Enhancements
- Add custom publish validation: reject if document-level type missing `language` or slug duplicate in same language.
- Studio badge: Show locale chip + warning icon if counterpart missing.
- Pre-deploy test: Snapshot random sample of localized pairs, assert canonical/hreflang symmetry.

## Translation SLA Metric
- Definition: 90% of new English documents must receive Dutch translation within 7 calendar days (adjust post-launch).
- Tracking: Creation timestamp of source doc vs creation of target locale doc.
- Dashboard: Aging buckets (0-2d, 3-5d, 6-7d, >7d) with alert on >7d count.

## Open Questions (To Resolve Before Flip)
- Do product feeds / external integrations require simultaneous locale launch? (Affects pricing object readiness.)
- Are there analytics segmentation changes needed for locale dimension? (GTM update.)
- Confirm legal pages (privacy, terms) translation certification requirements.

## Ownership Matrix (RACI Summary)
| Area | Responsible | Accountable | Consulted | Informed |
|------|-------------|-------------|-----------|----------|
| Schema & Migrations | Dev | Tech Lead | Content Lead | All |
| Translation Coverage | Content Lead | Product | Dev | All |
| Accessibility (Alt Text) | Accessibility Champ | Product | Dev, Content | All |
| SEO (hreflang, sitemap) | SEO Specialist | Product | Dev | All |
| Cutover Execution | DevOps | Tech Lead | SEO, Content | All |
| Monitoring & Dashboards | Dev | Tech Lead | SEO, Product | All |

---

