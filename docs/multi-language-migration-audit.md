# Multi-Language Migration Audit Plan (largseeds.nl)

**Objective:** Prepare the architecture for a robust, SEO-friendly, maintainable multi-language implementation supporting Dutch (`nl`, default) and English (`en`).

---
## Phase 1: Content & CMS Architecture Audit (Sanity)
Ensures content is structured for efficient translation and long-term scalability.

### 1.1 Translation Strategy
- **Decision:** Adopt a document-level translation approach. Each translated version (e.g., English) is its own document in Sanity.
- **Linking:** Use a translation metadata plugin (e.g., `sanity-plugin-internationalization`) or custom reference fields to connect language variants.
- **Rationale:** Independent documents allow language-specific publishing, SEO fields, and differential scheduling.

### 1.2 Schema Review
- **Action:** Add a required `language` (string) field to all translatable document types (e.g., `page`, `post`, `product`, `category`). Enforce `options.list: [{title:"Dutch", value:"nl"}, {title:"English", value:"en"}]` with radio layout.
- **Shared vs Translated Fields:**
  - Translated: `title`, `slug`, `excerpt`, `body`, `seo` fields
  - Shared: `sku`, `price`, `baseImage`, `reference` relations to global taxonomies
- **Validation:** Ensure uniqueness of slug per language (e.g., custom rule combining `language + slug.current`).

### 1.3 Global Content Strategy
- **Action:** Create a singleton `siteSettings` document.
- **Fields:** Navigation labels, footer text, cookie banner strings, default meta fields, optional structured data blocks.
- **Approach:** Either make fields language-aware (array of localized values) or store one document per language (`siteSettings_nl`, `siteSettings_en`). Prefer separate documents for clearer publishing control.

### 1.4 Slug Management
- **Action:** Ensure slug generation respects language. Dutch lives at root (`/over-ons`), English under `/en/about-us`.
- **Constraint:** Prevent cross-language slug conflicts only within the same language namespace.
- **Migration Note:** For existing Dutch slugs, no prefix changes required.

---
## Phase 2: URL, Routing & SEO Audit (Next.js)
Defines URL shape and search visibility strategy.

### 2.1 URL Structure
- **Default Locale (nl):** Served from root (`/nieuws`, `/contact`).
- **Secondary Locale (en):** Served from `/en/*` namespace (`/en/news`).
- **Future-Proofing:** Reserve structure for possible third locale expansion without breaking existing URLs.

### 2.2 Next.js Configuration
- **Update:** In `next.config.js` set:
  ```js
  i18n: {
    locales: ['nl', 'en'],
    defaultLocale: 'nl',
    localeDetection: true,
  }
  ```
- **App Router:** Adopt `[lang]` segment structure for dynamic pages where locale-specific content is queried.

### 2.3 Link Resolution Logic
- **Action:** Refactor `resolveHref` to accept `(docType, slug, lang)`.
- **Rule:** If `lang === 'nl'` → no prefix. Else prefix `/en`.
- **Example:** `resolveHref('post','winter-tips','nl') => /blog/winter-tips`; `resolveHref('post','winter-tips','en') => /en/blog/winter-tips`.
- **Internal Links:** Store only document references; resolve per-request with active locale.

### 2.4 SEO Metadata Strategy
- **Dynamic `<html lang>`:** Inject via root layout using current locale param.
- **`hreflang` Tags:** For each page with both languages, output:
  ```html
  <link rel="alternate" hreflang="nl" href="https://largseeds.nl/pad" />
  <link rel="alternate" hreflang="en" href="https://largseeds.nl/en/path" />
  <link rel="alternate" hreflang="x-default" href="https://largseeds.nl/pad" />
  ```
- **Canonical URL:** Use locale-specific absolute path.
- **Meta Source:** Metadata pulled from the correct language document; fallback strategy if translation missing (e.g., Dutch fallback when EN absent) must be explicitly defined.
- **Sitemaps:** Generate per-locale sitemap or a combined one listing both alternates.

---
## Phase 3: Frontend & UI Component Audit
Ensures UI supports localization gracefully.

### 3.1 Hardcoded Text Extraction
- **Action:** Scan components for static strings (CTAs, headings, button labels, form errors, 404 page text, accessibility labels).
- **Tooling:** Introduce `next-intl` or similar; store translations in `locales/nl.json` and `locales/en.json`.
- **Convention:** Namespace keys (`nav.home`, `cta.readMore`, `form.submit`).

### 3.2 Component Flexibility
- **Action:** Manually test with artificially long Dutch labels and English edge cases (short forms) to verify wrapping, truncation, and responsiveness.
- **Focus Areas:** Navigation menu width, buttons with icons, card titles, table headers.

### 3.3 Localization of Formats
- **Action:** Replace custom date formatting with `Intl.DateTimeFormat(lang, options)`.
- **Numbers/Prices:** Use `Intl.NumberFormat` with proper locale; consider currency variants if introduced later.
- **Accessibility:** Ensure language switch does not break aria-label semantics.

### 3.4 Language Switcher
- **Requirements:**
  - Shows available locales with current highlighted.
  - Links to exact translated path (if exists) else fallback root of target language.
  - Accessible (aria-current, focus ring, keyboard nav, discernible text or lang code).
- **Lookup:** Use translation linkage from Sanity to resolve the alternate document slug.

---
## Phase 4: Pre-Flight Checklist
Must answer **Yes** before implementation begins.

### Content
- [ ] `language` field added & validated on all translatable docs.
- [ ] Strategy chosen for `siteSettings` (per-locale docs or localized fields) and implemented.
- [ ] Translation linkage established (plugin or custom reference array).

### Routing & SEO
- [ ] `next.config.js` updated with `i18n` block.
- [ ] `resolveHref` extended to accept language + tests updated.
- [ ] `hreflang` generation plan implemented (layout or metadata helper).
- [ ] Sitemap(s) updated to include alternates.

### Frontend
- [ ] All hardcoded strings extracted into locale files.
- [ ] Key components verified for layout resilience.
- [ ] Dates/numbers use `Intl` APIs.
- [ ] Language switcher designed & wired to translation map.

### Risk & Fallbacks
- [ ] Defined policy for missing translation (fallback to Dutch vs hide link).
- [ ] Monitoring plan (e.g., log untranslated keys in development).

---
## Implementation Sequencing Recommendation
1. Schema changes + siteSettings strategy.
2. Data backfill: assign `language` to existing docs (default: `nl`).
3. Introduce translation linkage (create EN test documents).
4. Add `i18n` config + `[lang]` routing segment.
5. Refactor `resolveHref` + update queries to filter by `language`.
6. Implement metadata + `hreflang` + sitemap alternates.
7. Extract hardcoded strings and integrate translation framework.
8. Build language switcher.
9. QA pass (content parity, SEO tags, link integrity, CLS/layout checks with longer strings).
10. Launch behind feature flag or staging domain; monitor.

---
## Success Metrics
- 0 broken internal links post-launch.
- 100% coverage of required `language` field across translatable docs.
- < 5% pages temporarily missing translation (tracked via dashboard).
- All pages emit correct `hreflang` pairs within first crawl cycle.

---
## Open Questions (Define Before Build)
- Do we need draft fallback display (show Dutch when EN missing) or strict locale-only?
- Will products require localized structured data (schema.org) in both languages initially?
- Is search planned; if so, will we segment by locale or merge results with locale weighting?

---
**Status:** Draft (ready for review)

