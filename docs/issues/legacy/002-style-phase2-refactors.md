# Issue 002: Style System Phase 2 Refactors

## Goal
Implement the next wave of styling architecture improvements to reduce duplication, improve variant expressiveness, and enhance accessibility.

## Components / Areas
- Dropdown Menu Items (CVA)
- Tabs (CVA abstraction for triggers + content)
- Switch (size variants `sm|md|lg` with ≥44px tap target at `lg`)
- Icon Utility (`.ui-icon` class or dedicated component wrapper)
- Reduced Motion Support (global + per-component fallbacks)

## Tasks
1. Create `components/ui/icon-base.css` or utility class for default icon sizing & alignment.
2. Refactor DropdownMenuItem into CVA: variants `default|destructive`, states `[data-disabled]`, `[data-highlighted]`.
3. Refactor TabsTrigger with CVA controlling size + emphasis variants (e.g., `underline|filled|pill`).
4. Implement Switch CVA: variants for size; ensure focus ring uses `ui-focus`.
5. Add `prefers-reduced-motion` media query in `globals.css` to neutralize non-essential animations.
6. Update docs/style.md Section 15 with new patterns & rationale.
7. Add story/demo (optional) for new size variants & dropdown states.

## Acceptance Criteria
- All refactored components compile, pass lint.
- No regression in existing visual states (manual spot check).
- `ui-focus` consistently applied; can opt-out with `no-ui-focus`.
- Motion reduced when system setting is enabled.

## Metrics (Informal)
- Lines removed vs added (expect net reduction or near break-even with improved clarity).
- Count of repeated icon sizing selectors before vs after (target: 0 outside utility).

## Follow-Up
Proceed to Issue 004 for dark theme token refinement once refactors stable.
