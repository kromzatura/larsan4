#!/usr/bin/env node
/**
 * Pricing Migration Apply (Danger Zone)
 *
 * Applies migration similar to migrate-pricing-dry-run but actually writes patches.
 *
 * Safety mechanics:
 *  - Requires --yes to proceed with writes.
 *  - Supports --limit <n> to cap number of documents patched in a single run.
 *  - Supports --dry to preview selected subset before write (alias for using dry-run script, but convenient).
 *  - Prints a JSON summary at end.
 *
 * Flags:
 *   --project <id>
 *   --dataset <name>
 *   --token <token> (write token required unless dataset is insecurely public writable)
 *   --yes               Confirm you really want to apply patches
 *   --limit <n>         Maximum documents to patch (default 20) to prevent runaway
 *   --currency <CODE>   Force currency when absent (default EUR)
 *   --json              Output JSON summary only
 *   --dry               Do not write, just show would-change list (subset)
 *
 * Exit codes:
 *   0 success (even if nothing to migrate)
 *   1 fatal error or aborted due to missing confirmation
 */

import crypto from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { classifyProductRecord } from './lib/pricing-utils.mjs';

let createClient;
try { ({ createClient } = await import('@sanity/client')); } catch {
  try {
    const studioClientPath = pathToFileURL(path.join(process.cwd(), 'studio','node_modules','@sanity','client','dist','index.js')).href;
    ({ createClient } = await import(studioClientPath));
    console.log('[pricing-migration-apply] resolved @sanity/client from studio/node_modules');
  } catch {
    console.error('[pricing-migration-apply] Cannot resolve @sanity/client');
    process.exit(2);
  }
}

const args = process.argv.slice(2);
const getArgVal = (f) => { const i = args.indexOf(f); return i !== -1 ? args[i+1] : undefined; };
const projectId = getArgVal('--project') || process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = getArgVal('--dataset') || process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = getArgVal('--token') || process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;
const forcedCurrency = getArgVal('--currency') || 'EUR';
const limitRaw = getArgVal('--limit');
const limit = limitRaw ? parseInt(limitRaw,10) : 20;
const confirmed = args.includes('--yes');
const wantJson = args.includes('--json');
const dry = args.includes('--dry');

if (!projectId) { console.error('[pricing-migration-apply] Missing projectId'); process.exit(2); }
if (!token) { console.error('[pricing-migration-apply] Missing token (write token required)'); process.exit(2); }
if (Number.isNaN(limit) || limit <= 0) { console.error('[pricing-migration-apply] Invalid --limit'); process.exit(2); }

const client = createClient({ projectId, dataset, apiVersion: '2024-10-31', token, useCdn: false });

const productQuery = `*[_type == "product"]{ _id, title, pricing{ currency, tiers[]{ _key } }, monthlyPrice, yearlyPrice }`;

function slugify(str) { return (str||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,48); }

function buildPatch(p) {
  const classification = classifyProductRecord(p);
  if (classification !== 'legacyOnly' && classification !== 'mixed') return null;
  const currency = p?.pricing?.currency || forcedCurrency;
  const tierTitle = p.title || 'Tier';
  const tierSlug = slugify(tierTitle) || 'tier';
  const tierKey = crypto.randomBytes(8).toString('hex');
  const tier = {
    _type: 'pricingTier',
    _key: tierKey,
    slug: { _type: 'slug', current: tierSlug },
    title: tierTitle,
    description: null,
    monthly: p.monthlyPrice ?? null,
    yearly: p.yearlyPrice ?? null,
    features: ['MIGRATED: review features','Replace placeholder features'],
  };
  const addContainer = !p.pricing;
  const setObj = addContainer ? {
    pricing: { _type: 'productPricing', currency, tiers: [tier] }
  } : {
    'pricing.currency': currency,
    'pricing.tiers': [ ...(p.pricing?.tiers || []), tier ]
  };
  return { _id: p._id, addContainer, set: setObj };
}

async function run() {
  const products = await client.fetch(productQuery);
  const candidates = [];
  for (const p of products) {
    const patch = buildPatch(p);
    if (patch) candidates.push(patch);
  }
  const totalCandidates = candidates.length;
  const toApply = candidates.slice(0, limit);

  if (!wantJson) {
    console.log('[pricing-migration-apply] candidates=' + totalCandidates + ' limit=' + limit);
  }

  if (dry && !wantJson) {
    console.log('[pricing-migration-apply] DRY RUN (no writes) showing first ' + toApply.length + ' patches');
  }

  const applied = [];
  if (!dry) {
    if (!confirmed) {
      console.error('[pricing-migration-apply] Aborted: missing --yes confirmation');
      process.exit(1);
    }
    for (const p of toApply) {
      try {
        await client.patch(p._id).set(p.set).commit();
        applied.push(p._id);
        if (!wantJson) console.log('[pricing-migration-apply] patched ' + p._id);
      } catch (e) {
        console.error('[pricing-migration-apply] failed patch for ' + p._id, e.message);
      }
    }
  }

  const result = {
    version: 1,
    projectId,
    dataset,
    totalCandidates,
    limited: limit,
    appliedCount: applied.length,
    appliedIds: applied,
    dry,
  };

  if (wantJson) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log('[pricing-migration-apply] summary applied=' + applied.length + ' / ' + totalCandidates);
    if (dry) console.log('[pricing-migration-apply] (dry run) Use --yes to apply.');
  }
}

run().catch(e => { console.error('[pricing-migration-apply] error', e); process.exit(1); });
