# I18n Implementation Action Plan

Source Audit: See core strategy and rationale in [`../multi-language-migration-audit.md`](../multi-language-migration-audit.md) (sections: Implementation Sequencing, Risks & Mitigations, Cutover & Rollback Playbook, Instrumentation & Monitoring).

> Current State Baseline: All existing content is English-only. No Dutch documents or localized alt/pricing structures exist yet. Initial migration will backfill the official plugin locale field (e.g., `__i18n_lang: 'en'`) across existing documents before any Dutch authoring begins.

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

1. ✔ Prepare for official i18n plugin: list translatable document types (`page`, `post`, `product`, `productCategory`, `category`, `settings`) and locales (`en`, `nl`) (DEV)
2. ☐ Implement pricing object (Option 2) & confirm image alt text approach aligns with document-level translations (DEV)
3. ✔ Add slug uniqueness helper scoped per-locale (plugin-aware `isUniqueWithinLocale`) (DEV)
4. ☐ Extend `settings` doc fields (global nav labels, footer, SEO fallbacks) as needed (DEV)
5. ☐ Create editor dashboard panels scaffolding (missing translations, alt coverage) (DEV)
6. ☐ Editorial review of new fields completeness (CON)

## Phase 2 – Backup & Plugin Install

7. ☐ Snapshot / export current dataset (OPS)
8. ✔ Install and configure official `@sanity/document-internationalization` plugin with locales (`en`, `nl`) and document types (DEV)
9. ✔ Verify Translate action / language selector appears for configured types (CON)

## Phase 3 – Classification & Backfill

10. ✔ Migration script: backfill plugin locale on existing docs (e.g., set `__i18n_lang: 'en'` and clear translation refs) (DEV) — completed manually by CON
11. ✔ Add uniqueness guard to prevent duplicate `settings` per locale (DEV)
12. ☐ Spot check random docs for persisted plugin locale value (CON)

## Phase 4 – Dutch Baseline Creation

13. ☐ Create Dutch versions for Home, About, Contact (CON)
14. ☐ Localize top nav target pages (CON)
15. ☐ Localize top product/category targets (CON)
16. ☐ Dashboard reflects decreasing missing baseline count (DEV)

## Phase 5 – Routing & Query Filtering

17. ✔ Add temporary i18n config (do NOT flip default yet) (DEV)
18. ✔ Introduce `[lang]` segment pages (DEV)
19. ▶ Update all GROQ queries to filter by the plugin locale field (e.g., `__i18n_lang == $lang`) and select translation refs for hreflang (DEV) — filtering done; translation-ref powered hreflang pending
20. ✔ Extend `resolveHref` & unit tests for locale (DEV)
21. ☐ Validate path resolution for sample pages (CON)

## Phase 6 – Metadata & SEO

22. ✔ Implement locale-aware `generateMetadata` helper (DEV)
23. ▶ Add hreflang builder using plugin translation references (DEV) — pages now use translation refs; posts/products queries now expose refs (alternates remain pages-only)
24. ✔ Generate locale-aware sitemap(s) (DEV)
25. ☐ Validate meta tags & hreflang on samples (SEO)

## Phase 7 – Content Localization Expansion

26. ☐ Translate medium-priority posts/products to reach 80% parity (CON)
27. ☐ Structured data localized where both locales exist (DEV)
28. ☐ Automated untranslated slugs report active (DEV)

## Phase 8 – UI Internationalization

29. ☐ Integrate `next-intl` (or chosen) (DEV)
30. ☐ Extract hardcoded strings to `locales/*.json` (DEV)
31. ☐ Implement `pickLocale` helper for embedded localized fields (DEV)
32. ☐ Validate UI strings layout resilience (ACC)

## Phase 9 – Default Locale Flip Preparation

33. ☐ Verify parity threshold achieved (dashboard) (PROD)
34. ☐ Generate redirect map root → `/en/*` (DEV)
35. ☐ Staging dry run of redirects (OPS)
36. ☐ Final hreflang & sitemap validation pre-flip (SEO)

## Phase 9B – Cutover Execution

37. ☐ Change `defaultLocale` to `nl` (DEV)
38. ☐ Deploy redirect rules & purge CDN (OPS)
39. ☐ Regenerate sitemaps (DEV)
40. ☐ Post-deploy verification checklist (PROD)

## Phase 10 – Language Switcher & UX Hardening

41. ☐ Implement locale persistence cookie & notice UX (DEV)
42. ☐ Add telemetry events (switch, missing redirect) (DEV)
43. ☐ Validate switcher accuracy & a11y (ACC)

## Phase 11 – QA & Compliance

44. ☐ Run audit scripts (query leakage, alt coverage, pricing) (DEV)
45. ☐ Approve dashboards (translation coverage, alt warnings) (PROD)
46. ☐ Confirm no 404 spikes / anomaly logs (OPS)

## Phase 12 – Monitoring Stabilization

47. ☐ Set alert thresholds in monitoring platform (DEV)
48. ☐ Review first 72h metrics & adjust (PROD)
49. ☐ Document early lessons / backlog tasks (ALL)

## Phase 13 – Continuous Improvement

50. ☐ Implement translation SLA dashboard (DEV)
51. ☐ Track overdue translations aging buckets (CON)
52. ☐ Evaluate third locale readiness signals (PROD)

## Migration Scripts (References)

- `scripts/migrate/set-i18n-locale.js` – backfills plugin locale (e.g., `__i18n_lang: 'en'`) for existing docs
- `scripts/migrate/check-slug-collisions-per-locale.js` – asserts slug uniqueness per locale (plugin-aware)
- `scripts/reports/translation-coverage.js` – outputs JSON summary
- `scripts/reports/alt-text-gaps.js` – lists images missing localized alt
- `scripts/generate/redirect-map.js` – creates flip redirect mapping

## Metrics Tracking Sheet (Initialize Separately)

- translationCoverage.json
- altCoverage.json
- hreflangPairs.json
- redirectEvents.log
- i18nSwitchEvents.log

## Notes

- Update this file via PRs; never edit in production hotfix branches.
- Consider automating status updates with a CI job parsing commit messages (future).
