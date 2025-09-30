#!/usr/bin/env node
/**
 * Pricing Migration Dry-Run (Gate 4)
 *
 * Goal:
 *   Simulate migration from legacy inline pricing fields embedded inside pricing-* blocks
 *   (pricing-1, pricing-2, pricing-7, pricing-9, pricing-16) and product legacy fields
 *   (monthlyPrice / yearlyPrice if they exist in older schemas) into normalized
 *   productPricing.tiers (pricingTier objects) WITHOUT performing any mutations.
 *
 * This script:
 *   1. Fetches all product documents (id, title, language, pricing, monthlyPrice?, yearlyPrice?)
 *   2. Classifies each product into: alreadyStructured | legacyOnly | none | mixed
 *   3. Generates a proposed transformation payload for legacyOnly / mixed items:
 *        - currency heuristic: uses existing pricing.currency if present else 'EUR'
 *        - builds tiers array from any legacy price combos (monthly, yearly) into a single tier
 *          titled from product title (slugified fallback) with feature placeholders
 *   4. Outputs JSON summary + (optional) details of proposed document patches
 *   5. Returns non-zero exit code if --require-empty-legacy passed and legacy docs remain
 *
 * NOTE: This does NOT inspect page-level pricing-* content blocks because those represent
 *       marketing display variations rather than canonical product pricing source of truth.
 *       If required, extend by querying pages referencing products & extracting inline values.
 *
 * Output JSON structure:
 * {
 *   version: 1,
 *   totalProducts: number,
 *   counts: { structured: number, legacyOnly: number, mixed: number, none: number },
 *   percentages: { structured: number, legacyOnly: number, mixed: number, none: number },
 *   legacyProductIds: string[],
 *   mixedProductIds: string[],
 *   proposed: [ { _id, currency, addPricingContainer: boolean, patch: { set?: any } } ] // only when --details
 * }
 *
 * Flags:
 *   --project <id>
 *   --dataset <name>
 *   --token <token>
 *   --details            Include proposed patch objects (no mutations performed)
 *   --json               Print JSON only
 *   --require-empty-legacy  Exit 1 if any legacyOnly or mixed remain
 *   --currency <CODE>    Force currency code when absent (default EUR)
 *
 * Env fallbacks:
 *   SANITY_STUDIO_PROJECT_ID / NEXT_PUBLIC_SANITY_PROJECT_ID
 *   SANITY_STUDIO_DATASET / NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_READ_TOKEN / SANITY_WRITE_TOKEN
 */

import crypto from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { classifyProductRecord, accumulateClassification } from './lib/pricing-utils.mjs';

// Lazy / resilient import of @sanity/client supporting monorepo where dependency
// lives inside studio/ but not declared at root. We attempt root first, then studio.
let createClient;
try {
  ({ createClient } = await import('@sanity/client'));
} catch (e) {
  try {
    const studioClientPath = pathToFileURL(path.join(process.cwd(), 'studio', 'node_modules', '@sanity', 'client', 'dist', 'index.js')).href;
    ({ createClient } = await import(studioClientPath));
    console.log('[pricing-migration] resolved @sanity/client from studio/node_modules');
  } catch (e2) {
    console.error('[pricing-migration] Failed to resolve @sanity/client. Install it at root or in studio.');
    process.exit(2);
  }
}

const args = process.argv.slice(2);
const getArgVal = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i+1] : undefined; };
const wantDetails = args.includes('--details');
const wantJson = args.includes('--json');
const requireEmptyLegacy = args.includes('--require-empty-legacy');

const forcedCurrency = getArgVal('--currency') || 'EUR';
const projectId = getArgVal('--project') || process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = getArgVal('--dataset') || process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = getArgVal('--token') || process.env.SANITY_API_READ_TOKEN || process.env.SANITY_WRITE_TOKEN; // optional for public

if (!projectId) { console.error('[pricing-migration] Missing projectId'); process.exit(2); }

const client = createClient({ projectId, dataset, apiVersion: '2024-10-31', token, useCdn: false });

// We only fetch fields we need. Some legacy fields (monthlyPrice/yearlyPrice) might not exist anymore; keep query resilient.
const productQuery = `*[_type == "product"]{ _id, _type, title, language, pricing{ currency, tiers[]{ _key } }, monthlyPrice, yearlyPrice }`;

function slugify(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

function buildProposedPatch(p) {
  const classification = classifyProductRecord(p);
  if (classification === 'structured' || classification === 'none') return null;

  // Determine currency
  const currency = p?.pricing?.currency || forcedCurrency;
  // Construct a single tier from legacy fields. Extendable to multiple tiers if patterns emerge.
  const tierTitle = p.title || 'Tier';
  const tierSlug = slugify(tierTitle) || 'tier';

  const features = [ 'MIGRATED: review features', 'Replace placeholder features' ];

  const monthly = p.monthlyPrice ?? null;
  const yearly = p.yearlyPrice ?? null;

  // ID for tier key
  const tierKey = crypto.randomBytes(8).toString('hex');

  const tier = {
    _type: 'pricingTier',
    _key: tierKey,
    slug: { _type: 'slug', current: tierSlug },
    title: tierTitle,
    description: null,
    monthly: monthly,
    yearly: yearly,
    features,
  };

  const addPricingContainer = !p.pricing; // Will create full pricing object

  const patch = addPricingContainer
    ? {
        set: {
          pricing: {
            _type: 'productPricing',
            currency,
            tiers: [tier],
          },
        },
      }
    : {
        set: {
          'pricing.currency': currency,
          'pricing.tiers': [ ...(p.pricing?.tiers || []), tier ],
        },
      };

  return { _id: p._id, classification, currency, addPricingContainer, patch };
}

async function run() {
  const products = await client.fetch(productQuery);
  const { ids, counts, total, percentages } = accumulateClassification(products, classifyProductRecord);
  const proposed = [];
  // Build proposed patches only for legacyOnly and mixed
  for (const p of products) {
    const c = classifyProductRecord(p);
    if (c === 'legacyOnly' || c === 'mixed') {
      const patch = buildProposedPatch(p);
      if (patch) proposed.push(patch);
    }
  }
  const result = {
    version: 1,
    totalProducts: total,
    counts,
    percentages,
    legacyProductIds: ids.legacyOnly,
    mixedProductIds: ids.mixed,
    ...(wantDetails ? { proposed } : {}),
  };

  if (wantJson) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log('[pricing-migration] project=' + projectId + ' dataset=' + dataset);
    console.log('[pricing-migration] total=' + total);
  console.log('[pricing-migration] structured=' + counts.structured + ' (' + percentages.structured + '%)');
  console.log('[pricing-migration] legacyOnly=' + counts.legacyOnly + ' (' + percentages.legacyOnly + '%)');
  console.log('[pricing-migration] mixed=' + counts.mixed + ' (' + percentages.mixed + '%)');
  console.log('[pricing-migration] none=' + counts.none + ' (' + percentages.none + '%)');
    if (wantDetails) {
      console.log('[pricing-migration] proposed patches=' + proposed.length);
    }
    if (requireEmptyLegacy) {
      if (counts.legacyOnly + counts.mixed > 0) {
        console.log('[pricing-migration] FAIL: legacy pricing remains (use scripts to migrate)');
      } else {
        console.log('[pricing-migration] PASS: no legacy pricing');
      }
    }
  }

  if (requireEmptyLegacy && (counts.legacyOnly + counts.mixed > 0)) {
    process.exit(1);
  }
}

run().catch(err => { console.error('[pricing-migration] error', err); process.exit(1); });
