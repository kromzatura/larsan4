# Dataset Export Placeholder

Date: 2025-09-28

An actual dataset export (`sanity dataset export production exports/production-2025-09-28.tar.gz`) was NOT executed in this environment (likely missing auth / tokens). Before proceeding past Gate 0 in a real environment:

1. Run:
   ```bash
   cd studio
   npx sanity dataset export production ../exports/production-$(date +%F).tar.gz
   ```
2. Commit the generated tarball to a secure artifact store (DO NOT commit large export to repo).
3. Record SHA256 of the tarball in this file for integrity.

Placeholder recorded to satisfy process traceability.
