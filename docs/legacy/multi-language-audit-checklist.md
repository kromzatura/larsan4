# Multilingual Conversion Audit Checklist

> **Goal:** Evaluate the existing single-locale implementation and produce a prioritized action list before converting the project to English + Dutch routing.

---

## 0. Current Frontend Snapshot

- **Rendering model:** Next.js App Router with a single `(main)` segment serving all public pages in English. All content, navigation, and metadata are fetched from Sanity in English only.
- **Top-level structure:**

```text
frontend/app
├── layout.tsx           # Global shell, sets <html lang="en">
├── globals.css
├── not-found.tsx
├── robots.ts
├── sitemap.ts
├── actions/             # Server actions
├── api/                 # Route handlers (English responses)
└── (main)/              # Primary marketing pages
		├── layout.tsx
		├── page.tsx         # Home
		├── blog/
		│   └── page.tsx
		├── contact/
		│   └── page.tsx
		├── inquiry/
		│   └── page.tsx
		├── products/
		│   └── page.tsx
		└── [slug]/
				└── page.tsx     # Dynamic CMS-driven pages
```

- **Supporting libraries:**
  - `frontend/lib/resolveHref.ts` for URL generation.
  - Block-based components under `frontend/components/blocks/` pulling from Sanity.
  - Metadata helper in `frontend/sanity/queries/` + `@/sanity/lib/metadata` (currently English only).

## 0.1 Proposed Locale-aware Structure

> Serve English at `/` (default locale) and Dutch at `/nl`, using a `[lang]` segment with optional parallel route groups for layout reuse.

```text
frontend/app
├── [lang]/
│   ├── layout.tsx           # Sets <html lang>, injects locale context
│   ├── page.tsx             # Home per locale (moved from (main)/page.tsx)
│   ├── blog/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── inquiry/
│   │   └── page.tsx
│   ├── products/
│   │   └── page.tsx
│   └── [slug]/
│       └── page.tsx
├── layout.tsx               # Root provider; redirects to default locale when no prefix
├── middleware.ts            # (new) Locale detection and redirects
├── robots.ts                # Emit hreflang entries
└── sitemap.ts               # All locales represented
```

- Introduce `frontend/lib/i18n/`:

  - `config.ts` containing `DEFAULT_LOCALE = "en"`, `SUPPORTED_LOCALES = ["en", "nl"]`, fallback map, and formatting helpers.
  - `routing.ts` helpers to prepend locale prefixes while preserving default locale without prefix.

- Update `frontend/components` to accept `lang` prop or derive from context where necessary (nav, footer, forms).

## 0.2 Page Migration & Creation Plan

| Current Path                    | Action                 | Target Path                                                                        | Notes                                                                                            |
| ------------------------------- | ---------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `/app/layout.tsx`               | Split responsibilities | Root `layout.tsx` (bootstrap only) + `/app/[lang]/layout.tsx` (locale-aware shell) | Root layout sets up providers and redirects to `DEFAULT_LOCALE`.                                 |
| `/app/(main)/page.tsx`          | Move                   | `/app/[lang]/page.tsx`                                                             | Fetch home content per locale via Sanity query with `lang`.                                      |
| `/app/(main)/blog/page.tsx`     | Move                   | `/app/[lang]/blog/page.tsx`                                                        | Ensure pagination/query accept `lang`.                                                           |
| `/app/(main)/contact/page.tsx`  | Move                   | `/app/[lang]/contact/page.tsx`                                                     | Localize form copy, validation, submission emails.                                               |
| `/app/(main)/inquiry/page.tsx`  | Move                   | `/app/[lang]/inquiry/page.tsx`                                                     | Mirror contact handling with localized copy.                                                     |
| `/app/(main)/products/page.tsx` | Move                   | `/app/[lang]/products/page.tsx`                                                    | Update product queries to request locale-specific fields.                                        |
| `/app/(main)/[slug]/page.tsx`   | Move                   | `/app/[lang]/[slug]/page.tsx`                                                      | Introduce localized slug resolution and fallback logic.                                          |
| `frontend/components/header/*`  | Update                 | n/a                                                                                | Accept `lang`, fetch localized nav from Sanity, route to locale-prefixed links.                  |
| `frontend/components/footer/*`  | Update                 | n/a                                                                                | Localize utility links, contact info, legal copy.                                                |
| `frontend/sanity/queries`       | Update                 | n/a                                                                                | Parameterize GROQ fragments with `$lang` and return locale-specific fields.                      |
| `middleware.ts`                 | Create new             | `/app/middleware.ts`                                                               | Detect locale (accept-language, cookies) and redirect `/` → `/en` (or default), `/nl` preserved. |

