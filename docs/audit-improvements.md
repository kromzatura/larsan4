# Audit Improvements & Actionable Items

This document tracks the actionable improvements identified during the code audit of the products and categories features.

## Quick Wins (High Priority)

These items offer the most impact for the least effort and should be addressed first.

- [x] **Enhance Table UX**:
  - Implement full-row click to navigate to the product page. (all-products-16)
  - Use a safe overlay to ensure the "Add to Inquiry" button remains clickable. (clickable-row + z-index fixes)
  - Increase the width of the "Add to Inquiry" button for better visibility (`w-full max-w-44`). (all-products-16)
- [x] **Improve Accessibility**:
  - Add `scope="col"` to all `<th>` elements in the products table for better screen reader support. (all-products-16)
  - Ensure all interactive elements (chips, badges) have a visible focus state (e.g., `focus-visible:ring`). (product-categories-16)
- [ ] **Refine UI Polish**:
  - Standardize table cell padding to `px-6 py-4`.
  - Check and align the `ul` for key features to ensure consistent indentation.

## Code & Architecture Refinements

These items improve code quality, reduce fragility, and enhance developer experience.

- [x] **Refactor Query Sorting**:
  - Replace the string-based `order()` injection in `fetchSanityProductsByCategory` with a more robust solution (e.g., a small switch with multiple query constants).
- [ ] **Strengthen Component Typing**:
  - In `frontend/components/blocks/index.tsx`, create a typed map for component props to eliminate `...(block as any)` and ensure props are only passed to components that need them.
- [ ] **Improve Caching Strategy**:
  - For the `/products` page, consider adding a short `revalidate` time (e.g., `export const revalidate = 60`) to `page.tsx` as an alternative to `force-dynamic` if content is not updated in real-time.

## SEO & Content Enhancements

- [x] **Refine SEO for Paginated Content**:
  - In `generatePageMetadata` for `/products`, add logic to set `robots: 'noindex'` if `searchParams.page` is greater than 1.
- [x] **Improve Empty/Invalid States**:
  - In `AllProducts16`, when a category is invalid, display a message like "Category not found" to provide clearer user feedback.

## Remaining Actions (Owners / Files)

- [ ] Table spacing polish (frontend):
  - File: `frontend/components/blocks/products/all-products-16/index.tsx`
  - Ensure `px-6 py-4` on all cells and tidy list spacing in features column.
- [ ] Limit searchParams pass-through (frontend):
  - File: `frontend/components/blocks/index.tsx`
  - Create a typed prop map so only product-related blocks receive `searchParams`.
- [ ] Optional: Product page ISR (frontend):
  - File: `frontend/app/(main)/products/page.tsx`
  - Replace `dynamic = "force-dynamic"` with `export const revalidate = 60` if acceptable.
