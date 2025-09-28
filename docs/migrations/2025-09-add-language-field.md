# Migration: Add hidden language field to translatable documents

Date: 2025-09-28

## Summary
Hidden read-only `language` field added to all document types participating in (or adjacent to) localization. Initial value defaults to `en`. Existing non-English documents (e.g. Dutch) need backfill so queries can filter on `language == $lang` without relying on `_id` inference or plugin internals.

## Affected Types
```
page
post
product
productCategory
category
settings
navigation
faq
specification
banner
contact
author
changelog
team
testimonial
translationTest
```

## Backfill Strategy
Use a GROQ patch script to set `language` for every document missing it. Determine locale via one of:
1. `_id` suffix convention: `<docId>.<locale>` (if used) → capture locale part.
2. If part of a translation group (plugin metadata) – fetch siblings and infer locale by exclusion.
3. Fallback: `en`.

## Example Patch Script (outline)
```js
import { createClient } from '@sanity/client';
const client = createClient({ projectId: '', dataset: '', token: process.env.SANITY_WRITE, apiVersion: '2024-10-31' });

const types = [ 'page','post','product','productCategory','category','settings','navigation','faq','specification','banner','contact','author','changelog','team','testimonial','translationTest'];

(async () => {
  for (const type of types) {
    const docs = await client.fetch(`*[_type == $type && !defined(language)]{ _id }`, { type });
    for (const d of docs) {
      const m = d._id.match(/\.([a-z]{2})(?:$|[\-])/i);
      const inferred = m ? m[1] : 'en';
      await client.patch(d._id).set({ language: inferred }).commit();
      console.log('Patched', d._id, '->', inferred);
    }
  }
})();
```

## Validation
After running patch:
- Query: `count(*[!defined(language)])` should be 0 for affected types.
- Spot check a few Dutch docs for `language == 'nl'`.

## Frontend Follow-up
Update queries to filter by `$lang` explicitly and implement fallback logic if necessary.

## Rollback Plan
Safe to remove field if not yet used in frontend; delete field definitions and regenerate types. No destructive data migration was performed.