## 0.3 Header & Footer Audit

### Header (`frontend/components/header/navbar-1.tsx`)

- **Data sources:** `fetchSanitySettings()` (logo, site name), `getNavigationItems("header")`, `getNavigationItems("header-action")`.
- **Structure:**
  - Desktop navigation uses `NavigationMenu` with support for link groups (`link-group` schema) and individual CTA buttons.
  - Mobile navigation renders an accordion inside a Radix `Sheet`; action buttons reuse `LinkButton` and include the `InquiryBadge` component.
- **Localization considerations:**
  - Navigation titles/descriptions rely entirely on Sanity—safe to translate now.
  - Fallback label `"Logo"` is hard-coded (English) when no logo asset exists; should be localized or replaced with locale-specific site name.
  - All generated links default to `/` or plain `href` values; need to prepend locale prefix via updated `resolveHref` once `[lang]` routing lands.
  - `InquiryBadge` currently renders English copy; audit that component and underlying Sanity fields for locale readiness.

### Footer (`frontend/components/footer/footer-2.tsx`)

- **Data sources:** `fetchSanitySettings()` (logo, description, copyright), `getNavigationItems("footer")`, `getNavigationItems("footer-bottom")`.
- **Structure:**
  - Top grid renders logo + site description alongside grouped navigation columns.
  - Bottom bar prints dynamic year and bottom navigation links, using `PortableTextRenderer` for rich-text copyright.
- **Localization considerations:**

  - Footer nav titles/links come from Sanity, ready for translation.
  - Fallback `"Logo"` string mirrors the header behavior—localize or ensure translated site name always exists.
  - `settings.description` and rich-text copyright must become locale-aware fields (ensure Sanity settings document stores variants).
  - Year symbol uses runtime `new Date()` (locale-neutral) but surrounding copy should be translatable if expanded.
  - Ensure legal/privacy links respect locale prefixes and point to localized documents.

  ## 0.4 Execution Sequence (Pre-Migration)

  1.  **Prepare shared navigation**
      - Update `resolveHref`, `navbar-1.tsx`, `footer-2.tsx`, and `LinkButton`/`InquiryBadge` to accept a `lang` parameter and emit locale-prefixed URLs.
      - Confirm Sanity settings/navigation documents expose localized variants for titles, descriptions, and CTA labels.
      - Run snapshot/manual tests across desktop and mobile menus to guarantee parity before structural moves.
  2.  **Freeze new page work**
      - Announce a content/code freeze on new route creation until the `[lang]` scaffold is merged, preventing rework.
  3.  **Execute folder migration**
      - Relocate `/app/(main)/**` into `/app/[lang]/**`, wiring `layout.tsx`, `generateMetadata`, and `generateStaticParams` to pass `lang`.
      - Introduce `middleware.ts` and locale utilities to keep legacy URLs working during rollout.
  4.  **Post-move validation**
      - Smoke test navigation and footer in both locales.
      - Verify redirects from legacy paths, metadata output, and analytics events before unfreezing feature work.

---

## 0.5 Blog & Product Category Audit

### Blog categories (`category` document)

- **Translatable fields:** `title`, `slug`, `description`, `color`, and every nested value inside `seo` (`title`, `metaDescription`, `noindex`, `image`). The document already uses `orderRank`—keep ranks shared, but make it clear to editors that the visual ordering must be validated per locale.
- **Frontend surfaces:**
  - `/app/(main)/blog/category/[slug]/page.tsx` renders category detail views, paginated posts, and exposes sort toggles. The page currently builds metadata manually and injects JSON-LD breadcrumbs.
  - `/app/(main)/blog/category/[slug]/feed.json/route.ts` and `/app/(main)/blog/category/[slug]/rss.xml/route.ts` stream localized feeds; both embed category titles/descriptions.
  - `/app/sitemap.ts` lists every `category` document and relies on `slug.current` + `seo.noindex` to decide visibility.
  - `PostsList` and breadcrumb helpers surface category titles in UI lists.
