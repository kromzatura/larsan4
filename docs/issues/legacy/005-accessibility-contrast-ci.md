# Issue 005: Accessibility Contrast & Automated Checks

## Goal
Automate contrast validation for critical semantic token combinations to prevent regressions during future theming changes.

## Scope
- Validate text vs background for: `foreground`, `muted.foreground`, `primary.foreground`, `destructive.foreground`, `accent.foreground` across light & dark.
- Validate interactive states: focus ring color contrast relative to adjacent background.

## Strategy
1. Script (Node) that reads computed token values from `globals.css` (basic regex parse) or a JSON mirror if we extract one.
2. Use a contrast library (e.g., `colorjs.io` or custom OKLCH to sRGB conversion) to compute ratios.
3. Threshold: AA normal text (>=4.5), large text (>=3.0). Flag failures.
4. Integrate script as `pnpm run contrast` and optional pre-commit hook.

## Tasks
1. (Optional) Generate `tokens.json` snapshot from `globals.css`.
2. Implement `scripts/contrast-check.ts` to parse tokens & compute ratios.
3. Add dependencies (color conversion lib) to `frontend/package.json`.
4. Add CI step (GitHub Action) invoking `pnpm contrast`.
5. Document usage in `docs/style.md` Section 9 or new Section 16.

## Acceptance Criteria
- Running `pnpm contrast` outputs PASS/FAIL summary with each failing pair.
- CI fails on any contrast regression.
- Documentation instructs contributors how to update tokens & rerun.

## Follow-Up
Extend script later for motion reduction verification or prefers-color-scheme drift detection.
