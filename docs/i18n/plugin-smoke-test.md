# I18N V2 Plugin Smoke Test

Purpose: Rapid validation that `documentInternationalization` plugin is active and functioning when `ENABLE_I18N_V2=true`.

## Pre-conditions
- Environment variable `ENABLE_I18N_V2=true` present in `.env.local` for Studio.
- User has permission to create/edit documents.
- `LOCALES` currently: `en`, `nl`.

## Steps
1. Start Studio: `pnpm --filter studio dev`.
2. Open an existing translatable document (e.g. a `page`).
3. EXPECT a language dropdown / translation toolbar showing `English (Default)` and `Dutch`.
4. Click `Create translation` for `nl`.
5. EXPECT a new draft in Dutch with identical initial field values (except slug if auto-generated).
6. Edit a text field in Dutch version and publish.
7. Switch back to English.
8. EXPECT original English content unchanged.
9. Toggle `ENABLE_I18N_V2` to `false` and restart Studio.
10. EXPECT translation UI to disappear while existing language field values remain intact.

## Pass Criteria
- All EXPECT assertions succeed.
- No console errors referencing `documentInternationalization`.
- Rollback (flag off) hides UI without schema errors.

## Troubleshooting
| Symptom | Checks |
|---------|--------|
| Translation UI missing when flag=true | Ensure env var loaded (log `process.env.ENABLE_I18N_V2`), clear build cache, verify plugin precedes `assist()` in config. |
| Error: unsupported language id | Confirm `LOCALES` array matches `supportedLanguages` mapping. |
| Assist bulk actions missing | Confirm plugin enabled (flag true) and user has sufficient permissions; reload after enabling. |
| Duplicate translation documents | Run drift check script (future), manually unpublish orphan translation docs. |

## Rollback Procedure
1. Set `ENABLE_I18N_V2=false`.
2. Redeploy Studio.
3. All translation UI disappears; content remains accessible via existing language fields.

## Notes
- This smoke test should be re-run after any schema addition to `schemaTypes` list.
- Add new document types to `schemaTypes` only when localization is required; update drift check script if needed.
