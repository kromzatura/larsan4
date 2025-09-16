# Products + Categories Implementation Plan (Revised)

Goal: Add Products and Product Categories to Sanity + Next.js, using a scalable, reference-based architecture for product specifications to ensure data consistency and an efficient authoring experience.

## Overview

- Add Sanity schemas for `specification` (reusable document), `productCategory`, and `product`.
- The `product` schema references a `specification` document instead of embedding fields.
- GROQ queries + typed fetch helpers will expand the referenced specification data.
- Next.js routes:
  - `/products/[slug]`: Single product page
  - `/products/category/[slug]`: Products in a category
  - Optional: `/products`: Page composed with an “All Products” block
- Reusable “All Products” block with pagination.
- Metadata handled centrally via `generatePageMetadata` (no manual objects).
- Inquiry System foundation (localStorage helpers + React Context) to support an “Add to Inquiry” button on product and listing UIs.

## Constraints

- Use centralized SEO helper (`generatePageMetadata`) for ALL new routes.
- Keep types strict; no `as any`.
- Keep work focused on the `feat/products-categories` branch.

Phase 1 — Studio Schemas (Corrected)
Create studio/schemas/documents/specification.ts

Purpose: A reusable, standalone document for a complete product specification sheet.

Fields:

name: string (internal reference, e.g., "Mustard Seed Spec Sheet")

sku: string

bestFor: string

pungency: string

bindingCapacity: string

fatContent: number

purity: string

moisture: string

hsCode: string

minOrder: string

origin: string

botanicalName: string

shelfLife: string

allergenInfo: string

productAttributes: string

certification: string

Preview: name, sku

Type & validation
fatContent: number
pungency, bindingCapacity, purity, moisture: string (values like "<10%" or "Very Good")
Required: name, sku
Optional: all other fields
Slug: not required for specification (no public route)
Single source of truth: keep sku only on specification (do not duplicate on product)

Create studio/schemas/documents/productCategory.ts

Fields: title, slug, optional color, optional orderRankField, meta (SEO).
Ordering: use `orderRankField` for manual control over display order.

Preview: title

Create studio/schemas/documents/product.ts (Corrected)

This schema is now much simpler and focused on marketing content.

Fields:

title: string (required)

slug: slug (required, unique)

specifications: reference (points to specification document)

keyFeatures: array of { type: 'string' } (for the marketing bullet points)

packagingOptions: array of { type: 'object', fields: [...] }

images: array of image (hotspot enabled)

body: Portable Text (optional marketing description)

categories: array<reference to productCategory> (multi-select)

meta object for SEO.

Preview: title, images[0]

Editing UX
Groups: mirror `post` groups (content / seo / settings)
Images: reuse shared `image` object with hotspot for consistency

Register all new schemas in studio/schema.ts and organize them in your desk structure.

Acceptance (Phase 1)

[ ] New Specification, Product Category, and Product document types appear in the Studio.

[ ] When editing a Product, you can select a Specification from a dropdown list.

[ ] The Product schema is clean and does not contain redundant fields.

[ ] Typegen runs without errors.

## Phase 2 — GROQ + Typegen (Revised)

1. Update `product.ts` query to expand the reference:
   - PRODUCT_QUERY
   - Snippet:
     - `*[_type == "product" && slug.current == $slug][0]{ ..., "specifications": specifications->{ ... } }`
2. Add other queries under `frontend/sanity/queries/product/`:
   - `products.ts`: `PRODUCTS_QUERY` (paginated), `PRODUCTS_COUNT_QUERY`
   - `slugs.ts`: `PRODUCTS_SLUGS_QUERY`
   - `byCategory.ts`: `PRODUCTS_BY_CATEGORY_QUERY`
3. Add fetch helpers to `frontend/sanity/lib/fetch.ts` for all queries.
4. Run typegen from Studio and confirm `frontend/sanity.types.ts` includes nested `specifications` types.

Defaults
Pagination: 12 products per page by default
Sorting: categories by `orderRank`, product listings by `_createdAt desc`

Acceptance (Phase 2)

- [ ] Queries compile and correctly expand the specifications reference.
- [ ] Typegen succeeds; generated types reflect the nested structure.

## Phase 3 — Frontend Routes

1. `/products/[slug]`
   - Implement the single product page. ask user for details - user provide code for a compenent, and advise about design and functionlaity on xl and mobile
   - `generateStaticParams()` from `PRODUCTS_SLUGS_QUERY`
   - `generateMetadata()` via `generatePageMetadata({ page: product, slug: \`products/${slug}\`, type: "page" })`
   - Data shape includes nested `specifications` (e.g., `product.specifications.sku`).
2. `/products/category/[slug]`
   - Find category by slug; list products referencing it
   - `generateMetadata()` uses category object with helper (falls back to title/description)
   - Simple listing of linked product titles/cards
   - Sorting: category lists by `orderRank`; product lists default to `_createdAt desc`
   - Pagination: default page size of 12 where applicable