- **Supporting queries & utilities:**
  - GROQ fragments in `frontend/sanity/queries/blogCategory.ts` (list, detail, posts, counts) and feed fragments (`FEED_POSTS_BY_CATEGORY_QUERY_NEWEST`).
  - Fetch helpers in `frontend/sanity/lib/fetch.ts` (`fetchSanityBlogCategoryBySlug`, `fetchSanityBlogCategories*`, `fetchSanityPostsByBlogCategory`, `fetchSanityPostsCountByBlogCategory`).
  - `resolveHref` + `CATEGORY_DOC_TYPES` ensure navigation/internal links target `/blog/category/${slug}`; once locales are introduced the helper must prepend `/${lang}`.
- **Migration to-do:**
  1.  Parameterize `BLOG_CATEGORY` queries with `$lang` and return locale-specific slug/title/metadata.
  2.  Update category pages, feeds, and sitemap builders to accept `lang`, translate breadcrumbs, and emit per-locale feed URLs.
  3.  Ensure Studio validation blocks publishing when a locale lacks `seo` values or translated slugs.
  4.  Hook category detail pages into the centralized `generatePageMetadata` helper so canonical + alternate links are consistent.

### Product categories (`productCategory` document)

- **Translatable fields:** `title`, `description`, `slug`, and the shared `meta` object (title, description, noindex, image). Ordering uses `orderRank` and should stay stable across locales unless regional merchandising differs.
- **Frontend surfaces:**
  - `/app/(main)/products/category/[slug]/page.tsx` renders each category, paginated product tables, and per-sort controls while delegating metadata to `generatePageMetadata` (`type: "productCategory"`).
  - `/app/sitemap.ts` emits product category URLs and respects `meta.noindex`.
  - `ProductsTable` displays category titles inside product chips.
- **Supporting queries & utilities:**
  - GROQ queries in `frontend/sanity/queries/product.ts` (`PRODUCT_CATEGORIES_QUERY`, `PRODUCT_CATEGORY_BY_SLUG_QUERY`, multiple `PRODUCTS_BY_CATEGORY_QUERY*`, and `PRODUCTS_COUNT_BY_CATEGORY_QUERY`).
  - Fetch helpers in `frontend/sanity/lib/fetch.ts` (category + product list/count functions) and `getOgImageUrl`, which already recognizes the `"productCategory"` type for OG generation.
- **Migration to-do:**
  1.  Thread `lang` through every product-category query and extend projections with localized nested fields.
  2.  Update `/products/category/[slug]` page + `ProductsTable` to consume locale-aware data (titles, descriptions, category chips) and emit localized pagination URLs.
  3.  Ensure `generatePageMetadata` receives localized `meta` content, and add locale-aware alternates/og URLs.
  4.  Revisit navigation + sitemap builders so product category links adopt locale prefixes and honor `meta.noindex` per locale.

## 0.6 Page Document Audit

### Page documents (`page` document)

- **Translatable fields:** `title`, `slug`, the entire `blocks` array (each nested hero/feature/blog/product block exposes copy, CTAs, and nested references), and the `meta` object (title, description, image, noindex). `orderRank` governs manual ordering and should remain shared unless locale-specific merchandising is required.
- **Frontend surfaces:**
  - `/app/(main)/page.tsx` renders the home page (`slug: "index"`) entirely from Sanity blocks and falls back to `MissingSanityPage` when the document is missing.
  - `/app/(main)/[slug]/page.tsx` powers every marketing page, using `generateStaticParams()` for static exports and `Blocks` to render nested content.
  - `/app/(main)/blog/page.tsx` and `/app/(main)/products/page.tsx` bootstrap their hero/intro content from `page` documents (`slug: "blog"`, `"products"`) before delegating to block-based listings.
  - `/app/api/og/route.tsx` reads `page.meta` for OG fallback titles/descriptions when generating social cards.
