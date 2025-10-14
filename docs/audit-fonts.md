# Fonts audit

## Our work vs. boilerplate (executive summary)

This project mixes pages/blocks we built with boilerplate blocks authored elsewhere. Here’s how our surfaces differ stylistically, with an emphasis on typography.

- Our pages/blocks (Blog Category, Products index and category, Product detail, Compare Products, Product Categories 16, All Products 16)
  - Font family: Inter everywhere (via `app/layout.tsx`). No serif usage; monospace only appears for actual code blocks.
  - Styling: Data- and content-first. Tables, badges, bordered cards, subtle `text-xs uppercase tracking-wide text-muted-foreground` section labels. Predictable use of `font-medium`/`font-semibold`.
  - Performance: No extra webfonts beyond Inter; stable, consistent payload.

- Boilerplate blocks
  - Introduce decorative “tech” accents with `font-mono` in specific places (see list below). Examples: overlay numerals, uppercase meta in monospace, code-like UI strips.
  - Visual tone: Showcase/marketing flair vs. our utilitarian editorial/product focus.

- Guardrails for consistency
  - Reserve monospace for code/technical readouts only. Avoid using `font-mono` for metadata or labels on product/blog surfaces.
  - Use the standard label pattern: `text-xs uppercase tracking-wide text-muted-foreground` for section headers.
  - Keep H1/H2 sizing consistent (e.g., product H1 `text-3xl md:text-5xl`), preferring `font-medium`/`font-semibold` for emphasis.
  - Prefer shared UI primitives (Badge, Separator, Button) over bespoke styles to maintain cohesion.


This document summarizes the fonts configured and used across the frontend, highlights any exceptions, and quantifies the actual font payload emitted by the current production build.

## Families and sources

- Sans: Inter via next/font (variable bound to `--font-sans`)
  - Defined in `frontend/app/layout.tsx` as Inter (weights 400, 500, 600, 700, 800)
  - Applied globally on `<body>` via Tailwind class `font-sans` plus `fontSans.variable`
- Serif: CSS variable fallback only (not loaded via next/font)
  - `--font-serif: Merriweather, ui-serif, serif;` (defined in `frontend/app/globals.css`)
- Mono: CSS variable fallback only (not loaded via next/font)
  - `--font-mono: JetBrains Mono, monospace;` (defined in `frontend/app/globals.css`)

Notes
- Inter is the only family that is actually downloaded as webfonts by Next.js.
- Serif and Mono rely on local/system fonts unless we explicitly add them via next/font.

## Where fonts are applied

- Global: `<body class="min-h-screen bg-background font-sans antialiased ...">` from `frontend/app/layout.tsx`
- UI components: inherit from body; many components adjust `font-weight` and `text-sm`/`text-base` etc. but do not change the family.
- Toasts (Sonner): Inherit the app font family; custom classNames are provided in `frontend/components/ui/sonner.tsx` but no separate font is set.
- Open Graph images: No explicit OG image route exists in the codebase at this time, so there is no separate font embedding path to consider.

## Emitted font assets (current build)

From `frontend/.next/static/media` in the most recent production build, these `.woff2` files were emitted by next/font for Inter:

- 19cfc7226ec3afaa-s.woff2 — 19,044 bytes
- 21350d82a1f187e9-s.woff2 — 18,744 bytes
- 8e9860b6e62d6359-s.woff2 — 85,272 bytes
- ba9851c3c22cd980-s.woff2 — 25,844 bytes
- c5fe6dc8356a8c31-s.woff2 — 11,272 bytes
- df0a9ae256c0569c-s.woff2 — 10,280 bytes
- e4af272ccee01ff0-s.p.woff2 — 48,432 bytes

These correspond to the requested Inter subsets/weights and internal splits used by Next.js to optimize loading.

## Opportunities and recommendations

- If some Inter weights are unused, remove them from the `Inter({ weight: [...] })` config to reduce payload.
- If you want guaranteed consistency for serif/mono text (e.g., code blocks), consider loading them via next/font:
  - Example: `Merriweather` (serif) and `JetBrains Mono` (mono) with limited weights and the same latin subset.
- If/when an OG image route is added, embed Inter there as well for visual parity and to avoid layout shifts in generated images.
- Keep `font-display` defaults from next/font (swap-like behavior) for good perceived performance.

