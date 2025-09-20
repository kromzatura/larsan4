# Issue 001: TypeScript & Lint Problems Consolidation

## Goal
Reduce current surfaced Problems panel (17 items) to zero and establish guardrails preventing regression.

## Scope (Phase 0 Quick Fixes)
- Replace internal `<a>` links flagged by `@next/next/no-html-link-for-pages` with `next/link`.
- Remove or underscore-prefix (`_var`) unused imports and locals.
- Address obvious `no-img-element` (decide keep for OG or migrate to `next/image`).
- Add missing dependency in `feature12` effect or justify with comment.

## Out of Scope (Handled in separate issues)
- Broad elimination of `any` types (See Issue 003).
- Style system refactors (Issue 002).

## Tasks
1. Blog pages & category pages: replace `<a>` with `<Link>`.
2. Navbar & disable-draft-mode components: internal link corrections.
3. Remove unused imports (ContactForm, Button, Fragment, etc.).
4. Purge unused local vars (`status`, `description`, indices not used).
5. Decide OG route `<img>` strategy (keep + disable rule or convert to `Image`).
6. Add missing dependency in `feature12` or explanatory comment.
7. Run `pnpm lint` and confirm zero new errors.
8. Add CI lint script (if not present) to root package.json.

## Acceptance Criteria
- `pnpm lint` exits 0.
- No Problems panel entries for TypeScript/ESLint (excluding intentional rule disables documented inline).
- OG image decision documented in code comment.

## Follow-Up
Proceed to Issue 003 to tackle structural typing improvements.
