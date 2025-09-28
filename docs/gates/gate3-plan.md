# Gate 3 Plan: Structured Localized Fields (Alt Text + Pricing)

Date: 2025-09-28

Objective: Introduce structured, locale-aware non-document fields without breaking existing queries; add localized alt text object & normalized pricing object referencing product data.

Scope (Initial):
1. Localized Alt Text Object (`localizedAltText`)
2. Product Pricing Object (`productPricing` + embedded tier arrays)
3. Query & component adaptation (lazy / additive; maintain backward compatibility for a transition window)

Out of Scope (Gate 3):
- Removing legacy inline price fields inside existing pricing blocks (sunset scheduled Gate 5).
- Introducing currency exchange automation.
- Adding additional locales beyond en/nl.

Exit Criteria:
1. Schemas added & registered (behind feature flag constant or commented out until migration ready)
2. Migration plan authored (no execution yet) for backfilling alt text placeholders and pricing normalization
3. Frontend components adjusted to use new fields when present (fallback to old)
4. GROQ fragments updated with conditional projection for new shapes
5. Validation: alt text warns if missing during transition; required post Gate 4

Risks & Mitigations:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Missing alt text reduces accessibility | Medium | Phased validation & coverage script |
| Pricing divergence between legacy blocks & new object | High | Single source of truth migration + runtime fallback check |
| Query bloat from dual shapes | Low | Use Coalesce/groq condition + prune legacy at Gate 5 |

Next Steps After Gate 3:
Gate 4: Migrations executed & coverage reports (alt text completeness, pricing adoption %).

---

## Gate 3 Decision Log (2025-09-28)

### Localized Alt Text Strategy
Adopted a dual-field transitional approach in `image` schema:
1. Retain legacy `alt` (string) for backward compatibility and existing frontend usage.
2. Introduced `localizedAltText` object (fields: `en`, `nl`) to enable per-locale enrichment.

Rationale:
- Avoids immediate frontend breakage or mandatory migration.
- Enables future coverage reporting (percent of images with both `en` + `nl`).
- Reduces duplication cost when locale count grows beyond two.

Transition Plan:
- Gate 3: Both fields optional; guidance via descriptions & warnings only.
- Gate 4: Coverage script + require `localizedAltText.en` for any new/updated image.
- Gate 5: Deprecate legacy `alt` (remove from schema & migration sets `localizedAltText.en = alt` if still blank).

Frontend Fallback Order (to implement during Gate 3 frontend pass):
`localizedAltText[currentLocale] -> localizedAltText.en -> alt -> ''`

### Pricing Feature Flag
Structured pricing (`productPricing`) added behind environment variable `NEXT_PUBLIC_ENABLE_STRUCTURED_PRICING`.
This allows enabling in staging, validating editor workflow & queries before enforcing adoption.

### Coverage & Validation Scripts (Planned)
- `scripts/check-alt-coverage.mjs`: Count images missing localized values per locale.
- `scripts/check-pricing-adoption.mjs`: Ratio of products using new `pricing` object vs total products.

### Sunset Conditions
- Legacy `alt` removed only after >95% images have `localizedAltText.en` and >85% have `localizedAltText.nl` (targets adjustable in Gate 4 review).
- Legacy pricing blocks deprecated after all active pricing pages resolve exclusively from `productPricing`.

### Rollback (2025-09-28, Later Same Day)
Decision: Reverted introduction of `localizedAltText` inside `image` schema.

Reasoning:
- Current project uses full document duplication per locale; alt text differs naturally per localized document.
- Added object created redundancy without delivering audit value yet.
- Simplifies editorial UI (one field) and removes premature abstraction.

Deferred Trigger to Reintroduce:
1. Locale count > 2 OR
2. Need for intra-document locale alt auditing becomes explicit OR
3. Move toward hybrid localization model (mix of doc- and field-level) OR
4. Accessibility initiative requiring single-query multi-locale alt extraction.

Rollback Actions Completed:
- Removed `localizedAltText` field from `image` schema.
- Simplified image GROQ fragment to legacy `alt` only.
- Left object schema file in repository for potential future reuse (benign if registered but unused).

Impact Assessment:
- No data loss (no production content relied on new field yet).
- Frontend unaffected (no code had shipped depending on `resolvedAlt`).
- Documentation updated to reflect deferral.

### Pricing Query Integration (2025-09-28)
Product GROQ queries updated to project `pricing`:
- Detail query (`PRODUCT_QUERY`) returns full pricing object via fragment (currency + all tiers with descriptions & features).
- List / category queries return lightweight pricing summary (currency + tier slugs + monthly/yearly numbers) to minimize payload.
No feature flag gating applied at query layer; frontend can safely null-check `pricing` until content adoption grows.

