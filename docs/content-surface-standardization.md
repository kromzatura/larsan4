# Content Surface Standardization Plan

> **Goal:** Align the implementation of pages, blog categories, product categories, and product detail surfaces so they share a consistent routing, data, and rendering pipeline—making the codebase predictable and fully ready for multilingual expansion.

---

## 1. Current Surfaces & Pain Points

| Surface | Route | Data source | Key inconsistencies |
| --- | --- | --- | --- |
| Pages | `/app/(main)/page.tsx`, `/app/(main)/[slug]/page.tsx` | `fetchSanityPageBySlug`, `PAGE_QUERY` | Uses `generatePageMetadata`; blocks expect `searchParams`; no locale context passed; static params slug-only. |
| Blog category | `/app/(main)/blog/category/[slug]/page.tsx` | `fetchSanityBlogCategoryBySlug`, blog post queries | Manual metadata construction + JSON-LD; pagination logic differs from products; share URLs hard-coded to English. |
| Product category | `/app/(main)/products/category/[slug]/page.tsx` | Product category/product queries | Delegates metadata to helper; pagination uses different param names; components rely on `ProductsTable` API not shared with blog. |
| Product detail | `/app/(main)/products/[slug]/page.tsx` | `fetchSanityProductBySlug`, `PRODUCT_QUERY` | Metadata helper used; share links built per component; spec tables unique logic; inquiry integration adds coupling to cart. |
| Blog post | `/app/(main)/blog/[slug]/page.tsx` | `fetchSanityPostBySlug`, `POST_QUERY` | Structured data uses inline share URL composition; headings extraction unique; metadata helper used but manual JSON-LD. |

Common themes:
- Multiple ways of building metadata/canonical/noindex logic.
- Slug lookups and static params vary in validation (some filter drafts, others don’t).
- Pagination/search params inconsistently named (`page`, `sort`, `category`).
- Share URL construction copies base URL logic everywhere.
- Components lack unified locale/context props.

---

## 2. Standardization Pillars

### 2.1 Routing & Params
- Migrate all public routes into `/app/[lang]/…` with shared `generateStaticParams({ lang })` utilities.
- Standardize dynamic params to `{ lang, slug, categorySlug? }` with helper types in `frontend/lib/routing.ts`.
- Normalize search params: `page`, `sort`, `category` across blog/product listings, with parsing helper.

### 2.2 Data Fetch Contracts
- Create `frontend/sanity/lib/contentSurfaces.ts` exposing typed fetchers:
  - `getPage({ lang, slug })`
  - `getBlogCategory({ lang, slug, pagination, sort })`
  - `getProductCategory({ lang, slug, pagination, sort })`
  - `getProduct({ lang, slug })`
  - `getPost({ lang, slug })`
- Each helper wraps shared `sanityFetch` config (perspective, stega, preview) and returns a uniform `{ data, notFound }` tuple to simplify route handling.

### 2.3 Query Composition
- Adopt fragment modules per surface under `frontend/sanity/queries/surfaces/` that export locale-aware GROQ strings.
- Ensure every surface query includes `meta`, timestamps, slug/title, and any nested references using fragments (e.g., `blogPostCardFragment`, `productCardFragment`).
- Generate TypeScript types per fragment via Sanity TypeGen and reuse in fetch helpers + components.

### 2.4 Metadata & Canonical Handling
- Expand `generatePageMetadata` into a dispatcher with surface-specific adapters: `page`, `blogCategory`, `productCategory`, `product`, `post`.
- Provide `buildCanonical({ lang, path, searchParams })` so canonical/noindex decisions live in one place.
- Centralize JSON-LD builders (Article, BreadcrumbList, Product) in `frontend/lib/seo/jsonld.ts` so routes call declarative helpers.

### 2.5 Component Contract Alignment
- Define `LocaleProps = { lang: SupportedLocale }` and ensure all Blocks/sections/components accept it.
- Create shared list components:
  - `CategoryListing` (used by blog + product categories) with slots for item renderers.
  - `ContentShareBar` for share buttons with auto-generated URLs.
  - `BreadcrumbTrail` with locale-aware links.
- Refactor `PostsList`, `ProductsTable`, and other cards to consume normalized data shapes (e.g., `ContentCard` interface).

### 2.6 Utilities & Helpers
- Introduce `frontend/lib/url.ts` with `createShareUrl`, `buildRouteHref`, and `appendSearchParams` utilities.
- Implement ESLint rule (or lint script) flagging raw `process.env.NEXT_PUBLIC_SITE_URL` usage outside helper.
- Provide `parsePaginationParams` that clamps negative/NaN pages and returns `notFound` flag.

---

## 3. Implementation Blueprint

### Phase A — Foundations (1 sprint)
1. Ship `/app/[lang]/layout.tsx`, locale context, and `/app/page.tsx` redirect (no middleware).
2. Create routing helper + TypeScript types; migrate `resolveHref` to consume it.
3. Scaffold new fetch helper module returning standardized contracts.

### Phase B — Query & Metadata Alignment (1-2 sprints)
1. Refactor GROQ fragments with `$lang` parameters and shared card fragments.
2. Update `generatePageMetadata` + canonical builder + JSON-LD helpers.
3. Adjust routes to consume new helpers while preserving existing UI.

### Phase C — Component Convergence (2 sprints)
1. Refactor listing components (`PostsList`, `ProductsTable`) to shared interfaces.
2. Introduce `ContentShareBar`, `CategoryListing`, and update surfaces to use them.
3. Inject `lang` props through Blocks and block components.

### Phase D — Validation & Automation (1 sprint)
1. Add unit tests covering new helpers (routing, metadata, share URLs).
2. Introduce integration tests for each surface verifying consistent pagination/metadata behavior.
3. Document standardization guidelines in `docs/engineering/content-surfaces.md`.

---

## 4. Task Seeds

1. ADR: “Unified Content Surface Architecture” covering routing, data, metadata decisions.
2. Issue: Implement `frontend/lib/routing.ts` + `/app/page.tsx` locale redirect.
3. Issue: Refactor `sanity/lib/fetch.ts` into surface-based helpers.
4. Issue: Consolidate canonical logic into `generatePageMetadata` adapter pattern.
5. Issue: Create shared `ContentShareBar` + replace inline share code across surfaces.
6. Issue: Normalize pagination parameter handling for blog/product listings.
7. Issue: Update ESLint config to forbid raw site URL usage.

---

## 5. Success Metrics

- **Consistency:** All surface routes consume the same helper APIs and metadata pipeline.
- **Maintainability:** Adding a new locale or content surface requires implementing a fragment + adapter, not re-creating bespoke logic.
- **Reliability:** Pagination, canonical tags, and share URLs behave identically for blog vs. product categories.
- **Preparedness:** Locale parameter propagation becomes trivial because every surface already expects `lang`.

---

## 6. Next Steps

- Review plan with engineering team and assign ADR owner.
- Prioritize Phase A tasks for the upcoming sprint to unlock locale routing.
- Schedule cross-team walkthrough to align on component contract changes before refactors begin.