- **Supporting queries & utilities:**
  - GROQ fragments in `frontend/sanity/queries/page.ts` (`PAGE_QUERY`, `PAGES_SLUGS_QUERY`) assemble every allowed block type and merge `meta` fields.
  - Fetch helpers `fetchSanityPageBySlug` and `fetchSanityPagesStaticParams` (in `frontend/sanity/lib/fetch.ts`) power all page routes, metadata, and sitemap/static param generation.
  - `frontend/components/blocks/index.tsx` maps each Sanity block `_type` to its React implementation and already accepts `searchParams` for interactive modules—those props will need locale awareness.
  - Metadata helper `generatePageMetadata` (`@/sanity/lib/metadata`) consumes `page.meta` and current slug to emit canonical URLs; today it assumes English-only paths.
- **Migration to-do:**
  1.  Add `$lang` parameters to `PAGE_QUERY`/block fragments so every text, CTA, and nested reference resolves the correct locale variant.
  2.  Rescope `fetchSanityPagesStaticParams` and route files to return `{ lang, slug }`, ensuring `[lang]/[slug]` static params exclude drafts and only surface slugs defined for the active locale.
  3.  Update `Blocks` component (and each nested block renderer) to accept a `lang` prop or derive locale context, enabling localized CTAs, navigation links, and embedded listings.
  4.  Extend `generatePageMetadata` and the OG image route to inject locale-prefixed canonical/alternate URLs, translated titles/descriptions, and localized share imagery when available.
  5.  Create Studio validation that warns if a locale lacks required meta fields or block-level copy before publishing.

## 0.7 Product Detail Audit

### Products (`product` document)

- **Translatable fields:** `title`, `slug`, `keyFeatures`, `packagingOptions` labels/notes, `excerpt`, rich `body` content, all image `alt` text, and the `meta` object. Linked `specification` documents also contain customer-facing values (SKU labels, origin, allergen info) that should become locale-aware or have parallel localized specs per market.
- **Frontend surfaces:**
  - `/app/(main)/products/[slug]/page.tsx` renders product detail views, surfaces key features/spec tables, and constructs share URLs + inquiry payloads (`AddToInquiryButton`) from the product document.
  - `/app/(main)/products/page.tsx` and the `all-products-*` / `product-categories-*` blocks inside `Blocks` consume lists of `product` documents for cards, filters, and pagination.
  - `ProductsTable`, product badges inside category chips, and inquiry/cart utilities in `frontend/lib/inquiry.ts` rely on product titles/slugs to render UI copy and build internal links.
  - Share buttons and canonical logic on the product detail page assume English slugs when building outbound URLs via `NEXT_PUBLIC_SITE_URL`.
- **Supporting queries & utilities:**
  - GROQ in `frontend/sanity/queries/product.ts` (`PRODUCT_QUERY`, `PRODUCTS_QUERY`, `PRODUCTS_SLUGS_QUERY`, all `PRODUCTS_BY_CATEGORY_QUERY*`, and `PRODUCTS_COUNT*`) feeds detail pages, listings, and counts.
  - Fetch helpers `fetchSanityProductBySlug`, `fetchSanityProductSlugs`, `fetchSanityProducts`, and the product/category-specific helpers in `frontend/sanity/lib/fetch.ts` orchestrate data loading across routes/components.
  - `generatePageMetadata` is invoked with `{ type: "product" }` to build SEO per product, while `generateStaticParams` derives slugs from `fetchSanityProductSlugs()` with no locale context today.
  - OG generation helpers (`@/sanity/lib/metadata`, `getOgImageUrl`) emit image previews for product types using `meta.image`.
- **Migration to-do:**
  1.  Introduce `$lang` parameters across every product query and extend projections with localized nested fields (spec references, category titles, meta info).
  2.  Update `/products/[slug]` route to resolve `{ lang, slug }`, rebuild `shareUrl`/canonical logic with locale prefixes, and localize UI strings (e.g., "Key features", table headings) via dictionaries or Sanity fields.
  3.  Allow `ProductsTable`, category chips, and block-level product listings to accept `lang` and render locale-aware pagination URLs, filters, and button copy.
  4.  Ensure inquiry/cart flows store both the localized product name and a stable identifier so confirmations/emails echo the correct language.
  5.  Add Studio validation (or custom Publishing Assistance) that blocks publishing when a locale lacks translated `excerpt`, `meta`, or `packagingOptions` labels.

## 0.8 Page & Product Migration Priorities

