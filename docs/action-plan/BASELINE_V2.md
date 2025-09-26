# Baseline V2 (Pre-Translation Plugin)

Date: 2025-09-26
Branch: i18n (pre Phase 1)

## Snapshot Summary

- Schema directory hash: 8c1e8aded8411f1006a1ffd9f008f9f86cf00729cbc06bd129c068777fb54ea7 (see `scripts/report/schema-hash.mjs`)
- Schema file count: 107
- Translation plugin not installed (`documentInternationalization` string absent in repo)
- No `language` field on document-level schemas (`grep` scan found none)
- Assist package present: @sanity/assist@^5.0.0
- Studio Sanity version: `sanity@^4.5.0`
- Other relevant packages: `@sanity/vision@^4.5.0`, `@sanity/ui@^3.0.7`

## Recommended Dataset Export Command (run manually)

```
cd studio
npx sanity dataset export production ../dataset-backups/production-pre-i18n-2025-09-26.tar.gz
```

(Create `dataset-backups/` if it does not exist.)

## Gate 0 Exit Criteria Checklist

- [x] Inventory current schemas
- [x] Record dependency versions
- [x] Confirm absence of language fields
- [x] Schema hash captured
- [ ] Dataset snapshot archived (pending manual run)

> Proceed to Phase 1 once dataset export is completed or explicitly waived.
