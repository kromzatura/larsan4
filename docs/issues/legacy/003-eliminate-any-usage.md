# Issue 003: Strategic Elimination of `any` Types

## Goal
Replace unsafe `any` usages with explicit domain types, unions, or `unknown` + narrowing while preserving development velocity.

## Categorization
1. Content Data (Blog posts, products, categories, comparison data)
2. Sanity Block Unions (dynamic rendering map)
3. Form Data (contact form, inquiry forms)
4. Utility callbacks (map/reduce temporary vars)

## Strategy
- Derive types from `sanity.types.ts` first; extend with local augmentation file `types/content.ts`.
- Introduce minimal purpose-built interfaces: `FeedPost`, `ComparisonFeature`, `ProductComparison`.
- Use discriminated unions for block renderer where feasible: extract `_type` union from existing `PAGE_QUERYResult`.
- Where structure is heterogeneous or forward-evolving, prefer `unknown` then narrow rather than `any`.

## Tasks
1. Create `frontend/types/content.ts` exporting new interfaces.
2. Update feed & RSS route handlers to use `FeedPost[]`.
3. Type blog list & detail pages (remove mapper `any`).
4. Type compare blocks (map data structures, remove mass `any`).
5. Adjust block renderer (`components/blocks/index.tsx`) generics: replace `any` with union extraction.
6. Replace form handler `any` with `ContactFormValues` & inferred zod schema types.
7. Add selective `eslint-disable-next-line` only where narrowing is impractical (document why).
8. Run `pnpm lint` ensure no new errors; ensure typecheck passes.

## Acceptance Criteria
- 90% reduction of `no-explicit-any` lint errors (target near zero; max 2 intentional disables documented).
- No new runtime regressions (spot check key pages).
- Added types file < 150 lines while eliminating ≥150 lines of scattered `any` risk.

## Follow-Up
Coordinate with Issue 005 (contrast tests) once types stabilize to integrate automated structural checks if desired.
