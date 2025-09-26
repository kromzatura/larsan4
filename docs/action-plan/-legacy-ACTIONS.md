# I18n Implementation Action Plan

Revision: 2025-09-26

This plan has been UPDATED to reflect the adopted strategy:

"We are using the official `@sanity/document-internationalization` plugin (document-level translation groups) plus a hidden, AI‑Assist excluded `language` field on all translatable document types. We enforce per-locale slug uniqueness and derive hreflang + canonical metadata from translation group metadata in the dataset. We have intentionally deferred a full UI string framework (e.g. `next-intl`) until after core localized content + SEO stability. The AI Assist bulk 'Translate document' action REMAINS IN SCOPE and is an active objective (currently blocked: action not visible in Studio UI). Manual translation is a fallback, not the end state."

Key Implemented Decisions:
- Document-level i18n: `@sanity/document-internationalization` plugin loaded before Assist.
- Hidden `language` field (author-visible only through plugin UI) persisted for explicit GROQ filtering.
- Locale-aware slug uniqueness helper (`isUniqueWithinLocale`).
- Frontend routing uses `[lang]/` segment; default fallback logic preserved.
- Centralized metadata helper generates canonical + `alternates.languages` (hreflang) from translation groups.
- Localized sitemap implemented.
- System / structural fields (language, slug, ordering) excluded from AI Assist.
- Manual translation linking validated (e.g. About / Over pair) generating hreflang alternates.

Deferred / Out of Scope (current iteration):
- Full UI string extraction + runtime dictionary (`next-intl`) — postponed until content parity & SEO baseline complete.
- Redirect flip of default locale (Phase 9B) — contingent on parity metrics.

Active Blocked Investigation:
- AI Assist bulk "Translate document" action (blocked: plugin action not appearing; investigating plugin version, ordering, feature gating, and potential API constraints).

Status Legend: ☐ Not Started | ▶ In Progress | ⏸ Blocked | ✔ Done

Source Audit: See core strategy and rationale in [`../multi-language-migration-audit.md`](../multi-language-migration-audit.md) (sections: Implementation Sequencing, Risks & Mitigations, Cutover & Rollback Playbook, Instrumentation & Monitoring).

> Current State Baseline: All existing content is English-only. No Dutch documents or localized alt/pricing structures exist yet. Initial migration sets `language: 'en'` across existing documents before any Dutch authoring begins.

Status Key: ☐ Not Started | ▶ In Progress | ⏸ Blocked | ✔ Done
(Track updates directly in this file via commits.)

## Legend / Ownership Codes
- DEV = Engineering
- CON = Content / Editorial
- SEO = SEO Specialist
- OPS = DevOps / Infrastructure
- ACC = Accessibility Champion
- PROD = Product / Project Lead

## Phase 1 – Foundation (Schema & Settings)
1. ✔ Add `language` field (+ Assist exclusion) to `page`, `post`, `product`, `productCategory`, `category`, `navigation`, `settings` (DEV)
2. ☐ Implement pricing object (Option 2) & alt text localization shape (DEV)
3. ✔ Enforce per-locale slug uniqueness validation (DEV)
4. ▶ Extend `settings` doc fields (global nav labels, footer, SEO fallbacks) (DEV)
5. ☐ Create editor dashboard panels (missing translations, alt coverage) (DEV)
6. ☐ Editorial review of new fields completeness (CON)

## Phase 2 – Backup, Plugin Install & AI Assist Enablement
7. ☐ Snapshot / export current dataset (OPS)
8. ✔ Install & configure `@sanity/document-internationalization` plugin (DEV)
9. ✔ Verify translation group panel & language selector visible for targeted document types (CON)
10. ▶ Expose bulk AI Assist "Translate document" action (DEV) (BLOCKED)
11. ☐ Add field-level `translateAction` hints to high-value text fields (titles, descriptions, body) (DEV)
12. ☐ Draft + register translation style/tone guideline prompt for Assist (CON)
13. ☐ Pilot quality comparison: Assist vs manual on 3 documents (CON/SEO)

## Phase 3 – Classification & Backfill
14. ✔ Migration script: patch all existing docs with `language: 'en'` (DEV)
15. ✔ Guard: enforce single `settings` per language (slug + language uniqueness) (DEV)
16. ▶ Spot check random doc set for persisted `language` value (CON)

