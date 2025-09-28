# Schema Inventory (Phase 0 Baseline)

Generated: 2025-09-28

Source: `studio/schema.ts` aggregated into `studio/schema.json` (Sanity CLI extract). This captures the pre-i18n (no per-document `language` field) state.

## Summary

- Total schema types (including documents, objects, blocks): Present in `schema.json` (length ≈ 300+ entries including inline/object variants)
- Document types earmarked for translation plugin: `page`, `post`, `product`, `productCategory`, `category`, `settings`, `navigation`
- No explicit `language` string fields exist yet in any document schema (validated separately in `language-field-audit.md`).

## Document Types

| Type | Notes |
| ---- | ----- |
| page | Main marketing / routing pages |
| post | Blog article |
| product | Product detail (pricing not yet localized) |
| productCategory | Product category taxonomy |
| category | Blog/category taxonomy |
| settings | Site-wide singleton |
| navigation | Menu structure |
| faq | Not yet in plugin list (decide later) |
| testimonial | Not yet in plugin list |
| contact | Singleton (not translatable currently) |
| changelog | Not yet in plugin list (future?) |
| team | Not yet in plugin list |
| banner | Singleton (excluded) |
| specification | Product spec (consider translation later) |
| translationTest | Experimental/testing doc |

## Pricing Blocks (Current State)
Pricing appears only inside presentation blocks (`pricing1`, `pricing2`, `pricing7`, `pricing9`, `pricing16`). No shared canonical product pricing object yet. Migration will introduce a normalized pricing object with localized price entries per currency/locale strategy (see audit Option 2).

## Alt Text Fields
Image/object fields currently rely on standard Sanity image fields without localized `{ en, nl }` alt object. Future step will introduce a localized alt text schema wrapper.

## Next Steps (Post Gate 0)
1. Gate 1: Confirm translation action surfaces in Studio (Assist + plugin) BEFORE adding new fields.
2. Gate 2: Validate Assist bulk translation reliability on a test doc set.
3. Gate 3+: Introduce structured localized objects (alt text, pricing) and adjust queries.

---
This file is immutable after Gate 0; changes later should produce a new versioned snapshot (e.g., `schema-inventory-gate3.md`).
