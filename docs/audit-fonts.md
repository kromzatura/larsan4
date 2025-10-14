# Fonts audit

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