Acceptance (Phase 3)

- [ ] Both routes build and render the correct data, including nested specification details.
- [ ] Metadata generated via helper (no manual objects)

## Phase 4 — Inquiry System Foundation

Create Inquiry Helpers

- Location: `frontend/lib/inquiry.ts`
- Responsibilities: manage a list of product items in `localStorage` (getItems, addItem, removeItem, clear, isInInquiry), with a stable storage key.
- Data shape: `InquiryItem` minimal structure (e.g., `{ id|_id, slug, title, imageUrl }`).

Create Global State

- Location: `frontend/components/inquiry/InquiryContext.tsx` (or similar)
- Responsibilities: React Context + Provider exposing state and actions to any component (product page, listing blocks).
- Integration: wrap the App layout/provider once we’re ready to wire UI.

Notes

- Storage key: `inquiry:products:v1`
- Item identity: use `product._id` for dedupe; payload `{ _id, slug, title, imageUrl }`
- Button placement: integrate on both the single product page and each card in the All Products block
- You will provide the helper code and UI design for the button; I will integrate them when we reach this phase. Please share those assets when prompted.

Acceptance (Phase 4)

- [ ] Helper functions can successfully manage a list of products in localStorage.
- [ ] The InquiryContext is created and can be provided to the application layout.

## Phase 5 — Reusable “All Products” Block

1. Studio block schema `all-products-16` (mirroring all-posts-16), copilot must ask user about fields and functionality, user must provide all info and confirm before proceeding.

   - Fields: `padding` (section-padding), optional `title/description` if needed later
   - Group under “products” in the page builder insert menu

2. GROQ snippet `all-products-16` and include it in `PAGE_QUERY`
3. Frontend block component `AllProducts16`
   - Lists products; supports pagination (`searchParams.page`) like `all-posts-*`
   - Styling consistent with existing blocks (chips/cards)
4. Block renderer
   - Add `"all-products-16"` to the base `componentMap` (no type assertions)
   - Only pass `searchParams` to blocks that need it (as done with posts)
5. Typegen
   - Re-run to include the new block `_type`

Acceptance (Phase 5)

- [ ] Block is available in Studio and renders on a page
- [ ] Pagination works and is SSR-safe
- [ ] Types are strict with no `as any`

## Phase 6 — /products Page

- Create a CMS page (e.g., `slug: "products"`)
- Add the “All Products” block to its `blocks[]`
- Ensure route is listed in Next.js build output

Acceptance (Phase 6)

- [ ] `/products` renders with the block

## Phase 7 — Navigation + Linking

- Add header/footer links to `/products`
- Product card links to `/products/[slug]`
- Category chips/tags under product link to `/products/category/[slug]`

Acceptance (Phase 7)

- [ ] Nav and internal links present and correct

## Phase 8 — SEO & Metadata

- Ensure `product` and `productCategory` documents have `meta` fields aligned with existing usage
- `generatePageMetadata` must be used everywhere
- OG Images: use `meta.image` if present, fallback to `/api/og?type=page&slug=...`
- Respect `noindex` in meta
- Sitemap: include `/products/[slug]` and `/products/category/[slug]` in `app/sitemap.ts`
- Robots: index by default unless `meta.noindex` is true

Acceptance (Phase 8)

- [ ] Metadata is generated solely by the helper
- [ ] OG images show up as expected

## Phase 9 — QA & Validation

- Build checks: `pnpm -C frontend build`
- Type/lint checks pass
- Sample content in Studio renders correctly
- Pagination edge-cases (empty pages, invalid page numbers)

## Phase 10 — Rollout

- Work on `feat/products-categories`
- Keep PRs small and focused per phase when possible
- After approval, merge to `main`

Tracking Checklist (High-level)
[ ] Phase 1 — Schemas (Corrected)

[ ] Phase 2 — GROQ + Typegen (Revised)

[ ] Phase 3 — Routes

[ ] Phase 4 — Inquiry System Foundation

[ ] Phase 5 — Block

[ ] Phase 6 — /products page

[ ] Phase 7 — Navigation + Linking

[ ] Phase 8 — SEO & Metadata

[ ] Phase 9 — QA & Validation

[ ] Phase 10 — Rollout

## Notes & Decisions

- Blog category routes now live under `/blog/category/[slug]`.
- Products will follow the same pattern under `/products/category/[slug]`.
- If we need filters on listing pages, we’ll re-use `searchParams` and GROQ filtering like posts.
- If performance becomes a concern, consider a light-weight index query for listing blocks.
- Studio desk structure: add Specification, Product Categories, and Products to `studio/structure.ts` for clear navigation.

---

Prepared for review and approval. Once approved, I’ll start with Phase 1 on `feat/products-categories`.
