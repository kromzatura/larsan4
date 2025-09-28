#!/usr/bin/env node
/**
 * Translation coverage checker (Gate 2 aid)
 * Assumptions:
 * - Internationalization implemented by creating parallel documents per locale (plugin-managed)
 * - Slugs are unique per locale; we infer pairing by slug+type
 * - This script queries dataset via environment variables ONLY if SANITY tokens present
 *   Otherwise it reads a local NDJSON file (if provided) for dry-run.
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const ndjsonArg = args.find(a => a.endsWith('.ndjson'));

let records = [];
if (ndjsonArg) {
  const abs = path.resolve(ndjsonArg);
  if (!fs.existsSync(abs)) {
    console.error('[error] NDJSON file not found:', abs);
    process.exit(1);
  }
  const lines = fs.readFileSync(abs, 'utf8').split(/\n/).filter(Boolean);
  records = lines.map(l => JSON.parse(l));
} else {
  console.warn('[warn] No NDJSON provided; coverage cannot be computed offline.');
}

// Group by type+slug
const key = r => `${r._type}::${r.slug?.current || r._id}`;
const groups = new Map();
for (const r of records) {
  const k = key(r);
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(r);
}

const summary = [];
for (const [k, docs] of groups.entries()) {
  // naive locale inference: id suffix .<locale> or field language (not present yet) → fallback: treat all as EN
  const localeBuckets = docs.reduce((acc, d) => {
    const inferred = /\.nl$/.test(d._id) ? 'nl' : (/\.en$/.test(d._id) ? 'en' : 'en');
    (acc[inferred] ||= []).push(d);
    return acc;
  }, {});
  summary.push({ key: k, locales: Object.keys(localeBuckets), counts: Object.fromEntries(Object.entries(localeBuckets).map(([l,v]) => [l, v.length])) });
}

const requiredLocales = ['en','nl'];
let complete = 0;
for (const row of summary) {
  const hasAll = requiredLocales.every(l => row.locales.includes(l));
  if (hasAll) complete++;
  row.complete = hasAll;
}

const coverage = summary.length ? (complete / summary.length * 100).toFixed(1) : '0.0';

console.log(JSON.stringify({ total: summary.length, complete, coveragePercent: coverage, details: summary }, null, 2));
