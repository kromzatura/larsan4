# Tailwind v4, theming, and Sanity control — audit and proposal

This note captures how styling is currently wired (Tailwind v4 + CSS tokens + next-themes) and what is editor‑controllable via Sanity today. It ends with a concrete Theme schema proposal we can adopt for the redesign.

## What we have today

- Tailwind CSS v4.1 is enabled with `@import "tailwindcss"` and `@plugin "tailwindcss-animate"` in `frontend/app/globals.css`.
- Tokens live as CSS custom properties on `:root` and `.dark`, then are mapped into Tailwind tokens using `@theme inline`.
  - Colors: background/foreground, card/popover, primary/secondary, muted/accent, destructive, border/input/ring, chart-1..5, sidebar*.
  - Radii and shadows, plus font stacks via `--font-sans|serif|mono`.
  - A shared `@utility container` and focus utilities exist.
- Dark mode is toggled with a `.dark` class on `<html>`; `next-themes` provides the switch and persistence.
- Fonts: Inter via `next/font` in `layout.tsx` for sans; serif and mono stacks are provided via CSS variables (system stacks).

Sanity-driven styling controls (editor knobs):

- Section spacing via `section-padding` (top/bottom booleans) and `SectionContainer` applies the padding classes.
- Layout and grid: `layout-variants.ts` exposes section width, stack alignment, direction, and grid column variants; blocks pick from enumerations.
- Icon and color variants enumerations exist; a `getColor` helper maps semantic color names to Tailwind utility classes for specific components.

Not currently editor‑controlled:

- Global theme tokens (colors, radii, shadows, ring, typography scale) defined in `globals.css`.
- Typography scale and heading styles are code‑driven under `@layer base`.

Implication: Editors can shape block layout/spacing and variants, but cannot change foundational theme characteristics (palette, radius, shadow scale, etc.) without code changes.

## Gap to close for the redesign

- No first‑class Theme content model in Sanity. If we want editorially curated palettes or seasonal themes, we need a canonical Theme document and a small runtime bridge to inject its values into CSS variables.
- We should keep build‑time Tailwind tokens stable, and override only CSS variable values at runtime per theme to preserve static extraction and good LCP.

## Proposal: Theme document in Sanity

Create a `theme` document type with grouped fields and sensible defaults matching current tokens. Keep it minimal for v1 and expand later.

Suggested fields (all strings default to valid color formats; keep palette small and semantic):

- Basics
  - name (string, required)
  - language (hidden string for per‑locale instances)
- Palette
  - background, foreground, primary, primaryForeground
  - secondary, secondaryForeground
  - accent, accentForeground
  - muted, mutedForeground
  - destructive, destructiveForeground
  - border, input, ring, ringFocus
- Surfaces
  - card, cardForeground, popover, popoverForeground
  - sidebar, sidebarForeground, sidebarPrimary, sidebarPrimaryForeground, sidebarAccent, sidebarAccentForeground, sidebarBorder, sidebarRing
- Charts (optional small set): chart1 .. chart5
- Shape & shadow
  - radius (number, 0–24 step .25rem)
  - shadowScale (enum: none | subtle | default | strong)
- Typography
  - fontSans (string), fontSerif (string), fontMono (string)

Validation notes

- Require `name` and a minimal palette: background, foreground, primary, primaryForeground, border.
- Use warnings for others; default to current values if unset.

Editorial UX

- Group fields with icons (Palette, Surfaces, Shape & Shadow, Typography).
- Add brief descriptions and WCAG guidance for foreground/background pairs.

## Frontend wiring (incremental, low‑risk)

1) Query: Fetch `theme` for the active locale during layout render. Cache at the edge with ISR.
2) Injection: Map the document to CSS variables by rendering a `<style>` block in the `<html>` or `<body>` with only variable overrides. Example (conceptually):
   
   :root { --background: <from Sanity>; --foreground: <from Sanity>; ... }
   .dark { /* optional dark overrides if we add fields later */ }

3) Safety: Fallback to hardcoded defaults from `globals.css` if a field is missing or the document is absent.
4) Scope: Keep Tailwind token names unchanged; only override underlying CSS variables so no class names change.
5) Types: Generate Sanity types via TypeGen and derive frontend types from them.

## Phased plan

- Phase A (schema + read‑only):
  - Add `studio/schemas/documents/theme.ts` and register it in `studio/schema.ts`.
  - Seed a single theme per language (copy current values).

- Phase B (frontend injection):
  - Add a tiny mapper in `frontend/sanity/lib/theme.ts` that converts the document into a flat Record<string,string>.
  - In `app/[lang]/layout.tsx`, fetch theme and inject a `<style>` tag with just the variables that differ from defaults.

- Phase C (editor polish):
  - Add preview in Studio that renders a small card with background/foreground and buttons to visualize contrast.
  - Add rule.warnings for contrast.

## Out of scope (future)

- Per‑block theme overrides.
- Multi‑theme switching in UI (beyond dark/light).
- Dynamic font loading via next/font per Theme.

## Success criteria

- Editors can adjust palette and radius without code deploys.
- No change to Tailwind build or classes; only CSS variable values differ.
- Light/dark toggle continues to work; we may add dark palette fields later if needed.
