#!/usr/bin/env node
/**
 * Backfill script: sets `language` field for documents missing it.
 * Heuristics:
 * 1. If _id ends with .<cc> (two-letter), use that as locale.
 * 2. Else default to 'en'.
 *
 * Requires SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET, and a token with write access (SANITY_WRITE_TOKEN).
 */
// Optional dotenv load: don't hard-fail if not installed in this workspace context.
try {
  await import('dotenv/config');
} catch (e) {
  // Silently continue; environment variables may already be present.
}
import { createClient } from '@sanity/client';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('[backfill-language] Missing projectId or SANITY_WRITE_TOKEN');
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: '2024-10-31', token, useCdn: false });

const TYPES = [
  'page','post','product','productCategory','category','settings','navigation','faq','specification','banner','contact','author','changelog','team','testimonial','translationTest'
];

const dry = process.argv.includes('--dry');

(async () => {
  const docs = await client.fetch(`*[_type in $types && !defined(language)]{ _id, _type }`, { types: TYPES });
  if (!docs.length) {
    console.log('[backfill-language] No documents missing language field.');
    return;
  }
  console.log(`[backfill-language] Found ${docs.length} docs to backfill`);

  let patched = 0;
  for (const d of docs) {
    const m = d._id.match(/\.([a-z]{2})(?:$|[\-])/i);
    const locale = m ? m[1] : 'en';
    if (dry) {
      console.log('[dry-run] would patch', d._id, '->', locale);
      continue;
    }
    await client.patch(d._id).set({ language: locale }).commit();
    patched++;
    console.log('patched', d._id, '->', locale);
  }
  if (!dry) console.log(`[backfill-language] Completed. Patched ${patched} documents.`);
})();
