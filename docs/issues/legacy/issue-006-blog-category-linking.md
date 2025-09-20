# Issue 004: Blog Category Linking Resolves to Top-Level Page

Status: Deferred (will return after current TypeScript hygiene phase tasks)  
First Observed: 2025-09-20  
Reported Symptom: Attempting to navigate to a blog category page instead routes to `/<slug>` (example: `/product-deep-dive` instead of `/blog/category/product-deep-dive`).

## Reproduction (Current Evidence)
1. In Sanity Studio, open `Navigation` > `footer` (screenshot provided by user).  
2. Edit a navigation item referencing the blog category "Product deep dive" via the generic internal link UI.  
3. Front-end renders link as `href="/product-deep-dive"`.  
4. Clicking navigates to the generic dynamic route `app/(main)/[slug]/page.tsx` instead of the category route `app/(main)/blog/category/[slug]/page.tsx`.

## Expected Behavior
Internal links that target a blog category document should produce a canonical path of `/blog/category/<slug>`.

## Actual Behavior
Internal links generated from navigation (and potentially other structured internal link fields) use the category slug without the required `/blog/category/` prefix, colliding with top-level dynamic slugs.

## Impact / Risk
- SEO: Category pages lack canonical / structured URL exposure when mislinked, affecting indexing and internal link equity.
- User Experience: Users may land on an unintended generic page if a naming collision exists.
- Content Authoring: Authors must remember to manually prepend `/blog/category/` (error-prone, not enforced by schema UI).

## Technical Context
- Category route exists: `app/(main)/blog/category/[slug]/page.tsx` (works when directly visited or via correctly constructed links like the category chips in the blog listing component).
- Generic catch-all dynamic page: `app/(main)/[slug]/page.tsx` naturally matches any root-level path with a slug.
- No centralized `resolveHref` or link resolution helper for different Sanity document types.
- Portable Text and navigation internal links currently pass through the slug-derived path verbatim.

## Hypothesized Root Cause
Absence of a deterministic mapping layer from Sanity document type → canonical front-end route. The internal link field likely stores a reference to the category document, and the front-end component derives an `href` using only `slug.current`, defaulting to `/<slug>`.

## Supporting Evidence
- Blog category chips inside the blog list view do work (they explicitly construct `/blog/category/${category.slug.current}`).  
- Navigation item (screenshot) shows internal link referencing category but resolved preview path is `/product-deep-dive`.
- Build artifacts and source confirm existence of both routes; Next.js chooses the simpler matching route when given `/product-deep-dive`.

## Proposed Solutions (Options)
### A. Content Hotfix (Manual)
Manually prefix affected navigation (and other) links with `/blog/category/`.  
Pros: Immediate fix.  
Cons: Fragile; editors can regress.

### B. Introduce `resolveHref` Utility (Recommended First)
Create a shared function:
```ts
export function resolveHref(docType: string, slug: string): string | null {
  switch (docType) {
    case 'blogCategory':
      return `/blog/category/${slug}`;
    case 'post':
      return `/blog/${slug}`;
    case 'productCategory':
      return `/products/category/${slug}`;
    case 'product':
      return `/products/${slug}`;
    case 'page':
      return `/${slug}`;
    default:
      return null;
  }
}
```
Refactor navigation & link-rendering components to use it when they resolve a Sanity reference.  
Pros: Centralizes logic; low refactor surface.  
Cons: Requires coordinated update of multiple components.

### C. Enrich Internal Link Schema
Add an explicit `type` selector or embed the referenced doc `_type` in the selection, then call `resolveHref` automatically.  
Pros: Future-proof typing.  
Cons: Studio schema changes; content migration might be needed.

### D. Transform Portable Text & Nav at Render
At render time, if a referenced doc is of type `blogCategory`, override `href` to `/blog/category/<slug>`.  
Pros: Minimal schema change.  
Cons: Logic fragmentation if not centralized; duplicate heuristics.

### E. Internal Link Reference Mark Type (Longer-Term)
Implement an `internalLink` mark referencing a document; resolve with `resolveHref`.  
Pros: Strong typing; eliminates manual URL errors in rich text.  
Cons: Requires portable text schema + renderer updates.

## Recommended Path
1. Implement Option B (`resolveHref`) immediately.  
2. Refactor navigation item component(s) to use the helper (ensures category links are correct).  
3. Add guard rails: if a category is detected but resulting href lacks `/blog/category/`, log a warning in development.  
4. (Later) Upgrade rich text marks to structured references (Option E) to harden authoring.

## Deferred Actions
- Implement `resolveHref` utility & refactor nav links.
- Audit existing navigation items & rich text links for bare category slugs.
- Consider adding migration script / editorial checklist.

## Acceptance Criteria (When We Return)
- Navigation links to blog categories always render `/blog/category/<slug>`.
- No category link in the UI resolves to a root-level path.
- A single source of truth (`resolveHref`) is used across navigation, portable text, and block components.
- Documentation updated to reference new helper and authoring guidelines.

## Notes
We will resume after continuing Phase 002/003 TypeScript hygiene tasks. This document is the canonical reference for picking the issue back up.