## Quick references

- Inter configuration: `frontend/app/layout.tsx`
- CSS variables: `frontend/app/globals.css`
- Sonner toaster styling: `frontend/components/ui/sonner.tsx`

## Page/block-specific notes (requested surfaces)

All of the following surfaces inherit the global `font-sans` (Inter) from `app/layout.tsx`. None introduce an alternate family; they only vary weights/sizes via Tailwind utility classes. No additional webfont files are downloaded beyond Inter’s configured weights.

- Home page (`frontend/app/[lang]/(main)/page.tsx`)
  - Family: Inter (inherited)
  - Renders dynamic blocks via `components/blocks`; by default these use Inter.
  - Conditional monospace accents: if the page includes blocks like `faq5`, `faq14`, `changelog2`, `timeline5`, `gallery8`, or if `portable-text-renderer` renders a code block, those specific bits use `font-mono` for small UI accents. Otherwise, Inter only.

- Blog category page (`frontend/app/[lang]/(main)/blog/category/[slug]/page.tsx`)
  - Family: Inter (inherited)
  - Typography: `h1` uses `font-semibold` (≈ 600); body copy defaults to regular; filter chips use standard UI styles.
  - No `font-mono` or serif usage.

- Product category page (`frontend/app/[lang]/(main)/products/category/[slug]/page.tsx`)
  - Family: Inter (inherited)
  - Uses `ProductsTable` for listing; table header uses `text-xs uppercase tracking-wide text-muted-foreground` with normal/smedium weights (`font-medium` for some cells), body rows use regular plus `font-semibold` for labels.
  - No `font-mono` or serif usage.

- Product page (`frontend/app/[lang]/(main)/products/[slug]/page.tsx`)
  - Family: Inter (inherited)
  - Body content uses a `prose dark:prose-invert` wrapper for Portable Text, which does not override `font-family` (stays sans). Headings often use `font-semibold`.
  - Conditional monospace accents: if a Portable Text `code` block appears, the code header strip within `portable-text-renderer.tsx` uses `font-mono` for the filename line; otherwise, it’s Inter only. Badges and spec tables use standard UI styles.

- Inquiry page (`frontend/app/[lang]/(main)/inquiry/page.tsx` and `pageClient.tsx`)
  - Family: Inter (inherited)
  - Titles `font-semibold`; buttons/links use shared UI components; no `font-mono`.

- Compare products block (`frontend/components/blocks/compare/compare-products.tsx`)
  - Family: Inter (inherited)
  - Table header uses `text-xs uppercase tracking-wide` and `font-medium`; row labels `font-semibold`.
  - No `font-mono` usage.

- All products 16 block (`frontend/components/blocks/products/all-products-16/index.tsx` → `ProductsTable`)
  - Family: Inter (inherited)
  - Same table typography as the product category page (see above). No `font-mono`.

- Product categories 16 block (`frontend/components/blocks/products/product-categories-16/index.tsx`)
  - Family: Inter (inherited)
  - Filter header uses small uppercase tracking-wide text; category chips are badges in the default UI font.
  - No `font-mono`.

Notes on monospace usage elsewhere
- The monospace family (`font-mono` → `--font-mono: JetBrains Mono, monospace`) is used sparingly in other blocks (e.g., some gallery/changelog/faq/timeline components and code-like UI in `portable-text-renderer.tsx`). None of the audited pages/blocks above apply `font-mono`.

## Blocks using monospace (for editors)

These components introduce small `font-mono` accents. Core headings and body copy remain Inter.

- `frontend/components/portable-text-renderer.tsx`
  - Code blocks: the top bar (filename/copy) uses monospace.
- `frontend/components/blocks/faq/faq5.tsx`
  - The small square/label marker in the list uses monospace.
- `frontend/components/blocks/faq/faq14.tsx`
  - Section subheading line uses uppercase tracking with monospace.
- `frontend/components/blocks/changelog/changelog2.tsx`
  - Line-level meta text beneath titles uses monospace.
- `frontend/components/blocks/timelines/timeline5.tsx`
  - Large overlay numbers use monospace for a technical aesthetic.
- `frontend/components/blocks/gallery/gallery8.tsx`
  - Small uppercase meta labels use monospace.

