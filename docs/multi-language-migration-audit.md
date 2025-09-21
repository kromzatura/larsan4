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
  - Translated: `title`, `slug`, `excerpt`, `body`, `seo` fields, `image alt text`, and potentially `pricing` if future currency / market variants are anticipated.
  - Shared (initially): `sku`, `baseImage` reference, stable taxonomy references (unless taxonomy itself becomes localized later).
- **Price Strategy (Deliberate Decision Point):** Even if only EUR is used now, model `pricing` as an object to future-proof (e.g., `{ amount: number, currency: 'EUR', display?: string }`) OR create a localized price wrapper `{ nl: { amount, currency }, en: { amount, currency } }`. Choose one of:
  1. Minimal (shared numeric): lowest setup, later migration cost higher.
  2. Structured shared object: moderate prep, still single price.
  3. Localized object: highest initial effort, zero migration cost if multi-currency emerges.
  Recommendation: Option 2 (structured shared object) unless differentiated pricing is already on roadmap (< 6 months), then Option 3.
- **Validation:** Ensure uniqueness of slug per language (e.g., custom rule combining `language + slug.current`).

### 1.3 Global Content Strategy
- **Action:** Create a singleton `siteSettings` document (per locale or a dual-locale structure).
- **Fields:** Navigation labels, footer text, cookie banner strings, default meta fields, optional structured data blocks.
- **Approach:** Either make fields language-aware (array or keyed object) or store one document per language (`siteSettings_nl`, `siteSettings_en`). Prefer separate documents for clearer publishing control.
- **Image Alt Text Translation:** All image-bearing blocks or objects must expose a translated `alt` field. Pattern: `alt` becomes `{ nl: string; en: string }` or separate localized sibling docs. Fallback rule: Do not silently use the other language's alt text—if missing, output empty `alt=""` for decorative treatment unless the image conveys critical meaning (then flag in QA).

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
- **Invariant (Must Adopt):** Every GROQ query fetching localized documents MUST include `language == $lang` (or equivalent param filter). Add a lintable util (string search) or code review checklist item to prevent leakage.

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
  - Persists user choice: write explicit selection to `NEXT_LOCALE` cookie so future visits honor preference over `Accept-Language`.
- **Lookup:** Use translation linkage from Sanity to resolve the alternate document slug.
- **Behavioral Edge Case:** If user selects a language lacking a translation for current page, redirect to that locale's home (302) and optionally surface a subtle notice.

---
## Phase 4: Pre-Flight Checklist
Must answer **Yes** before implementation begins.

### Content
- [ ] `language` field added & validated on all translatable docs.
- [ ] Strategy chosen for `siteSettings` (per-locale docs or localized fields) and implemented.
- [ ] Translation linkage established (plugin or custom reference array).
- [ ] Image alt text fields localized across all image usages.
- [ ] Pricing localization strategy (Option 1/2/3) explicitly chosen & documented.

### Routing & SEO
- [ ] `next.config.js` updated with `i18n` block.
- [ ] `resolveHref` extended to accept language + tests updated.
- [ ] All GROQ queries audited to enforce `language == $lang` (no leaks).
- [ ] `hreflang` generation plan implemented (layout or metadata helper).
- [ ] Sitemap(s) updated to include alternates.

### Frontend
- [ ] All hardcoded strings extracted into locale files.
- [ ] Key components verified for layout resilience.
- [ ] Dates/numbers & potential future prices use `Intl` APIs.
- [ ] Language switcher designed, wired to translation map, and persists cookie.
- [ ] Fallback messaging UX defined for missing translations.

### Risk & Fallbacks
- [ ] Defined policy for missing translation (fallback to Dutch vs hide link).
- [ ] Monitoring plan (e.g., log untranslated keys in development).

---
## Implementation Sequencing Recommendation
1. Schema changes + siteSettings strategy (include alt + price model decision).
2. Data backfill: assign `language` to existing docs (default: `nl`).
3. Localize image alt text + introduce pricing object (if Option 2/3).
4. Introduce translation linkage (create EN test documents).
5. Add `i18n` config + `[lang]` routing segment.
6. Refactor `resolveHref(lang)` + update EVERY query to filter by `$lang` + add tests.
7. Implement metadata + `hreflang` + sitemap alternates.
8. Extract hardcoded strings and integrate translation framework.
9. Build language switcher (with persistence cookie) + 404 / fallback handling.
10. QA pass (parity, alt coverage, hreflang validation, layout resilience, cookie persistence).
11. Launch behind feature flag or staging domain; monitor.

---
## Success Metrics
- 0 broken internal links post-launch.
- 100% coverage of required `language` field across translatable docs.
- < 5% pages temporarily missing translation (tracked via dashboard).
- 100% localized image alt coverage on pages containing media.
- 0 queries returning cross-locale documents (enforced by audit script / tests).
- All pages emit correct `hreflang` pairs within first crawl cycle.

---
## Adopted Decisions (Previously Open)
**Content Fallback Policy:** Strict locale-only. No cross-language content rendering; untranslated pages simply do not expose a language switch link.

**Structured Data:** Localized schema.org required from day one; each locale's page emits matching language structured data (Product, Article, BreadcrumbList, etc.).

**Search Strategy:** Segmented by active locale. `/en` searches return only English documents; `/` (nl) returns only Dutch. Future enhancement: optional cross-locale toggle.

**Pricing Strategy Fallback:** No fallback allowed across locales. Price must exist for a product to be publishable in that locale. Missing price ⇒ product hidden or marked "Price unavailable" (non-purchasable state).

**Alt Text Validation:** Phase 1 (first 3–6 months): `warn` validation + dashboard tracking. Phase 2 (after stabilization): escalate to `error` (publish-blocking) for required semantic images.

**Missing Translation Redirect UX:** If user requests non-existent translation, redirect to that locale root with a dismissible notice: "That page is not yet available in English." Provide telemetry event for tracking frequency.

**Additional Operational Notes:**
- Introduce an editor dashboard surfacing: (1) pages missing counterpart translation, (2) images missing alt in any locale, (3) products missing localized price.
- Add automated preflight script in CI to fail if new queries omit `language == $lang`.

**Status:** Draft (ready for review)

