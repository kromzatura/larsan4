# Baseline Dataset & Snapshot Procedure (Gate 0)

Purpose: Ensure we can revert or audit changes introduced by translation enablement, pricing normalization, and subsequent localization phases.

## Snapshot Timing
- Pre-Gate1 (before enabling `ENABLE_I18N_V2` in production Studio)
- Post-Gate4 (after language backfill & pricing normalization complete)

## Snapshot Methods
### 1. Sanity CLI Export
```
sanity dataset export production exports/production-<DATE>-pre-gate1.tar.gz
```
Store under `backups/` (not committed) and attach checksum in ops runbook.

### 2. Targeted NDJSON Extract (Optional)
For faster diffing of critical doc types:
```
sanity documents query '*[_type in ["page","post","product","productCategory","navigation","settings"]]{_id,_type,slug,language}' > exports/core-docs-<DATE>.ndjson
```

### 3. Pricing Normalization Verification
After migration apply script:
```
node scripts/verify-pricing-normalization.mjs --project $SANITY_STUDIO_PROJECT_ID --dataset production --token $SANITY_API_READ_TOKEN --json > exports/pricing-verify-<DATE>.json
```

## Rollback Playbook (High-Level)
1. Pause deploys.
2. Export current dataset for forensic diff.
3. Import pre-change snapshot:
```
sanity dataset import exports/production-<DATE>-pre-gate1.tar.gz production --replace
```
4. Clear frontend cache / redeploy.

## Integrity Checks Post-Restore
- Random 5 docs per type exist.
- Queries (homepage, product page) resolve 200.
- Pricing verification returns zero legacy/mixed (if rolling back post-migration, adjust expectation).

## Hash & Audit Trail
Record SHA256 for each snapshot archive in internal ops log.

## Not In Git
Snapshots are large & contain potentially sensitive data. Do not commit to repository.

## Observability Hooks (Future)
- Add script to diff counts per type between snapshot and live.
- Add orphan locale check output attached to snapshot record.

## Current Status
Gate 0 evidence partially backfilled after forward progress; this document formalizes process to satisfy governance review.
