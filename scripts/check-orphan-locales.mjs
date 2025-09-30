#!/usr/bin/env node
/**
 * Orphan Locale Checker
 *
 * Detects documents whose stored language (field `language` or `_lang`) is not in the supported LOCALES list.
 * Requires read access; does a lightweight query per batch.
 *
 * Exit codes:
 *   0 = no orphan locales
 *   1 = orphan locales found
 */
import path from 'node:path';
import { pathToFileURL } from 'node:url';

let createClient;
try { ({ createClient } = await import('@sanity/client')); } catch {
  try {
    const studioClientPath = pathToFileURL(path.join(process.cwd(), 'studio','node_modules','@sanity','client','dist','index.js')).href;
    ({ createClient } = await import(studioClientPath));
  } catch {
    console.error('[orphan-locales] Cannot resolve @sanity/client');
    process.exit(2);
  }
}

let LOCALES = ['en'];
try {
  const mod = await import('../shared/locales.js').catch(()=>import('../shared/locales.ts'));
  if (Array.isArray(mod.LOCALES)) LOCALES = [...mod.LOCALES];
} catch {}

const args = process.argv.slice(2);
const getArgVal = (f)=>{ const i=args.indexOf(f); return i!==-1? args[i+1]:undefined; };
const projectId = getArgVal('--project') || process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = getArgVal('--dataset') || process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = getArgVal('--token') || process.env.SANITY_API_READ_TOKEN || process.env.SANITY_WRITE_TOKEN;
const wantJson = args.includes('--json');

if (!projectId) { console.error('[orphan-locales] Missing projectId'); process.exit(2); }

const client = createClient({ projectId, dataset, token, apiVersion: '2024-10-31', useCdn: false });

// Query: fetch docs with language field plus fallback to _lang, any type
const query = `*[_type != 'sanity.imageAsset' && _type != 'sanity.fileAsset']{ _id, _type, language, _lang }`;

const run = async () => {
  const docs = await client.fetch(query);
  const orphans = [];
  for (const d of docs) {
    const loc = d.language || d._lang;
    if (loc && !LOCALES.includes(loc)) {
      orphans.push({ _id: d._id, _type: d._type, language: loc });
    }
  }
  const summary = { version:1, projectId, dataset, supported: LOCALES, total: docs.length, orphanCount: orphans.length, orphans: orphans.slice(0,200) };
  if (wantJson) console.log(JSON.stringify(summary,null,2)); else console.log('[orphan-locales] total='+docs.length+' orphan='+orphans.length);
  if (orphans.length) process.exit(1);
};

run().catch(e=>{ console.error('[orphan-locales] error', e); process.exit(1); });
