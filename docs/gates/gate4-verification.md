# Gate 4 Verification

Purpose: Establish baseline quantitative metrics and validation hardening before enforcement (Gate 5). This doc records how to reproduce and validate coverage + pricing integrity.

## Metrics Captured
- Translation coverage v2 (types: page, post, product, faq, specification)
- Pricing adoption snapshot (planned script placeholder)
- Pricing tier validation (schema-level rule now enforced)

## Prerequisites
- Node environment with repo installed
- Sanity dataset exported (or use production dataset via SANITY_* env vars)
- If offline: export dataset to NDJSON first

```
npx sanity dataset export <dataset> ./exports/<dataset>-baseline
```

Optionally concatenate relevant document types into a single NDJSON for faster local analysis.

## Commands
(Executed from repo root)

1. Translation Coverage (v2)
```
node scripts/check-translation-coverage.mjs exports/<dataset>-baseline/data.ndjson --types page,post,product,faq,specification > metrics/translation-coverage.gate4.json
```

2. (Placeholder) Pricing Adoption
```
# TODO (Gate 4 mid-phase): node scripts/check-pricing-adoption.mjs > metrics/pricing-adoption.gate4.json
```

3. (Optional) Drift & Rubric Scripts
```
# If present
node scripts/check-drift.mjs > metrics/drift.gate4.json
node scripts/evaluate-rubric.mjs > metrics/rubric.gate4.json
```

## Translation Coverage v2 JSON Schema (Informal)
```
{
  version: 2,
  requiredLocales: string[],
  filteredTypes: string[] | null,
  total: number,                // total composite keys (type::slug)
  complete: number,             // keys that have all required locales
  coveragePercent: number,      // (complete/total)*100 fixed(1)
  perType: {
    [type: string]: { total: number, complete: number, coveragePercent: number }
  },
  details: Array<{
    key: string,                // type::slugOrId
    type: string,
    locales: string[],
    missingLocales: string[],
    counts: { [locale: string]: number },
    complete: boolean
  }>
}
```

## Acceptance Checklist
- [ ] translation-coverage.gate4.json generated & stored in `metrics/`
- [ ] coveragePercent recorded in this doc below
- [ ] No pricing tier documents violate new monthly/yearly rule (Studio validation passes)
- [ ] Pricing adoption script placeholder acknowledged (to be implemented before Gate 4 exit)

## Baseline Snapshot
Populate after running scripts:
```
Translation Coverage: <pending>
Per-Type:
  page: <pending>
  post: <pending>
  product: <pending>
  faq: <pending>
  specification: <pending>
```

## Notes
- Locale inference currently defaults to first required locale if ambiguous. Ensure future documents include `_lang` for explicitness if plugin supports.
- Adding new locales requires updating `requiredLocales` constant in the script and re-running baseline capture.
