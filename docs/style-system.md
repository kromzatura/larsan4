# Style System

This document summarizes the design token architecture and usage guidelines implemented in Issue 002.

## Token Sources
- Canonical token definitions live in `app/globals.css` under the `:root` and `.dark` blocks.
- Reference palette (historical snapshot) retained in `docs/new-look.md`.

## Categories
| Category | Prefix | Example | Notes |
|----------|--------|---------|-------|
| Surface  | `--background`, `--card`, `--popover` | `bg-background` | Paired with matching `*-foreground` tokens |
| Layered Surfaces | `--surface-root|1|2|3` | custom class usage | Progressive elevation bases (do not use directly in utilities; wrap in components) |
| Interactive | `--primary`, `--secondary`, `--accent`, `--destructive` | `bg-primary text-primary-foreground` | Semantic intent; never use for layout backgrounds |
| Neutral | `--muted`, `--muted-foreground`, `--border`, `--input`, `--ring` | `border-border` | Low emphasis & UI chrome |
| Chart | `--chart-1`..`--chart-5` | custom data viz | Reserved for future graph components |
| Sidebar | `--sidebar-*` | `bg-sidebar text-sidebar-foreground` | Used for persistent nav regions |
| Typography | `--font-sans`, `--font-serif`, `--font-mono` | `font-sans` | Fonts configured via @theme mapping |
| Radius | `--radius`, derived `--radius-sm|md|lg|xl` | `rounded-[var(--radius-md)]` | Prefer semantic sizes over arbitrary pixel radii |
| Shadows | `--shadow-*` | `shadow-[var(--shadow-md)]` | Consistent elevation scaling |

## Tailwind / @theme Mapping
The `@theme inline` block maps raw tokens to semantic `--color-*` variants consumed by Tailwind's design system utilities (e.g., `bg-background`, `text-foreground`). Keep additions minimal; prefer extending tokens then mapping.

## Dark Mode Strategy
- Controlled explicitly via `.dark` class on `<html>`.
- Optional auto fallback (not enabled) can be implemented with a `prefers-color-scheme: dark` media query if needed; explicit control chosen for predictability and user preference persistence.

## Usage Guidelines
1. Never hard-code hex/oklch values in components—always reference semantic utilities.
2. Choose the narrowest semantic token: e.g., use `text-muted-foreground` instead of `text-foreground` for secondary copy.
3. For custom CSS (rare): reference tokens directly, e.g., `color: var(--color-accent-foreground)`.
4. Avoid repurposing `--destructive` outside error/danger contexts.
5. Maintain contrast (WCAG AA) when adding new color pairs; validate with a contrast checker before commit.

## Adding New Tokens
1. Add to `:root` and `.dark` with light/dark values.
2. If it represents a new semantic group, create corresponding `--color-*` mapping.
3. Update this doc with rationale.

## Future Enhancements
- Potential extraction of tokens into `tokens.css` for reuse across multiple packages.
- Introduce motion tokens (e.g., `--ease-emphasized`, `--duration-sm`).
- Provide chart color scale variants for light/dark accessible palettes.
- Add semantic elevation utilities mapping `--surface-*` for opt‑in component styling.

## Dark Theme Refinement (Issue 004)
Implemented layered surface tokens (`--surface-root`, `--surface-1..3`) using `color-mix` in OKLCH for subtle elevation without hue shift. Card & popover now reference these surfaces instead of bespoke values. Borders and inputs use mixed foreground/background ratios to reduce low‑contrast gray flattening. Shadows converted to modern layered blur offsets with transparency mixing tuned for dark backgrounds (avoiding muddy overlays). Added `--ring-focus` to decouple focus outline from general interactive ring color.

Guidelines:
1. Prefer using existing semantic wrappers (`card`, `popover`, component shells) instead of directly applying `--surface-*` tokens.
2. When creating a new elevated container: start from `--surface-1` and only step upward if adjacent context demands stronger separation.
3. Avoid stacking more than two elevation steps in a single visual cluster to prevent contrast washout.
4. Use `focus-visible` utilities (see `@utility ui-focus`) which now leverage `--ring-focus` for consistent accessibility.

Contrast Checks (Representative Pairs):
- `foreground` on `background` (dark): AA+ for body text.
- `muted-foreground` on `muted`: passes large text; reserve for metadata.
- `accent-foreground` on `accent`: AA for UI iconography at 16px+.

Migration Note: Existing components continue working; no breaking variable renames. Surface tokens are additive.

## Contrast Tooling (Issue 005)
Automated contrast validation prevents regressions:

- Script: `frontend/scripts/contrast-check.ts`
- Run locally: `pnpm --filter frontend contrast`
- CI: GitHub Action `.github/workflows/contrast.yml` blocks merges on failure.

Pairs Checked (light & dark):
- `--foreground` on `--background`
- `--muted-foreground` on `--muted`
- `--primary-foreground` on `--primary`
- `--destructive-foreground` on `--destructive`
- `--accent-foreground` on `--accent`
- `--ring-focus` on `--background` (treated as large text threshold)

Thresholds:
- Normal text: 4.5:1
- Large / focus ring: 3.0:1

Updating Tokens:
1. Adjust values in `globals.css`.
2. Run contrast script.
3. If intentional reduction (rare), raise a design note—do not ignore failures silently.

Extensibility: Add more pairs by editing the PAIRS array in the script.

## Audit Checklist (Complete)
- [x] Tokens consolidated in `globals.css`
- [x] Dark mode strategy commented
- [x] Components rely on semantic classes (spot check: hero57, buttons, forms)
- [x] Documentation added

