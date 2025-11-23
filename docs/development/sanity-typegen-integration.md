# Sanity TypeGen Integration Roadmap

This document outlines the phased adoption of Sanity TypeGen to eliminate manually curated content types (e.g. `ProductLike`, `PortableText*` fragments) and reduce runtime drift between Studio schemas and frontend rendering logic.

## Goals

- Single source of truth for schema-derived TypeScript types.
- Remove hand-rolled interfaces (`ProductLike`, ad‑hoc portable text value shapes).
- Provide safer refactors and earlier CI failure surface when schema evolves.
- Enable narrower component props (exact field presence, unions for polymorphic blocks).

## Prerequisites

- Sanity Studio >= v4 already present in `studio/`.
- Functional schema organization (block/object/document types exported individually).
- Node 18+ (present via Next.js requirements).

## Phase 1: Baseline Generation

1. From project root run initial extraction to ensure Studio emits canonical schema JSON:
   ```bash
   cd studio
   pnpm sanity typegen generate
   ```
2. This produces `sanity-typegen.json` (already present) and a generated types file (default: `./.sanity/types.ts`).
3. Move or copy the generated types file to `frontend/` root (e.g. `frontend/sanity.types.ts`) overwriting existing placeholder if necessary.
4. Commit both updated files.

## Phase 2: Frontend Consumption

1. Replace manual types:
   - Remove `ProductLike` in `portable-text-renderer.tsx`; import generated `Product` type.
   - Replace `PortableTextImage` with `Extract<PortableTextBlockType, {_type:"image"}>` patterns where possible.
2. Introduce a central `content-types.ts` in `frontend/lib/` that re-exports narrowed extracted types used across blocks to avoid deep import paths from the generated file.
3. Refactor block components to use discriminated unions instead of loose `any` or `unknown` fields.

## Phase 3: Portable Text Specialization

1. Define a helper type in `content-types.ts`:
   ```ts
   export type PortableTextBlock = NonNullable<
     NonNullable<PAGE_QUERYResult>["blocks"]
   >[number];
   ```
2. Derive specific block types via `Extract<PortableTextBlock, { _type: "product-callout" }>` etc.
3. Update `componentMap` patterns across block renderers to use strictly extracted component types.

## Phase 4: Strict Rendering Enhancements

1. Replace generic heading handlers with explicit value shapes if headings carry extra metadata in future (e.g. anchor overrides).
2. Swap runtime guards (like image dimension fallback) for compile-time guarantees once schema ensures presence (`metadata.dimensions` required).
3. Introduce exhaustive checks: e.g. a utility `assertNever` for unrecognized `_type` in dynamic maps.

## Phase 5: CI Enforcement

1. Add a script in `frontend/package.json`:
   ```json
   "scripts": {
     "typegen:sync": "cd ../studio && pnpm sanity typegen generate && cp ./.sanity/types.ts ../frontend/sanity.types.ts"
   }
   ```
2. In root CI pipeline (Netlify / GitHub Actions) run `pnpm --filter frontend typegen:sync` before `pnpm build`.
3. Fail build if diff detected between committed `sanity.types.ts` and newly generated version to force explicit updates.

## Phase 6: Developer DX

1. Provide ESLint rule (optional) or custom lint script checking for forbidden manual types (`ProductLike`).
2. Add README section pointing to this doc for onboarding.

## Phase 7: Cleanup & Hardening

1. Delete deprecated manual type aliases once migration completed.
2. Remove transitional nullish checks replaced by compile-time guarantees.
3. Document exception cases (e.g. draft-only fields, experimental schema features) requiring `@sanity-typegen-ignore`.

## Handling Portable Text Marks & Custom Objects

- For marks (e.g. `link`) rely on generated types; if mark schema includes conditional fields, create a narrowed union.
- Where generated types are too permissive (e.g. optional fields you treat as required), add runtime invariant checks early and narrow the type with type predicates.

## Image Fallback Strategy Post-TypeGen

Once schema enforces `asset -> metadata -> dimensions` presence, remove width/height fallbacks. Keep lqip fallback only if hotspot or blur can be optional.

## Ongoing Maintenance Checklist

- [ ] Run `pnpm typegen:sync` after any schema file modification.
- [ ] Review diff; refactor components relying on changed field names/types.
- [ ] Remove obsolete guards replaced by stricter schema constraints.
- [ ] Update query fragments if new fields added to schema that affect rendering.

## Risks & Mitigations

- Risk: Schema change not followed by type sync → drift.
  - Mitigation: CI diff enforcement.
- Risk: Over-narrowing types cause excessive refactors.
  - Mitigation: Start with generated baseline, narrow only stable, high-value areas.
- Risk: Editors lag in updating types.
  - Mitigation: Encourage running sync on pre-commit hook (optional).

## Next Immediate Actions

1. Implement `typegen:sync` script.
2. Migrate `ProductLike` usages.
3. Add CI enforcement.

---

Last updated: 2025-11-23
