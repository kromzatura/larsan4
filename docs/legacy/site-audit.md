# Site Audit — September 16, 2025

This audit reviews the current architecture, shared components, routing, data-fetching, SEO, accessibility, performance, and content modeling. It highlights what is working well, risks, and prioritized recommendations.

## Architecture Overview

- Framework: Next.js 15 (App Router) + React 19
- Styling/UI: Tailwind CSS + shadcn/ui
- CMS: Sanity Studio v3; frontend via `next-sanity`
- Pattern: Block-based page composition with dynamic component mapping (`components/blocks/index.tsx`)
- Data-fetch: Server Components, `fetchSanity*` helpers, ISR where appropriate

## Shared Components Inventory

- UI Primitives: buttons, badges, avatar, accordion, tabs, tooltip, etc. (`components/ui/*`)
- Layout: `SectionContainer`, `Breadcrumbs`, `Pagination` (client)
- Content: `PortableTextRenderer`, `PostDate`
- Products: `ProductsTable` (client), `ClickableRow` (client), `AddToInquiryButton` (client)
- Blocks: Hero, Banner, Feature, Gallery, Pricing, Team, Timelines, Blog variants, Products variants, etc.

## Routing

- Pages
  - Home and generic pages via `[slug]` route rendering Blocks
  - `/products` with ISR (`revalidate = 60`)
  - `/products/category/[slug]`
  - `/blog/[slug]` (post detail)
- Blocks power page-level features (e.g., AllPosts16 for blog list inside a Page document)
- i18n: Not implemented; app is mono-lingual today

## Data Fetching & Caching

- Server Components fetch using `fetchSanity*` helpers
- Products: ISR used for index; category route renders server-side by slug
- Avoids passing functions across server-client boundary (fixed by introducing `baseUrl`, `baseSearchParams` into `ProductsTable`)

## SEO & Metadata

- Centralized `generatePageMetadata` helper (Sanity-backed)
- Products:
  - `/products`: `noindex` on `page > 1`, canonical to `/products` (or `/products/category/[category]` when filtered)
  - `/products/category/[slug]`: `noindex, nofollow` on `page > 1`, canonical to non-paginated category URL
- Post detail: uses centralized metadata
- Blog index: rendered through Blocks currently; no dedicated `app/(main)/blog/page.tsx` route yet
- OG image routes present in `api/og/`

## Accessibility (a11y)

- Interactive focus styles present for chips/buttons/table rows
- `ClickableRow` preserves native interactions and supports keyboard activation
- Semantic elements used in most places; Breadcrumbs present
- Improvements:
  - Add skip-to-content link and landmark roles (`<main>`, `<nav>`, `<aside>`) consistently
  - Ensure link-underlines on hover for better contrast/affordance across the site
  - Validate color contrast for muted text in table rows

## Performance

- Next/Image used with URL builder for product thumbs
- Server-side fetching prevents waterfalls; ISR for `/products`
- Opportunities:
  - Defer heavy components with `next/dynamic` where needed
  - Ensure images include width/height and prioritized LCP images when appropriate
  - Consider `stale-while-revalidate` patterns for non-critical lists

## Content Modeling (Sanity)

- Decoupled product/specification model; orderable specifications
- `productCategory` dedicated to products; `category` document used for blog categories
- Blocks organized by domain (blog, products, etc.)
- Opportunities:
  - Ensure each shared block has complete previews and icons
  - Add validation and helpful descriptions per the schema guidance

## Type Safety & DX

- TypeGen enabled; GROQ queries composed per-block
- Some `any` remains in blocks mapping; goal: strengthen typing in `components/blocks/index.tsx`
- Linting and typecheck scripts in place; typecheck clean

## Security

- Portable Text rendering controlled; no raw HTML injection observed
- If embedding third-party content later, sanitize inputs and add CSP

---

## Risks

- Inconsistent list UX if future features render outside shared components (mitigated by `ProductsTable` extraction)
- Blog index pagination/SEO not standardized when rendered via Blocks on a Page
- Potential overuse of muted colors leading to contrast issues

## Recommendations (Prioritized)

### P0 — High Priority

1. Blog index route: add `app/(main)/blog/page.tsx` with server-side list and metadata
   - Use shared `Pagination` with `noindex` on `page > 1` and canonical to `/blog`
   - Add optional category filter (`/blog?category=`) with appropriate canonicalization
2. Blog category route: `app/(main)/blog/category/[slug]/page.tsx`
   - Mirror products/category: pagination, canonical to non-paginated category, `noindex` on paginated pages
3. Strengthen block typing in `components/blocks/index.tsx`
   - Replace spread `any` with a typed `componentMap` per schema

### P1 — Medium Priority

4. Shared PostsList component extraction
   - Extract from `AllPosts16` to ensure consistent UI in `/blog` and category routes
5. Add `generateMetadata` on `/blog` and category pages using centralized helper
6. Add “skip to content” link and consistent landmarks in `app/(main)/layout.tsx`

### P2 — Nice to Have

7. Add search across posts/products (server component, debounced client input)
8. Add author pages and category landing enhancements (copy, image, counts)
9. Add `sitemap.ts` entries for `/products/category/*` and `/blog/category/*`

---

## Acceptance Criteria

- Blog index and category pages use a shared list component, with stable SEO (canonical + noindex on paginated)
- Blocks renderer has strongly typed `componentMap` without `any`
- A11y: keyboard navigation and focus states validated across lists and pagination
- Typecheck and lint pass; no Next.js server/client boundary warnings