1. **Design localized GROQ fragments** that can be shared across page and product surfaces, avoiding duplicate `$lang` handling when blocks embed product lists or CTAs.
2. **Refactor metadata + share helpers** so `generatePageMetadata`, `getOgImageUrl`, and share URL builders all receive `{ lang, slug }` and emit hreflang pairs consistently.
3. **Align block renderers with locale context**, passing `lang` down from `[lang]/layout.tsx` so hero CTAs, inquiry prompts, and product cards stay in sync with the route prefix.
4. **Update inquiry and navigation systems** to store/display localized titles while preserving invariant IDs, ensuring emails, breadcrumbs, and menu links reflect the visitor’s language.

## 0.9 Post Audit

### Blog posts (`post` document)

- **Translatable fields:** `title`, `slug`, `excerpt`, rich `body`, inline Portable Text marks (links, buttons), image `alt` text, and every field inside `meta` (title, description, image, noindex). Editor-controlled `publishedAt`, `featured`, and `author` references must support locale-aware scheduling/spotlighting, while `categories` rely on the localized taxonomy noted above.
- **Frontend surfaces:**
  - `/app/(main)/blog/page.tsx` renders the listing with sorting, pagination, and subscribe links, all sourced from `post` data.
  - `/app/(main)/blog/[slug]/page.tsx` powers individual articles, breadcrumbs, schema.org Article/Breadcrumb JSON-LD, share links, and author bio sections.
  - `/app/(main)/blog/category/[slug]/page.tsx` (documented earlier) embeds post excerpts/cards drawn from the same datasets.
  - `/app/(main)/blog/feed.json/route.ts` and `/app/(main)/blog/rss.xml/route.ts` output JSON + RSS feeds whose copy and URLs come straight from `post` fields.
  - `PostDate`, `PostsList`, `portable-text-renderer`, and chips/breadcrumb components display titles, excerpts, and category names derived from posts.
- **Supporting queries & utilities:**
  - GROQ fragments in `frontend/sanity/queries/post.ts` (`POST_QUERY`, `POSTS_QUERY`, `POSTS_QUERY_AZ/ZA`, `POSTS_SLUGS_QUERY`, `POSTS_COUNT_QUERY`) drive listings, detail pages, static params, and counts.
  - Fetch helpers `fetchSanityPosts`, `fetchSanityPostsCount`, `fetchSanityPostBySlug`, `fetchSanityPostsStaticParams`, plus category-scoped helpers in `frontend/sanity/lib/fetch.ts`, provide all runtime data.
  - Metadata + OG helpers (`generatePageMetadata`, `getOgImageUrl`) consume post meta to emit canonical URLs, alternates, and share imagery.
  - Feed serializers convert Portable Text to HTML/JSON strings, referencing `post` bodies and image assets.
- **Migration to-do:**
  1.  Thread `$lang` through every post query and embed localized author/category lookups, ensuring listings, detail pages, and feeds render the right language.
  2.  Rescope `fetchSanityPostsStaticParams` and blog routes to return `{ lang, slug }`, rejecting drafts or locales without translated slugs.
  3.  Localize listing UI copy (sorting labels, subscribe links, empty states) and derive share URLs/canonical links with locale prefixes (`/${lang}/blog/...`).
  4.  Update JSON-LD generators and feed serializers to output locale-specific titles, descriptions, and URLs, including localized author names if supplied.
  5.  Add Studio validation to require translated `excerpt`, `meta`, and hero image alt text per locale, and surface warnings when scheduled `publishedAt` is missing in a non-default language.

## 1. Content & Schema Inventory

| Step | Check                                                                                                | Output                                                                  |
| ---- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1.1  | List all Sanity document types (e.g., `page`, `settings`, `navigation`, blog/article docs).          | Spreadsheet or table enumerating documents and their purpose.           |
| 1.2  | Catalog block/object schemas and shared components (hero variants, grid cards, section headers).     | Matrix linking block types to the pages where they appear.              |
| 1.3  | Identify every field that contains copy, slugs, or metadata that must become locale-aware.           | Annotated schema list marking required translation fields.              |
| 1.4  | Capture references/arrays that rely on a single-locale document (navigation menus, related content). | Relationship diagram with notes on how references will map per locale.  |
| 1.5  | Review GROQ queries feeding each page and record the fields fetched.                                 | Document describing query fragments and which fields need localization. |

---

## 2. Routing & Navigation

