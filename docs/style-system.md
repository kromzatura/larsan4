# Style System

This document summarizes the design token architecture and usage guidelines implemented in Issue 002.

## Token Sources
- Canonical token definitions live in `app/globals.css` under the `:root` and `.dark` blocks.
- Reference palette (historical snapshot) retained in `docs/new-look.md`.

## Categories
| Category | Prefix | Example | Notes |
|----------|--------|---------|-------|
| Surface  | `--background`, `--card`, `--popover` | `bg-background` | Paired with matching `*-foreground` tokens |
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

## Audit Checklist (Complete)
- [x] Tokens consolidated in `globals.css`
- [x] Dark mode strategy commented
- [x] Components rely on semantic classes (spot check: hero57, buttons, forms)
- [x] Documentation added