## Phase 4 – Dutch Baseline Creation
17. ▶ Create Dutch versions for Home, About, Contact (About/Over pair ✔, others pending) (CON)
18. ☐ Localize top nav target pages (CON)
19. ☐ Localize top product/category targets (CON)
20. ☐ Dashboard reflects decreasing missing baseline count (DEV)

## Phase 5 – Routing & Query Filtering
21. ✔ Add i18n config & preserve current default locale (no flip) (DEV)
22. ✔ Introduce `[lang]` segment pages (DEV)
23. ✔ Update GROQ queries with `language == $lang` (DEV)
24. ✔ Extend `resolveHref` & unit tests for locale (DEV)
25. ✔ Validate path resolution for sample pages (About/Over) (CON)

## Phase 6 – Metadata & SEO
26. ✔ Implement locale-aware `generateMetadata` helper (DEV)
27. ✔ Add hreflang builder (DEV)
28. ✔ Generate locale-aware sitemap(s) (DEV)
29. ✔ Validate meta tags & hreflang on samples (SEO)

## Phase 7 – Content Localization Expansion
30. ☐ Translate medium-priority posts/products to reach 80% parity (CON)
31. ☐ Structured data localized where both locales exist (DEV)
32. ☐ Automated untranslated slugs report active (DEV)

## Phase 8 – UI Internationalization (Deferred)
33. ⏸ Integrate `next-intl` (or alternative) (DEV) – deferred until content parity & SEO stabilization
34. ⏸ Extract hardcoded strings to `locales/*.json` (DEV)
35. ⏸ Implement `pickLocale` helper for embedded localized fields (DEV)
36. ⏸ Validate UI strings layout resilience (ACC)

## Phase 9 – Default Locale Flip Preparation
37. ☐ Verify parity threshold achieved (dashboard) (PROD)
38. ☐ Generate redirect map root → `/en/*` (DEV)
39. ☐ Staging dry run of redirects (OPS)
40. ☐ Final hreflang & sitemap validation pre-flip (SEO)

## Phase 9B – Cutover Execution
41. ☐ Change `defaultLocale` to `nl` (DEV)
42. ☐ Deploy redirect rules & purge CDN (OPS)
43. ☐ Regenerate sitemaps (DEV)
44. ☐ Post-deploy verification checklist (PROD)

## Phase 10 – Language Switcher & UX Hardening
45. ☐ Implement locale persistence cookie & notice UX (DEV)
46. ☐ Add telemetry events (switch, missing redirect) (DEV)
47. ☐ Validate switcher accuracy & a11y (ACC)

## Phase 11 – QA & Compliance
48. ☐ Run audit scripts (query leakage, alt coverage, pricing) (DEV)
49. ☐ Approve dashboards (translation coverage, alt warnings) (PROD)
50. ☐ Confirm no 404 spikes / anomaly logs (OPS)

## Phase 12 – Monitoring Stabilization
51. ☐ Set alert thresholds in monitoring platform (DEV)
52. ☐ Review first 72h metrics & adjust (PROD)
53. ☐ Document early lessons / backlog tasks (ALL)

## Phase 13 – Continuous Improvement
54. ☐ Implement translation SLA dashboard (DEV)
55. ☐ Track overdue translations aging buckets (CON)
56. ☐ Evaluate third locale readiness signals (PROD)

## Migration & Utility Scripts (References)
- `scripts/migrate/add-language.js` – sets `language: 'en'` for existing docs (RUN)
- `scripts/migrate/check-slug-collisions.js` – asserts uniqueness per language
- `scripts/reports/translation-coverage.js` – outputs JSON summary (planned)
- `scripts/reports/alt-text-gaps.js` – lists images missing localized alt (planned)
- `scripts/generate/redirect-map.js` – creates flip redirect mapping
- (Planned) `scripts/reports/untranslated-slugs.js` – enumerate docs lacking NL counterpart

## Metrics Tracking Sheet (Initialize Separately)
- translationCoverage.json
- altCoverage.json
- hreflangPairs.json
- redirectEvents.log
- i18nSwitchEvents.log

## Notes
- Update this file via PRs; never edit in production hotfix branches.
- Consider automating status updates with a CI job parsing commit messages (future).
- Assist bulk translation action absent; manual translation + linking is the current accepted workflow.
- Add dashboards only after base content coverage improves to avoid noise.
