# Blog Work Plan

This plan outlines the work to standardize the blog experience across listing, categories, and post detail with consistent UI, accessibility, and SEO.

## Goals

- Provide a dedicated `/blog` index route with pagination and canonical/noindex handling
- Provide `/blog/category/[slug]` route mirroring products category treatment
- Extract a shared `PostsList` component and reuse across routes and Blocks
- Keep data fetching server-side with `fetchSanity*` helpers and typed GROQ

## Deliverables

- `app/(main)/blog/page.tsx`
  - Server component rendering posts with pagination
  - `generateMetadata` using centralized helper; canonical `/blog`; `noindex` on `page > 1`
- `app/(main)/blog/category/[slug]/page.tsx`
  - Server component fetching by category slug with pagination and sort (optional newest/A–Z/Z–A)
  - Metadata: canonical to non-paginated category; `noindex` on paginated
- `components/posts/posts-list.tsx` (client)
  - Presentational component for list rows/cards with pagination using `baseUrl`/`baseSearchParams`
  - A11y focus states, keyboard navigation where applicable
- Queries
  - `frontend/sanity/queries/post.ts` updates: POSTS_QUERY paginated; POSTS_BY_CATEGORY_QUERY with variants
- Optional: Blog categories chips block (like product categories) for filter navigation

## Steps

1. Extract `PostsList` from `components/blocks/blog/blog16/all-posts.tsx`
2. Implement `/app/(main)/blog/page.tsx` using `PostsList`
3. Implement `/app/(main)/blog/category/[slug]/page.tsx` using `PostsList`
4. Update `AllPosts16` to delegate UI to `PostsList`
5. Add `generateMetadata` for both routes, including `noindex` + canonical on paginated
6. Verify a11y and SEO; update sitemap entries if needed

## Acceptance Criteria

- `/blog` and `/blog/category/[slug]` render the same list UI via `PostsList`
- Pagination works; canonical and robots directives correct for page > 1
- Blocks variant `all-posts-16` reuses `PostsList` and remains functional
- Typecheck passes; no server/client boundary violations
