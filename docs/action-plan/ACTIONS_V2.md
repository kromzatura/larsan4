# I18n / Translation Enablement Action Plan (V2 – Clean Start)

Revision: 2025-09-26

Purpose: Re-sequence implementation so that the Sanity document translation plugin and AI Assist bulk "Translate document" action are validated FIRST, before broader schema localization, routing, and SEO layers. This isolates any Assist / plugin issues early and prevents rework.

Reference Audit: See architectural rationale in `../multi-language-migration-audit.md` (translation model matrix, risks, cutover playbook). This V2 plan tracks execution from a CLEAN branch state where none of the earlier V1 tasks are assumed done.

Status Legend: ☐ Not Started | ▶ In Progress | ⏸ Blocked | ✔ Done | ⚠ Needs Review

---
## Phase 0 – Baseline Verification (Gate 0)
Goal: Confirm starting point and capture immutable snapshot before changes.
1. ☐ Inventory current schemas (export `schema.json`) (DEV)
2. ☐ Dataset snapshot (export) (OPS)
3. ☐ Record current Studio dependency versions (DEV)
4. ☐ Confirm no existing `language` field on document-level types (DEV)
5. ☐ Capture baseline Lighthouse + TTFB for sample pages (DEV)

Gate 0 Exit Criteria: Snapshot archived; evidence logged in PR description.

---
## Phase 1 – Core Translation Plugins Install (Gate 1)
Goal: Install and configure document-level translation + AI Assist before schema localization.
6. ☐ Install `@sanity/document-internationalization` (DEV)
7. ☐ Verify `@sanity/assist` present / update to latest compatible version (DEV)
8. ☐ Add plugin config to `sanity.config.ts` (documentInternationalization BEFORE assist) (DEV)
9. ☐ Configure supported languages: `en` (default for now), `nl` (DEV)
10. ☐ Add feature flag env var (e.g. `ENABLE_I18N_V2=true`) to allow revert (OPS)
11. ☐ Smoke test Studio loads with plugin (DEV)
12. ☐ Document troubleshooting checklist if plugin action missing (DEV)

Gate 1 Exit Criteria: Studio shows translation panel (language selector) on target document types (even though language field not yet in schema), no console errors.

---
## Phase 2 – AI Assist Translation Action Validation (Gate 2)
Goal: Ensure bulk "Translate document" action is visible & functional before deeper investments.
13. ☐ Create test document type (e.g. `translationTest`) minimal fields (DEV)
14. ☐ Confirm Assist panel loads and per-field suggestions work (DEV)
15. ☐ Verify presence of bulk "Translate document" action (DEV)
16. ⏸ If missing: Collect diagnostics (plugin versions, apiVersion, network calls) (DEV)
17. ☐ Run bulk translate on sample doc EN→NL, assess quality (CON/SEO)
18. ☐ Record quality notes + decide acceptable post-edit workload threshold (CON)
19. ☐ Decide GO / NO-GO on relying on Assist for first-pass translations (PROD)

Gate 2 Exit Criteria: Decision documented (GO or fallback to manual). If NO-GO, create spike ticket for custom translation workflow.

---
## Phase 3 – Schema Localization Enablement (Gate 3)
Goal: Introduce `language` field & enforce per-locale uniqueness only after plugin proven.
20. ☐ Add hidden `language` (radio: nl/en) to document-level types (`page`, `post`, `product`, `productCategory`, `category`, `settings`, `navigation`) (DEV)
21. ☐ Add per-locale slug uniqueness validator (`isUniqueWithinLocale`) (DEV)
22. ☐ Exclude system fields (slug, language) from Assist (DEV)
23. ☐ Add field-level `translateAction` hints (title, excerpt, body) (DEV)
24. ☐ Regenerate types (typegen) (DEV)
25. ☐ Update GROQ fragments to include `language` (DEV)
26. ☐ Add publish validation: prevent missing `language` or duplicate slug+language (DEV)

Gate 3 Exit Criteria: All targeted schemas updated; test create & publish works in both languages; validator triggers on collision.

---
## Phase 4 – Migration & Backfill (Gate 4)
Goal: Normalize existing dataset to new schema.
27. ☐ Migration script: patch existing docs with `language: 'en'` (DEV)
28. ☐ Collision script: assert no duplicate (en, slug) pairs (DEV)
29. ☐ Spot-check 10 random documents for correct language value (CON)
30. ☐ Tag dataset snapshot post-migration (OPS)

Gate 4 Exit Criteria: Migration idempotent; zero collisions reported.

---
## Phase 5 – Dutch Baseline Creation
31. ☐ Translate & link Home (CON)
32. ☐ Translate & link About (CON)
33. ☐ Translate & link Contact (CON)
34. ☐ Translate top 5 navigation destination pages (CON)
35. ☐ Translate top 5 traffic blog posts (CON)
36. ☐ Translate top 5 products + primary categories (CON)
37. ☐ Draft dashboard query: missing NL counterparts (DEV)

Exit Metric: ≥ 80% of core-nav & hero-linked routes have NL variant.

