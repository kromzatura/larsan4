# Migration Plan: Alt Text & Pricing

Date: 2025-09-28

## Alt Text Migration
| Phase | Goal | Action |
|-------|------|--------|
| Prep | Introduce schema | Add `localizedAltText` object; do not enforce |
| Gate 4 | Populate EN | Script: find images missing en -> set temporary placeholder like `TODO: describe image` |
| Gate 5 | Enforce both | Set validation to required for en/nl |

## Pricing Migration
| Step | Detail |
|------|--------|
| 1 | Extract existing pricing block tiers (map by slug/title) |
| 2 | Generate canonical tiers array per product |
| 3 | Insert `pricing` object into `product` docs |
| 4 | Mark original block tier arrays as legacy (UI description note) |
| 5 | Frontend fallback logic removed when adoption ≥ 95% |

## Scripts (Future)
- `scripts/coverage-alt-text.mjs`
- `scripts/coverage-pricing.mjs`
- `scripts/migrate-build-pricing.mjs`

## Rollback Strategy
- If pricing object adoption causes issues, revert frontend preference order (legacy first) and keep dual write until stable.
