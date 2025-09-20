# Category Page → Products Table Unification Plan

## Goal

Unify the product presentation across the `/products` page and the category pages so both use the same table UI, improving consistency, accessibility, and maintainability.

## Approach

Extract a reusable presentational component `ProductsTable` and use it in:

- AllProducts16 block (container fetches, table renders)
- Category page (`/products/category/[slug]`) using existing sort + pagination

## Scope

- Create `frontend/components/products/products-table.tsx`
- Move table markup and row logic from `all-products-16` into `ProductsTable`
- Keep existing `ClickableRow` and `AddToInquiryButton` behavior
- Wire `ProductsTable` into the Category page instead of grid cards
- Keep existing sort controls; table remains agnostic to sort state
- Keep pagination external: table receives `currentPage`, `totalPages`, `createPageUrl`

## API (ProductsTable)

Props:

- `products`: `NonNullable<PRODUCTS_QUERYResult>`
- `currentPage`: `number`
- `totalPages`: `number`
- `createPageUrl(page: number): string`
- `activeCategory?`: `string` — highlights chips in `/products` flow
- `emptyState?: { message: string; clearHref?: string }`

Behavior:

- Same columns as AllProducts16: image/title/SKU, categories, key features, attributes, action
- Renders `Pagination` below when `totalPages > 1`
- No data fetching inside; purely presentational

## Steps

1. Extract table component

- Create `frontend/components/products/products-table.tsx`
- Move table JSX + row logic from `all-products-16`
- Accept props for `products`, `currentPage`, `totalPages`, `createPageUrl`, `activeCategory`, `emptyState`

2. Refactor AllProducts16 to use ProductsTable

- Keep fetching (products + counts + category check) in block
- Replace inline table JSX with `<ProductsTable ... />`

3. Switch Category Page to ProductsTable

- Replace grid cards in `app/(main)/products/category/[slug]/page.tsx`
- Pass fetched `products`, `currentPage`, `totalPages`, `createPageUrl`
- Set `emptyState={{ message: "No products in this category yet." }}`

4. QA & polish

- Verify: sorting, pagination, inquiry, category chips, empty state, a11y
- Confirm no CLS or hydration warnings

## Acceptance Criteria

- Both `/products` and `/products/category/[slug]` render identical tables
- Sorting/pagination work as before; URLs preserved
- Inquiry button works from both routes
- a11y: headers have `scope="col"`, focus-visible rings intact, rows clickable via keyboard
- No TypeScript errors; CI typecheck passes

## Risks & Mitigations

- Layout change on category pages: stakeholders should approve table UI (we can retain a view toggle later)
- Shared component drift: Centralizing table reduces drift; document props and usage

## Follow-ups (Optional)

- Add `view=grid|table` toggle and reusable `ProductCard`
- Add unit test(s) for `fetchSanityProductsByCategory` sorting paths
