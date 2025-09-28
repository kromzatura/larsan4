# Design: Localized Alt Text & Pricing Objects

Date: 2025-09-28

## 1. Localized Alt Text

Schema: `localizedAltText`
```ts
// localized-alt-text.ts (planned)
export default defineType({
  name: 'localizedAltText',
  title: 'Localized Alt Text',
  type: 'object',
  fields: [
    defineField({ name: 'en', type: 'string', validation: r => r.min(3).warning('Short alt may be unhelpful') }),
    defineField({ name: 'nl', type: 'string' }),
  ],
  preview: { select: { en: 'en', nl: 'nl' }, prepare: ({ en, nl }) => ({ title: en || nl || 'Alt Text' }) },
});
```

Usage Path (Phase 1): Only for new/modified image fields inside updated blocks/components.
Phase 2 (post Gate 4): Integrate globally for all key marketing imagery.

Validation Strategy:
| Phase | Validation | Behavior |
|-------|------------|----------|
| Gate 3 | Warning if EN missing; NL optional | Non-blocking |
| Gate 4 | Error if EN missing; Warning if NL missing | Blocks publish if EN empty |
| Gate 5 | Error both locales required | Full enforcement |

## 2. Pricing Object

Problem: Pricing currently embedded inconsistently in block variants. Need single normalized object for product pricing, plus reused in pricing display blocks.

Core Schema: `productPricing`
```ts
// product-pricing.ts (planned)
export default defineType({
  name: 'productPricing',
  title: 'Product Pricing',
  type: 'object',
  fields: [
    defineField({ name: 'currency', type: 'string', options: { list: [{title:'EUR', value:'EUR'},{title:'USD', value:'USD'}], layout: 'radio' }, initialValue: 'EUR' }),
    defineField({ name: 'tiers', type: 'array', of: [{ type: 'pricingTier' }], validation: r => r.min(1) }),
  ],
});

// pricing-tier.ts (planned)
export default defineType({
  name: 'pricingTier',
  title: 'Pricing Tier',
  type: 'object',
  fields: [
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'monthly', type: 'number', validation: r => r.min(0) }),
    defineField({ name: 'yearly', type: 'number' }),
    defineField({ name: 'features', type: 'array', of: [{ type: 'string' }] }),
    // Localizable microcopy (later upgrade to localizedString)
  ],
});
```

Localization Approach:
Phase 1: Numeric pricing non-localized (currency symbol determined frontend). Features remain plain strings.
Phase 2: Introduce `localizedString` object for `title`, `description`, feature bullet text.

## 3. Query Pattern (Pseudo)
```groq
// product projection snippet
    pricing {
      currency,
      tiers[]{
        slug,
        title,
        description,
        monthly,
        yearly,
        features
      }
    }
```

## 4. Migration Outline
| Step | Action |
|------|--------|
| 1 | Add new objects (commented out or behind flag) |
| 2 | Publish schemas & typegen |
| 3 | Write script to scan existing pricing blocks, infer canonical product-level tiers |
| 4 | Attach canonical pricing object to each `product` doc |
| 5 | Update frontend to prefer `product.pricing` falling back to block tier definitions |
| 6 | Coverage script: % products with pricing object |
| 7 | Deprecate block-level duplicated numeric values (Gate 5) |

## 5. Coverage Scripts (Future)
- Alt Text Coverage: count images missing `localizedAltText.en` or `.nl`.
- Pricing Adoption: count `product` docs with `pricing` defined.

## 6. Risks
- Editor confusion during dual-source pricing period → UI hint in pricing blocks.
- Partial alt adoption leads to inconsistent a11y → dashboard script early.
