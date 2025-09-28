# Gate 3 Plan: Structured Localized Fields (Alt Text + Pricing)

Date: 2025-09-28

Objective: Introduce structured, locale-aware non-document fields without breaking existing queries; add localized alt text object & normalized pricing object referencing product data.

Scope (Initial):
1. Localized Alt Text Object (`localizedAltText`)
2. Product Pricing Object (`productPricing` + embedded tier arrays)
3. Query & component adaptation (lazy / additive; maintain backward compatibility for a transition window)

Out of Scope (Gate 3):
- Removing legacy inline price fields inside existing pricing blocks (sunset scheduled Gate 5).
- Introducing currency exchange automation.
- Adding additional locales beyond en/nl.

Exit Criteria:
1. Schemas added & registered (behind feature flag constant or commented out until migration ready)
2. Migration plan authored (no execution yet) for backfilling alt text placeholders and pricing normalization
3. Frontend components adjusted to use new fields when present (fallback to old)
4. GROQ fragments updated with conditional projection for new shapes
5. Validation: alt text warns if missing during transition; required post Gate 4

Risks & Mitigations:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Missing alt text reduces accessibility | Medium | Phased validation & coverage script |
| Pricing divergence between legacy blocks & new object | High | Single source of truth migration + runtime fallback check |
| Query bloat from dual shapes | Low | Use Coalesce/groq condition + prune legacy at Gate 5 |

Next Steps After Gate 3:
Gate 4: Migrations executed & coverage reports (alt text completeness, pricing adoption %).