| Step | Check                                                                                         | Output                                                        |
| ---- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 2.1  | Inventory all Next.js routes (static pages, dynamic segments, API endpoints).                 | Route map showing future `[lang]` segment placement.          |
| 2.2  | Audit `resolveHref`, navigation builders, and hard-coded links for single-locale assumptions. | Checklist of functions/components requiring locale parameter. |
| 2.3  | Locate inline links inside components and rich text that bypass centralized link helpers.     | Tagged list of components/content blocks needing refactor.    |
| 2.4  | Evaluate current redirects or rewrites that reference locale paths.                           | Redirect matrix including required updates for `/` vs `/nl`.  |

---

## 3. Metadata, SEO & Discovery

| Step | Check                                                                                   | Output                                                                        |
| ---- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 3.1  | Inspect `generateMetadata`, `robots.ts`, `sitemap.ts`, and any custom SEO helpers.      | Documented gaps for localized titles, descriptions, canonical URLs, hreflang. |
| 3.2  | Confirm Open Graph, Twitter cards, and structured data include locale-sensitive fields. | Checklist of metadata fields needing translation.                             |
| 3.3  | Record current analytics/marketing scripts that depend on locale.                       | Integration notes describing updates per locale.                              |
| 3.4  | Verify how canonical URLs are defined today and plan fallback strategy.                 | Decision on canonical handling for `/` vs `/nl`.                              |

---

## 4. UI, Accessibility & UX Copy

| Step | Check                                                                                    | Output                                                                        |
| ---- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 4.1  | Search codebase for hard-coded English strings outside Sanity (forms, modals, tooltips). | Catalog of strings to migrate into translation dictionaries or Sanity fields. |
| 4.2  | Inspect typography and icon sets for multilingual glyph support; note RTL requirements.  | Design considerations doc with font coverage and RTL readiness.               |
| 4.3  | Confirm `<html lang>` handling and plan to set per locale.                               | Implementation note for App Router layout.                                    |
| 4.4  | Review accessibility patterns (focus states, aria labels) for translation dependencies.  | Checklist ensuring translations maintain accessibility parity.                |

---

## 5. Build, Tests & Automation

| Step | Check                                                                                | Output                                                      |
| ---- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| 5.1  | Enumerate existing test coverage (unit, integration, e2e).                           | Testing inventory noting areas to extend for locales.       |
| 5.2  | Identify helpers that need locale-aware tests (`resolveHref`, formatting utilities). | Test plan specifying new cases per helper.                  |
| 5.3  | Review CI/CD pipeline (lint, typecheck, preview deploys) for locale awareness.       | Updated pipeline requirements including locale smoke tests. |
| 5.4  | Note manual QA processes used today and how they will expand for multi-locale.       | QA playbook outline covering multilingual checkpoints.      |

---

## 6. Operations & Team Workflow

| Step | Check                                                                               | Output                                                          |
| ---- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| 6.1  | Interview content editors/owners about translation responsibilities and turnaround. | Roles & responsibilities matrix for translation workflow.       |
| 6.2  | Decide translation sourcing (in-Studio manual vs. external CAT tool).               | Workflow decision document with tooling implications.           |
| 6.3  | Plan translation status tracking (fields, dashboards, review queues).               | Draft schema additions and Studio views for status tracking.    |
| 6.4  | Assess downstream systems (emails, CRM, analytics) for locale needs.                | Integration impact list and required updates.                   |
| 6.5  | Define launch criteria, rollback plan, and post-launch monitoring per locale.       | Runbook covering deployment gate checks and monitoring metrics. |

---

## 7. Risk & Priority Assessment

| Step | Check                                                                                     | Output                                                     |
| ---- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 7.1  | Score each identified gap by impact (High/Medium/Low) and effort.                         | Priority matrix guiding the conversion roadmap.            |
| 7.2  | Highlight dependencies between tasks (e.g., schema refactor before translation workflow). | Dependency graph or sequence diagram.                      |
| 7.3  | Draft phased roadmap (foundation → schema → content → SEO → QA → launch).                 | Project plan with timelines, owners, and success criteria. |

---

## Usage

1. Work through each section with the relevant stakeholders (engineering, content, design, marketing).
2. Fill in outputs directly in a shared tracker (spreadsheet, Notion, or additional markdown tables).
3. Convert the priority matrix into sprint-ready tasks once the audit is complete.
4. Keep this checklist updated as locales or requirements grow.
