# Multilingual Site Strategy Blueprint

> **Purpose:** Capture the high-level concept for converting the project from single-locale (English) into a professional, scalable multilingual web experience powered by Next.js App Router and Sanity.

## Guiding Principles

- **Locale-first architecture:** Treat language as a first-class route segment and data dimension from the start.
- **Editor empowerment:** Provide translators and editors with clear workflows, validation, and previews per locale in Sanity Studio.
- **SEO & accessibility compliance:** Ensure each locale has correct metadata, sitemap entries, language attributes, and accessible UI patterns.
- **Operational resilience:** Automate quality gates, preview workflows, and monitoring so every locale deploys with confidence.

## Architectural Pillars

### 1. Routing & Rendering

- Adopt `/app/[lang]/…` routing with a `DEFAULT_LOCALE` and explicit `SUPPORTED_LOCALES` list.
- Use `generateStaticParams` for locales that can be statically rendered; fallback to ISR/SSR when content changes frequently.
- Pass `lang` from route parameters into all server components, GROQ queries, and metadata helpers.
- Centralize locale-aware helpers (formatting dates, numbers, slugs) in `frontend/lib/i18n/`.

### 2. Metadata, SEO, and Discovery

- Extend `@/sanity/lib/metadata` to accept locale input and emit localized titles, descriptions, OG tags, and canonical URLs.
- Generate `<link rel="alternate" hreflang="…">` entries and localized `sitemap.xml` routes.
- Update `robots.ts` to reference every supported locale.
- Guard against publishing pages without localized metadata via Studio validation rules.

### 3. Content Modeling in Sanity

- Use the Document Internationalization plugin to maintain per-locale variants of top-level documents (`page`, `settings`, `navigation`).
- Replace single-language strings with locale-aware objects or arrays; ensure slugs are unique per locale.
- Configure block schemas so every translatable field is clearly labeled and localized.
- Provide validation (`rule.required()`, `rule.warning()`) to highlight missing translations before publish.

### 4. Translation Workflow & Tooling

- Decide on sourcing: in-Studio manual translation vs. external CAT tools via export/import.
- Surface translation status fields (e.g., `draft`, `ready`, `published`) and consider Studio dashboards for missing locales.
- Offer preview panes that render each locale through Next.js.
- Track fallback usage with helpers that return `(value, sourceLocale)` to avoid silent mismatches.

### 5. Quality Engineering

- Add unit tests for locale helpers (`resolveHref`, date/number formatting, fallback logic).
- Implement integration tests for navigation and page rendering across locales (Playwright/Cypress).
- Include visual or snapshot tests per locale for critical blocks.
- Ensure `<html lang>` is set and plan for RTL support if relevant (logical CSS, Tailwind variants).

### 6. Deployment & Operations

- Provide Vercel previews per PR with locale toggles for QA.
- automate checks that block deploys when mandatory translations are missing.
- Update analytics and monitoring dashboards to segment by locale; watch for localized 404s.
- Document release playbooks covering translation freeze, QA, and handoff.

### 7. Taxonomy & Category Surfacing

- Localize both blog (`category`) and product (`productCategory`) taxonomies using document internationalization so editors manage slugs, descriptions, and SEO metadata per locale.
- Parameterize category-centric GROQ queries (blog listings, feeds, product tables, sitemap segments) with `$lang`, guaranteeing that every surfaced title, description, and canonical URL matches the active locale.
- Update the category detail pages, RSS/JSON feeds, and `generatePageMetadata` helper to emit locale-aware canonical + alternate links and localized OG content.
- Ensure navigation (`resolveHref`, Sanity-driven menus) and sitemap builders prepend locale prefixes for category routes while respecting per-locale `noindex` flags.

## Immediate Action Items

1. **Create i18n config module** defining default/fallback locales and formatting utilities.
2. **Scaffold `[lang]` route segment** in the App Router and wire `generateStaticParams`.
3. **Refactor metadata helper** to output localized SEO data and alternate links.
4. **Update Sanity schemas** (`settings`, `navigation`, `page`) to use internationalized fields.
5. **Add translation status fields** and Studio helpers to visualize completeness.
6. **Introduce automated tests** for locale-specific helpers and route coverage.
7. **Draft workflow documentation** for editors and translators (to be expanded later).
8. **Localize taxonomy flows** by updating category/productCategory schemas, queries, feeds, and navigation helpers to honor per-locale slugs + metadata.

---

This blueprint captures the initial concept. Future iterations should add detailed implementation guides, examples, and SOPs for translation and QA workflows.
