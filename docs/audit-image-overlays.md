# Image overlay and treatment audit

Scope: Hero 174, Feature 202, product listing (all + category), and product detail. Goal: capture current overlay/opacity/filters and flag inconsistencies, then suggest a small normalization path.

## Findings by surface

### Hero 174 (`frontend/components/blocks/hero/hero174.tsx`)

- Base overlay: section pseudo-element overlay
  - Class: `after:bg-zinc-950/50` → 50% black (zinc-950) solid overlay
  - Positioning: `after:absolute after:inset-0 after:block after:size-full`
  - Stacking: background image is in an absolutely positioned wrapper with no z-index; overlay sits above it; content wrapper uses `relative z-10` to sit above the overlay
- Background image: `<Image ... className="h-full w-full object-cover" />` (no filters)
- Foreground content
  - Title/body: white text; body uses default white (not semi-transparent), with rich text in PT
  - CTA buttons: `border-2 border-primary bg-primary/20` (20% brand fill), hover `hover:bg-white/10`
  - Bottom info bar: `bg-black/20` (20% black) + `backdrop-blur-sm`
  - Tag description line: `text-white/50` (50% white)

Summary: Dark solid overlay (50%) ensuring strong contrast; additional translucent treatments stacked on top (20% black bar, 20% primary on button, hover 10% white).

### Feature 202 (`frontend/components/blocks/feature/feature202/index.tsx`, `feature202-card.tsx`)

- Card container overlay: gradient layer element above the image
  - Class: `absolute inset-0 -z-10 bg-gradient-to-t from-primary to-transparent`
  - Stacking: image uses `-z-20`, gradient sits above it; container uses `relative isolate`
- Background image filter:
  - Class: `grayscale-100` by default → grayscale(100%)
  - Hover: `group-hover:grayscale-50` → grayscale(50%) on hover
- Foreground elements:
  - Icon pill: `bg-background/15` (15%), `border border-background/20` (20%), `backdrop-blur-sm`
  - Text: `text-background` (title), `text-background/70` (description)

Summary: Brand-colored gradient overlay (no alpha except inherent color), grayscale image treatment (100% → 50% on hover), translucent background/blur around icon. No global darkening overlay; legibility relies on gradient and text color selection.

### Products — listing blocks

- All products (table) (`frontend/components/blocks/products/all-products-16/index.tsx` → `components/products/products-table.tsx`)
  - Thumbnails: `<Image ... className="h-16 w-24 rounded object-cover ring-1 ring-border" />`
  - No overlay, no filter; 1px ring for separation

- Category page (`frontend/app/[lang]/(main)/products/category/[slug]/page.tsx`)
  - Same table/thumbnail component: no overlay or filter; ring-1 border only

### Product — detail page (`frontend/app/[lang]/(main)/products/[slug]/page.tsx`)

- Main image element
  - Class: `aspect-video w-full rounded-lg object-cover`
  - No overlay, no blur, no grayscale

## Inconsistencies

- Overlay strategy varies by surface:
  - Hero 174 uses a strong 50% black solid overlay
  - Feature 202 uses a brand gradient with no added darkening and applies grayscale to the background image
  - Product listing/detail use no overlays or filters
- Mixed translucency/blur patterns:
  - Hero 174 mixes `bg-black/20` and `bg-primary/20` elements with backdrop blur
  - Feature 202 uses `bg-background/15` + `border-background/20` + blur on icon only
- Visual tone and contrast for text over imagery are not standardized (gradient vs solid overlays; grayscale vs none).

## Recommendations (low effort)

1) Define 3 overlay presets as CSS utilities, backed by theme tokens
   - `overlay-dark-30` → solid black at 30%
   - `overlay-dark-50` → solid black at 50%
   - `overlay-brand-gradient` → `bg-gradient-to-t from-[--color-primary] to-transparent`
   Usage pattern: a shared class that applies a pseudo-element overlay on a relatively positioned container.

2) Introduce a small “image treatment” option per block (schema)
   - Enum: `none` | `dark-30` | `dark-50` | `brand-gradient` | `grayscale`
   - For Feature 202, default to `brand-gradient` (+ optional `grayscale`)
   - For Hero 174, default to `dark-50`
   - For product listing/detail, default to `none` (keep clean imagery)

3) Normalize blur usage
   - Use `backdrop-blur-sm` only on chips/pills or callouts; avoid overlay-level blur for readability/performance unless necessary

4) Guardrails for text contrast
   - Ensure heading/body over imagery maintain WCAG contrast against overlay; avoid pure gradient without sufficient darkening if text is light

## Quick mapping (current → target)

- Hero 174: `after:bg-zinc-950/50` → keep as `overlay-dark-50`
- Feature 202: gradient + grayscale → `overlay-brand-gradient` (consider adding a subtle dark-20 mix if titles lose contrast on some images); keep grayscale hover as a stylistic choice
- Products (list/detail): keep “no overlay”, retain `ring-border` only

## Optional follow-up (implementation light)

- Add utilities in `globals.css` for the overlays above (pure CSS classes)
- Create a reusable `<ImageOverlay>` wrapper for complex cases (encapsulate pseudo-element markup and z-index)
- Add a shared TypeScript prop and Sanity field fragment to choose the treatment per block; default values per block type
