# Gate 4 Plan: Migrations & Coverage Enforcement

Date: 2025-09-28

## Objective
Execute controlled migrations and introduce quantitative coverage reporting for newly structured fields (pricing) and translation completeness—without regressing performance or editorial velocity.

## In-Scope
1. Pricing Adoption Coverage
   - Report % of `product` documents with populated `pricing.tiers`.
   - Identify products with partially filled tiers (missing monthly & yearly).
2. Translation Coverage Expansion
   - Extend existing coverage script to include newly internationalized document types (`faq`, `specification`).
3. Migration Dry Runs
   - Prepare (but do not yet enforce) migration script to backfill pricing from any legacy pricing blocks (if such fields exist) or mark TODO markers.
4. Validation Hardening (Incremental)
   - `product.pricing.currency` required when `pricing` object exists (already enforced).
   - Add rule: at least one numeric price present per tier (monthly OR yearly).
5. Documentation & Evidence
   - Capture before/after metrics for pricing adoption and translation counts.

## Out of Scope (Gate 4)
- Removing legacy pricing UI blocks (scheduled Gate 5).
- Enforcing pricing object presence on all products (Gate 5 decision after adoption rate).
- Re-introducing localized alt text object (deferred per Gate 3 rollback decision).

## Exit Criteria
| # | Criterion | Measurement Method | Target |
|---|-----------|--------------------|--------|
| 1 | Pricing coverage report implemented | `scripts/check-pricing-adoption.mjs` output | PASS (script runs, JSON output) |
| 2 | Translation coverage includes faq/specification | Extended coverage script output | PASS |
| 3 | Migration script dry-run available | `scripts/migrate-pricing-dry-run.mjs --dry` | PASS |
| 4 | Tier validation rule active | Studio prevents invalid save | PASS |
| 5 | Documentation updated | Update to Gate 3 & 4 verification docs | PASS |

## Metrics to Capture (Baseline -> After)
- `products_total`
- `products_with_pricing`
- `pricing_adoption_percent`
- `avg_tiers_per_priced_product`
- `translation_counts` per type & locale

## Implementation Steps
1. Script: `scripts/check-pricing-adoption.mjs`
2. Extend existing translation coverage script (include faq/specification explicitly & output JSON schema v2).
3. Add validation to `pricingTier` schema: at least one of monthly/yearly required.
4. Add migration dry-run script `scripts/migrate-pricing-dry-run.mjs` (collect & map prospective transforms; no writes yet).
5. Update gate docs (verification) to include new commands & sample outputs.
6. Capture baseline metrics (commit JSON snapshot `metrics-gate4-baseline.json`).
7. (Optional) Add CI guard stub (non-blocking) to display adoption stats.

## Rollback Strategy
All Gate 4 changes are additive. To rollback:
- Remove added validation rule (pricingTier schema) if blocking editors.
- Delete / revert scripts (no data mutations occur in Gate 4).

## Risk Register
| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Migration script misinterprets legacy pricing | Medium | Low | Dry-run only; manual review before Gate 5 write mode |
| Coverage script performance degradation | Low | Low | Limit fields projected; paginate if needed later |
| Editor friction from new validation | Low | Medium | Only enforce minimal numeric presence per tier |

## Open Questions
- Do legacy pricing blocks exist that can be deterministically mapped? (Need audit.)
- Should we record pricing currency mismatch stats? (Potential Gate 4 enhancement.)

## Commands (Planned)
- Adoption: `node scripts/check-pricing-adoption.mjs --format json`
- Translation coverage (v2): `node scripts/check-translation-coverage.mjs --types product,post,page,faq,specification`
- Migration dry-run: `node scripts/migrate-pricing-dry-run.mjs --dry`

## Acceptance Checklist
- [ ] Pricing adoption script created & documented
- [ ] Translation coverage script updated
- [ ] pricingTier validation updated (monthly || yearly)
- [ ] Dry-run migration script present
- [ ] Baseline metrics file committed
- [ ] Gate 4 verification doc drafted (future file: `gate4-verification.md`)

