# Component Conventions

This document defines baseline conventions for interactive UI primitives to ensure consistency, accessibility, and maintainability.

## 1. Data Slots
- Every primitive exports elements with a `data-slot` attribute.
- Pattern: `data-slot="<component-name>[-subpart]"` (kebab-case).
- Use for styling scoping and integration tests (avoid brittle DOM selectors).

## 2. Focus Styling
- All focusable interactive elements MUST include the `ui-focus` utility.
- `ui-focus` encapsulates: ring size, color, outline fallback, and offset.
- Opt-out only with `no-ui-focus` for composite or visually hidden focus proxies.
- Custom focus styles may extend but should not redefine ring/outline unless necessary for WCAG contrast.

## 3. Variants
- Prefer `class-variance-authority (CVA)` for components with 2+ stylistic axes (e.g., `variant`, `size`).
- Base class string kept minimal: layout + typography + shared semantics.
- Derive states via data attributes (e.g., `data-[state=open]`) over adding extra boolean props.

## 4. State & Data Attributes
- Use Radix `data-state` attributes where available (e.g., `open`, `active`, `checked`).
- Introduce additional semantic attributes only when they aid styling (`data-variant`, `data-inset`).
- Avoid duplicating props + data attributes for the same semantic meaning.

## 5. Icon Handling
- Apply fallback sizing/selectors with `[&_svg:not([class*='size-'])]:size-4`.
- Future: centralize as `.ui-icon` utility if repetition increases.
- Keep icons non-interactive inside buttons/links: `pointer-events-none`.

## 6. Invalid / Destructive States
- Use `aria-invalid` for error states; style using minimal selectors:
  - Border
  - Ring (if focused)
  - Optional outline color
- Keep total invalid-related selectors per component ≤5.

## 7. Dark Mode
- Prefer semantic tokens; only use explicit `dark:` classes when token values cannot communicate required contrast.
- Avoid duplicating `dark:` overrides if a token adjustment would solve the need globally.

## 8. Animation & Motion
- Use pre-declared keyframes + Tailwind utilities.
- Respect `prefers-reduced-motion` in future phases for any non-essential motion.

## 9. File Structure
- One component per file; export named primitives.
- Re-export grouped primitives via index barrel only when grouping improves DX (e.g., `blocks/index.tsx`).

## 10. Accessibility
- Always forward `...props` to root interactive element to preserve ARIA usage.
- Avoid removing outline unless replaced with accessible focus style (`ui-focus`).
- Ensure minimum hit target (≥44px logical) via padding or size variants.

## 11. Testing Hooks
- Favor `data-slot` for test querying rather than test IDs unless dynamic repetition requires more specificity.

## 12. Migration Guidance
- When refactoring existing components:
  1. Introduce `ui-focus`.
  2. Remove bespoke focus ring/outline classes.
  3. Consolidate invalid/error state selectors.
  4. Consider CVA adoption if adding or expanding variants.

## 13. Roadmap (Future Phases)
- Introduce `.ui-icon` utility.
- CVA adoption for dropdown menu item variants & tabs.
- Dark token layer to reduce `dark:` scatter.
- Reduced motion handling for all animated primitives.

---
Maintained with the design system evolution. Update alongside new primitives or token changes.
