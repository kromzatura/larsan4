# I18n Implementation Action Plan

Source Audit: See core strategy and rationale in [`../multi-language-migration-audit.md`](../multi-language-migration-audit.md) (sections: Implementation Sequencing, Risks & Mitigations, Cutover & Rollback Playbook, Instrumentation & Monitoring).

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
1. ☐ Add `language` field to `page`, `post`, `product`, `category`, `settings` (DEV)
2. ☐ Implement pricing object (Option 2) & alt text localization shape (DEV)
3. ☐ Enforce composite uniqueness (language + slug) validation (DEV)
4. ☐ Extend `settings` doc fields (global nav labels, footer, SEO fallbacks) (DEV)
5. ☐ Create editor dashboard panels scaffolding (missing translations, alt coverage) (DEV)
6. ☐ Editorial review of new fields completeness (CON)

## Phase 2 – Backup & Plugin Install
7. ☐ Snapshot / export current dataset (OPS)
8. ☐ Install & configure translation linkage plugin (DEV)
9. ☐ Verify language selector appears for document-level types (CON)

## Phase 3 – Classification & Backfill
10. ☐ Migration script: patch all existing docs with `language: 'en'` (DEV)
11. ☐ Add uniqueness guard to prevent duplicate `settings` per language (DEV)
12. ☐ Spot check random doc set for persisted `language` value (CON)

## Phase 4 – Dutch Baseline Creation
13. ☐ Create Dutch versions for Home, About, Contact (CON)
14. ☐ Localize top nav target pages (CON)
15. ☐ Localize top product/category targets (CON)
16. ☐ Dashboard reflects decreasing missing baseline count (DEV)

## Phase 5 – Routing & Query Filtering
17. ☐ Add temporary i18n config (do NOT flip default yet) (DEV)
18. ☐ Introduce `[lang]` segment pages (DEV)
19. ☐ Update all GROQ queries with `language == $lang` (DEV)
20. ☐ Extend `resolveHref` & unit tests for locale (DEV)
21. ☐ Validate path resolution for sample pages (CON)

## Phase 6 – Metadata & SEO
22. ☐ Implement locale-aware `generateMetadata` helper (DEV)
23. ☐ Add hreflang builder (DEV)
24. ☐ Generate locale-aware sitemap(s) (DEV)
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
- `scripts/migrate/add-language.js` – sets `language: 'en'` for existing docs
- `scripts/migrate/check-slug-collisions.js` – asserts uniqueness per language
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
