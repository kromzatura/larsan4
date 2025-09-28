# Gate 2 Plan: Assist Translation Quality & Workflow Validation

Date: 2025-09-28

Objective: Evaluate AI Assist + document i18n plugin synergy for producing initial NL translations from EN source docs, establishing quality + effort baselines before structural schema localization work (alt text objects, pricing objects) begins.

Scope Documents (sample set):
- 2 `page` docs (marketing style variance: one hero-heavy, one feature/pricing heavy)
- 1 `post` doc (medium length rich text)
- 1 `product` doc (short spec oriented)
- 1 `specification` doc (technical attributes & descriptive text) ← Added to validate structured + prose mix

Metrics / Rubric Dimensions:
| Dimension | Description | Scoring |
|-----------|-------------|---------|
| Accuracy | Meaning preserved vs source | 1–5 |
| Terminology | Consistent with domain glossary (if any) | 1–5 |
| Readability | Natural Dutch phrasing | 1–5 |
| Structure | Portable text / block integrity maintained | 1–5 |
| Manual Effort | % of blocks needing edits | % (0–100) |

Exit Criteria:
1. All sample docs created in EN and translated to NL (status shows translation doc exists or translation draft created).
2. Coverage script reports 100% translation presence for sample set fields (title, slug, primary SEO fields, body/blocks) excluding deliberately deferred elements (pricing currency localization, alt text objects not yet introduced).
3. Average rubric score ≥ 4.0 across non-effort dimensions OR remediation plan documented.
4. Manual effort ≤ 30% of blocks needing adjustment OR documented mitigation (glossary seeding, prompt optimization).

Artifacts To Produce:
- `docs/gates/gate2-verification.md` with rubric table filled.
- `i18n-gate2-sample-docs.ndjson` (EN sources only; import then translate inside Studio).
- Coverage script output JSON block.
- Notes on Assist prompt adjustments (if applied).

Out of Scope:
- Adding new schema localization fields.
- Introducing localized alt text or pricing structures.

Risks & Mitigations:
- Inconsistent terminology → create temporary glossary section in verification doc.
- Slug collisions in NL → note and reserve strategy (unique slug per locale via plugin UI).

Next Gate Dependency: Gate 3 (introduce localized structural fields) only after Gate 2 exit criteria met.
