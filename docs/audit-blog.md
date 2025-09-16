Status Update — 2025-09-16

- Done (P0): Pagination guards on blog and category; normalized sort SEO (noindex + canonical); counts restricted to `defined(slug)`; listings/counts/feeds use `perspective: "published"` with `stega: false`; typecheck clean.
- Outstanding:
	- P1: `excerpt` length rule; `publishedAt` and optional `featured`; optional category `noindex`; extend PT→HTML (lists/code/blockquote/embeds, image alt); add authors and image enclosures in feeds.
	- P2: JSON‑LD Article and Breadcrumb; improve a11y (aria-current on active sort, clearer labels).
	- P3: Subscribe (JSON) link and small RSS icon; empty-state for no posts; extract shared chip styles; verify `<Image>` sizes for LCP; re‑confirm sitemap excludes paginated URLs and drafts.

Architecture

Pros:
Block-based page architecture; clean separation of server data fetching and client-only pagination.
Centralized metadata helper; consistent ISR/noindex/canonical logic.
Category routes use published-only static params fetcher (avoids draft issues).
Cons:
No explicit guard when page exceeds totalPages.
Sort query param can create duplicate-indexable URLs if not normalized in canonical.
Improvements:
Pagination guard: if page > totalPages → notFound().
Canonical policy: for non-default sort (A–Z/Z–A), either set noindex or canonicalize to base (newest).
Content Modeling (Studio)

Pros:
post has title/slug/excerpt/author/categories/body + shared meta.
category has description, order rank, and SEO with image.
Cons:
excerpt not validated for length; slug uniqueness not enforced by validation.
No publishedAt/updatedAt fields to control ordering/scheduling (currently relies on system timestamps).
Portable Text images lack alt extraction in feed serializer (schema likely supports it).
Improvements:
Add excerpt rule: Rule.max(160).warning() and prompt authors for 120–160 chars.
Add publishedAt: datetime (used for ordering) and optional featured: boolean (as radio list).
Add noindex to category SEO for flexibility (rare but helpful).
Extend block image schema to include alt and project it for feeds.
Data Fetching & Queries

Pros:
Listing queries avoid pulling body (good for performance).
Feed-specific queries pull body[] only where needed.
Cons:
Post count queries likely include posts without slugs or preview drafts depending on perspective defaults.
Improvements:
Use consistent perspective for counts to match listings: defined(slug) and perspective: 'published'.
Consider projecting author slug and image on list cards for richer cards and author links.
Routing & Pages

Pros:
/blog and /blog/category/[slug] support sorting and preserve state in pagination.
Category badges link to category pages; active state is clear.
Cons:
Missing 404 for invalid page numbers; missing “no results” empty state messaging.
Improvements:
Add a friendly empty-state component for categories with no posts.
Add aria-current for active sort chip (or button + aria-pressed) for better SR context.
SEO & Metadata

Pros:
Centralized generatePageMetadata; canonical + noindex for pagination > 1.
OG image fallback generator; categories use seo.image.
Sitemap includes categories; JSON+RSS alternates added.
Cons:
Sort variants can be indexed; canonical may not normalize them.
Single post pages (not reviewed here) likely missing structured data (Article/Breadcrumb).
Improvements:
Set noindex when sort !== 'newest' or canonicalize to base without the sort param.
Add JSON-LD Article on post pages and BreadcrumbList for post/category routes.
Confirm sitemap entries include posts and categories (but not paginated pages) and omit drafts.
Feeds (RSS + JSON)

Pros:
RSS and JSON feeds for global and categories; Atom self-links; lastBuildDate.
Full Portable Text → HTML in feeds; language dynamic from settings.
Items include <category> tags; images included in HTML.
Cons:
No <author>/authors block; no enclosures for lead images; no WebSub/push hub.
HTML serializer doesn’t yet handle lists/code/quotes/embeds (basic marks/images covered).
Improvements:
Add RSS <author> (e.g., “name@example.com (Name)” if available) and JSON Feed authors.
Include enclosure for hero image for richer clients (with type and length if feasible).
Expand Portable Text serialization (lists, code blocks, blockquote, external embeds).
Consider adding a WebSub hub (e.g., Superfeedr) in feeds for push updates.
Accessibility

Pros:
Focus-visible states on chips and subscribe links; links instead of buttons for navigation.
Cons:
Sort control semantics could be clearer for SR users; Subscribe link has generic label.
Improvements:
Use aria-current="true" on active sort links, and aria-label like “Sort by newest (selected)”.
Mark RSS links with title="Subscribe via RSS" and consider adding an RSS icon with aria-hidden.
Performance

Pros:
Server-side data fetching; no overfetch of body for lists.
Feeds cache with s-maxage and stale-while-revalidate.
Cons:
Potential for count queries to mismatch listing scope; feeds missing perspective: 'published'/stega: false guarantees.
Improvements:
Set explicit perspective: 'published' and stega: false on feed queries and count queries.
Confirm image sizes on list cards use Next <Image> with defined sizes for better LCP.
DX & Consistency

Pros:
Queries well-organized; typegen in place; shared helpers for metadata/fetch.
Cons:
Minor style duplication in chip classes across pages.
Improvements:
Extract chip styles to a shared variant or component for consistency.
Prioritized Action Plan

P0 (SEO/UX correctness)
Add notFound() when page > totalPages on /blog and category routes.
Normalize sort URLs: add noindex for sort !== 'newest' or canonicalize to base.
Set counts to published + defined slugs; use consistent perspective in count and feed queries.
P1 (Content & Feeds)
Add publishedAt, featured, excerpt validation; optional category noindex.
Extend PT → HTML serializer for lists/code/quotes; add authors to feeds; add image enclosures.
Include image alt from block images in feeds.
P2 (SEO & A11y depth)
Add Article and Breadcrumb JSON-LD on post/category pages.
Improve sort chip semantics with aria-current and more descriptive labels.
P3 (Discoverability & UX)
Add “Subscribe (JSON)” optional link and a footer RSS link; small RSS icon in header/footer.
Empty-state component for no posts in category.
If you want, I can implement P0 now (pagination guard, sort canonical/noindex, and count/feed perspective) in a single PR-sized patch.
