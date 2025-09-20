# Issue 004: Dark Theme Token Refinement

## Goal
Enhance dark mode visual depth, contrast, and semantic layering using token overrides rather than scattered `dark:` utilities.

## Current State
- Base `.dark` block defines high-level tokens but may lack nuanced elevation (surface layers, subtle borders, muted foreground adjustments).
- Some components apply explicit `dark:` classes for compensation.

## Strategy
1. Introduce layered surface tokens: `--surface-1` (background), `--surface-2` (elevated), `--surface-3` (overlay) for dark mode.
2. Adjust `--muted`, `--accent`, and `--border` for improved contrast (target WCAG AA for text on surfaces, >= 4.5 where applicable).
3. Replace component-level `dark:` overrides with reliance on refined tokens.
4. Validate with contrast script (Issue 005) or manual spot checks using devtool eyedropper.

## Tasks
1. Extend `.dark` block in `globals.css` with surface token variables.
2. Map new tokens into `@theme inline` if needed for Tailwind utilities (`bg-surface-2`, etc.).
3. Refactor components removing redundant `dark:` classes where tokens now suffice.
4. Document changes in `style.md` (sections 4 & 9 updates) + add token table.
5. Run visual regression spot check (screenshots, manual compare if available).

## Acceptance Criteria
- Zero `dark:` utility usages compensating for poor base contrast in primitives (inputs, buttons, menus).
- Meets contrast goals (AA for body, AA large for headings if exceptions).
- No increase in CSS bundle size > +1% due solely to added tokens.

## Follow-Up
Proceed to Issue 005 for automated contrast enforcement.