---
## Phase 6 – Routing & Query Filtering
38. ☐ Introduce `[lang]` segment (App Router) (DEV)
39. ☐ Add `lang` param to all fetchers / GROQ queries with `language == $lang` (DEV)
40. ☐ Extend `resolveHref(type, slug, lang)` + add tests (DEV)
41. ☐ Backward compatibility check (legacy URLs still work / redirect plan drafted) (DEV)
42. ☐ Verify sample pages render per-locale content (CON)

Exit Metric: No cross-locale bleed in queries (test harness green).

---
## Phase 7 – Metadata & SEO
43. ☐ Implement locale-aware `generateMetadata` helper (DEV)
44. ☐ Add hreflang builder reading translation groups (DEV)
45. ☐ Generate combined sitemap with alternates (DEV)
46. ☐ Validate canonical + hreflang for 5 paired pages (SEO)
47. ☐ Add x-default strategy decision (SEO) (PROD)

Exit Metric: Hreflang pairs resolve 200 status both locales.

---
## Phase 8 – Pricing & Alt Text Localization
48. ☐ Implement pricing Option 2 structured object (DEV)
49. ☐ Introduce localized alt text shape (e.g. `alt: { en, nl }`) into image blocks (DEV)
50. ☐ Validation: warn when required semantic image missing locale alt (DEV)
51. ☐ Add coverage report script (DEV)

Exit Metric: Alt coverage report shows ≥ 90% for baseline pages.

---
## Phase 9 – Reporting & Dashboards
52. ☐ Translation coverage script (pairs, parity %) (DEV)
53. ☐ Untranslated slugs report (DEV)
54. ☐ Alt text gap report (DEV)
55. ☐ Pricing localization readiness report (DEV)
56. ☐ Integrate progress % badge in README (optional) (DEV)

Exit Metric: Dashboard surfaces all four metrics with < 5s runtime.

---
## Phase 10 – Content Expansion & Parity Threshold
57. ☐ Reach 80% NL coverage of document-level types (CON)
58. ☐ Localize structured data for paired pages (DEV)
59. ☐ QA spot checks (random 20 pages) (ACC/SEO)

Exit Metric: Coverage script >= threshold; zero critical QA failures.

---
## Phase 11 – UI Internationalization (Deferred until Parity)
60. ☐ Decide framework (`next-intl` vs minimal custom) (DEV)
61. ☐ Extract UI strings to `/locales/en.json` & `/locales/nl.json` (DEV)
62. ☐ Implement locale switcher + persistence cookie (DEV)
63. ☐ Layout resilience test (long Dutch strings) (ACC)

Exit Metric: 0 layout regressions in test matrix.

---
## Phase 12 – Default Locale Flip (Conditional)
64. ☐ Confirm target parity (e.g. ≥ 85%) (PROD)
65. ☐ Generate 301 redirect map root EN → `/en/...` (DEV)
66. ☐ Staging dry run & log diff (OPS)
67. ☐ Flip defaultLocale to `nl` (DEV)
68. ☐ Regenerate sitemaps & purge CDN (OPS)
69. ☐ Post-flip verification checklist (PROD)

Exit Metric: Zero unexpected 404s & hreflang stable post-flip.

---
## Phase 13 – Post-Flip Hardening & Monitoring
70. ☐ Add telemetry events (switch, missing translation redirect) (DEV)
71. ☐ SLA aging buckets dashboard (DEV)
72. ☐ Escalate alt text validation from warn → error (ACC)
73. ☐ Weekly review ritual documented (PROD)

Exit Metric: All monitoring alerts green for 2 consecutive weeks.

---
## Phase 14 – Continuous Improvement
74. ☐ Evaluate third-locale readiness (PROD)
75. ☐ Generalize systems to locale array (DEV)
76. ☐ Incremental static regeneration strategy review (DEV)

---
## Blockers & Risks (Live Section)
- (Phase 2) Bulk Translate action not visible → BLOCKER. Mitigation path: verify plugin order, clear cache, test minimal Studio, confirm account feature access, raise support ticket if still absent.

---
## Progress Automation
Use script: `node scripts/report/action-plan-progress.mjs docs/action-plan/ACTIONS_V2.md` to output completion stats.

Metrics Reported:
- totalTasks
- doneCount (✔)
- inProgressCount (▶)
- blockedCount (⏸)
- percentDone (done / total)

---
## Gating Summary
Gate 1 (Plugins) → Gate 2 (Assist Validated) → Gate 3 (Schema) → Gate 4 (Migrated) → Baseline NL → Routing → SEO → Localization Depth → Parity → Flip → Hardening.

No downstream phase may start before prior gate exit criteria are satisfied (unless explicitly waived by Product + Tech Lead).

---
## Initial Status Snapshot
All tasks currently: Not Started (clean baseline).

---
## Appendices
- See Audit for: Risks, Cutover Playbook, Monitoring details.
- Future script ideas: enforce `language == $lang` lint, hreflang symmetry validator.
