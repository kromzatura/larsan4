#!/usr/bin/env node
/**
 * Pricing Normalization Verification
 *
 * Ensures all products have migrated away from legacy pricing fields.
 * Fails if any product classified as legacyOnly or mixed remains.
 *
 * Classification rules reuse logic similar to pricing utils but inlined here
 * to avoid accidental circular changes (could import if desired).
 *
 * Exit codes:
 *  0 = success
 *  1 = violations
 */
import path from 'node:path';
import { pathToFileURL } from 'node:url';

let createClient;
try { ({ createClient } = await import('@sanity/client')); } catch {
  try {
    const studioClientPath = pathToFileURL(path.join(process.cwd(), 'studio','node_modules','@sanity','client','dist','index.js')).href;
    ({ createClient } = await import(studioClientPath));
  } catch {
    console.error('[pricing-verify] Cannot load @sanity/client');
    process.exit(2);
  }
}

const args = process.argv.slice(2);
const getArgVal = (f) => { const i = args.indexOf(f); return i !== -1 ? args[i+1] : undefined; };
const projectId = getArgVal('--project') || process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = getArgVal('--dataset') || process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = getArgVal('--token') || process.env.SANITY_API_READ_TOKEN || process.env.SANITY_WRITE_TOKEN;
const wantJson = args.includes('--json');

if (!projectId) { console.error('[pricing-verify] Missing projectId'); process.exit(2); }

const client = createClient({ projectId, dataset, token, apiVersion: '2024-10-31', useCdn: false });

const query = `*[_type == "product"]{ _id, pricing{ tiers[]{ _key } }, monthlyPrice, yearlyPrice }`;

function classify(p){
  const hasStructured = !!(p.pricing && Array.isArray(p.pricing.tiers) && p.pricing.tiers.length>0);
  const hasLegacy = !!(p.monthlyPrice || p.yearlyPrice);
  if (hasStructured && hasLegacy) return 'mixed';
  if (hasStructured) return 'structured';
  if (hasLegacy) return 'legacyOnly';
  return 'none';
}

const run = async () => {
  const products = await client.fetch(query);
  const violations = products.filter(p => ['legacyOnly','mixed'].includes(classify(p))).map(p => ({ _id: p._id, classification: classify(p) }));
  const summary = {
    version: 1,
    projectId,
    dataset,
    totalProducts: products.length,
    violations: violations.length,
    violationIds: violations.slice(0,200),
  };
  if (wantJson) {
    console.log(JSON.stringify(summary,null,2));
  } else {
    console.log('[pricing-verify] total=' + products.length + ' violations=' + violations.length);
  }
  if (violations.length) process.exit(1);
};

run().catch(e => { console.error('[pricing-verify] error', e); process.exit(1); });
