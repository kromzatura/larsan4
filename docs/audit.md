Summarizing assessment to user. Roadmap Progress Assessment (Based on products-roadmap.md and current code)

Phase Status

Phase 1 (Schemas): PARTIAL

productCategory schema: Implemented and aligned with plan (title, description, slug, meta, orderRankField).
product schema: Implemented BUT currently embeds all specification fields directly (sku, moisture, fatContent, etc.). Roadmap revision calls for a separate specification document and a single reference on product. That decoupling not yet done.
specification schema: Not present (missing file; not registered).
Result: Must refactor product spec fields out into new specification document to meet roadmap goal.
Phase 2 (GROQ + Typegen): PARTIAL

Product queries exist (PRODUCT_QUERY, PRODUCTS_QUERY, category queries).
No dereferenced specifications->{...} projection because there is no specification reference yet.
Typegen works for current embedded model, but will need regeneration after schema refactor.
Pagination & count queries present (PRODUCTS_COUNT_QUERY etc.).
To finish: Add specification doc, change product field to reference specification, update queries to expand it, re-run typegen.
Phase 3 (Routes): DONE (for initial embedded model)

/products/[slug] implemented with static params + metadata helper.
/products/category/[slug] implemented with pagination, sorting, metadata.
These pages rely on embedded spec fields; will need minor adjustments after refactor (rename product.sku etc. if moved under product.specifications.sku).
Phase 4 (Inquiry System Foundation): DONE (and enhanced)

Inquiry helpers, context, badge, add-to-inquiry button, full flow to contact form with email inclusion.
Slight divergence from original spec data shape (using SKU + name rather than \_id, slug, imageUrl), but functional for current needs.
Phase 5 (Reusable “All Products” Block): NOT STARTED

No all-products-16 schema or component.
No integration in PAGE_QUERY.
Phase 6 (/products Page via Block): NOT STARTED

No page.tsx route file using a block-driven page; currently listing appears only via categories and individual pages.
Phase 7 (Navigation + Linking): PARTIAL

Product detail links to categories; category cards link to products.
Need confirm header/footer link to /products (route not yet implemented).
Category chips implemented.
Add global nav link once /products page exists.
Phase 8 (SEO & Metadata): PARTIAL

Metadata helper is used for product + category pages.
Need to ensure future specification doesn’t require metadata (it won’t have route).
Sitemap likely missing product & category inclusion if not already coded (need to verify app/sitemap.ts updates).
OG fallback seems consistent; verify meta.image usage once spec refactor done.
Phase 9 (QA & Validation): NOT STARTED (post-refactor activity)

Build passes now; further validation pending spec decoupling & new block.
Phase 10 (Rollout): NOT STARTED (feature branch workflow not reflected—work done directly on main).

Key Gaps vs Roadmap

Missing externalized specification document and reference model (largest structural deviation).
Absence of “All Products” block and /products CMS-driven page.
Navigation lacks finalized /products landing route.
Inquiry item shape differs from originally planned richer structure (acceptable if minimal is intentional).
Sitemap and potential structured data for products not yet addressed.
Roadmap branch strategy not followed (work on main instead of feat/products-categories).
Recommended Next Actions (Sequenced)

Schema Refactor (Phase 1 completion)

Create specification document schema with fields currently embedded.
Remove those fields from product schema; add specifications (reference, required).
Migration plan: For existing products, manually create spec docs & link (since we’re early, manual is fine).
Query & Types Update (Phase 2 completion)

Update PRODUCT_QUERY to project specifications->{ field list }.
Update listing queries if any spec fields needed on cards (or keep lean).
Re-run typegen and adapt product detail page: reference fields under product.specifications.
Adjust Frontend (Phase 3 alignment)

Modify product page to use product.specifications.sku etc.
Update inquiry add button to use specifications.sku.
Keep fallback if specifications missing to avoid runtime errors during transition.
Introduce All Products Block (Phase 5)

Schema + GROQ fragment + component with pagination via searchParams.page.
Inject into PAGE_QUERY.
/products Page Route (Phase 6)

Ensure CMS page with slug products; add block in Studio; confirm metadata.
Navigation (Phase 7)

Add /products link to navbar + footer.
SEO Enhancements (Phase 8)

Add JSON-LD (optional phase add-on) for product detail pages using new spec fields.
Confirm sitemap includes product & category slugs.
QA (Phase 9)

Edge-case pagination tests (page > total pages).
Validate missing spec doc gracefully handled (temporary).
Risk & Effort Notes

Refactoring spec fields now is cheaper than later; strongly advisable before adding more products.
All Products block leverages existing pagination patterns (low incremental complexity).
Email/inquiry unaffected by spec refactor (only change path to SKU).
Effort Estimates (Rough)

Spec refactor (schema + query + frontend adjust + manual linking): 0.5–1 day.
All Products block + page + nav: 0.5 day.
Sitemap + SEO touch-ups: 0.25 day.
QA + cleanup: 0.25 day.
Decision Points Needed From You

Confirm we proceed with specification extraction now vs postponing.
Confirm minimal inquiry data shape is acceptable (SKU + name) or expand with image/slug later.
Confirm pagination size (keep 12) for All Products block.
Confirm interest in product structured data (JSON-LD) now or defer.
Let me know:

Proceed with spec refactor now? (yes/no)
Keep inquiry item minimal? (yes/no)
Lock page size = 12? (yes/no)
Add product JSON-LD? (yes/no)
Reply with answers (e.g. “yes, yes, yes, no”) and I’ll create the execution plan + start edits.
