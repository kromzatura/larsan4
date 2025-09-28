# Performance Baseline Placeholder

Date: 2025-09-28

Real measurements (Lighthouse, WebPageTest, or Next.js build stats) not captured here. Before introducing localization overhead (queries, conditional rendering), capture:

| Metric | Target | Capture Tool |
| ------ | ------ | ------------ |
| LCP (homepage) | < 2.0s (desktop) | Lighthouse CI |
| LCP (homepage) | < 2.5s (mobile) | Lighthouse CI |
| TTFB (SSR) | < 200ms edge | vercel analytics / custom timing |
| JS bundle main | Maintain / reduce | `next build` stats |
| Static page count | Baseline number | `next build` output |

Action Items Prior to Gate 3:
1. Run local `next build` and export build analysis.
2. Record metrics into `performance-baseline.md` (replace this placeholder section).
3. After i18n implementation, re-run and produce a delta doc `performance-delta-gate3.md`.

Rationale: Ensures i18n changes (additional queries, routing segments) do not regress core web vitals beyond acceptable thresholds.
