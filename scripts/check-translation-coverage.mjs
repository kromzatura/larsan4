#!/usr/bin/env node
/**
 * Translation coverage checker v2 (Gate 4)
 * Enhancements:
 * - Explicit type filtering (--types product,post,page,faq,specification)
 * - Per-type coverage breakdown
 * - Counts missing locales per key
 * - Versioned JSON output { version:2 }
 * - More robust locale inference: `_id` suffix `.LOCALE` or `_lang` field
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const ndjsonArg = args.find(a => a.endsWith('.ndjson'));
const typesArgIdx = args.findIndex(a => a === '--types');
let filterTypes = null;
if (typesArgIdx !== -1 && args[typesArgIdx + 1]) {
  filterTypes = args[typesArgIdx + 1].split(',').map(s => s.trim()).filter(Boolean);
}

const requiredLocales = ['en', 'nl'];

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

if (filterTypes) {
  records = records.filter(r => filterTypes.includes(r._type));
}

// Group by composite key
const compositeKey = r => `${r._type}::${r.slug?.current || r._id}`;
const groups = new Map();
for (const doc of records) {
  const k = compositeKey(doc);
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(doc);
}

const inferLocale = (doc) => {
  if (typeof doc.language === 'string' && doc.language) return { locale: doc.language, source: 'field:language' };
  if (doc._lang && typeof doc._lang === 'string') return { locale: doc._lang, source: 'field:_lang' };
  const m = doc._id.match(/\.([a-z]{2})(?:$|[\-])/i);
  if (m) return { locale: m[1], source: 'id-suffix' };
  return { locale: requiredLocales[0], source: 'default' };
};

const details = [];
for (const [k, docs] of groups.entries()) {
  const perLocale = {};
  for (const d of docs) {
    const { locale: loc, source } = inferLocale(d);
    (perLocale[loc] ||= []).push({ id: d._id, source });
  }
  const presentLocales = Object.keys(perLocale);
  const missingLocales = requiredLocales.filter(l => !presentLocales.includes(l));
  details.push({
    key: k,
    type: docs[0]._type,
    locales: presentLocales,
    missingLocales,
    counts: Object.fromEntries(Object.entries(perLocale).map(([l, arr]) => [l, arr.length])),
    sources: Object.fromEntries(Object.entries(perLocale).map(([l, arr]) => [l, Array.from(new Set(arr.map(x => x.source)))])),
  });
}

// Aggregate
const byType = {};
let complete = 0;
for (const row of details) {
  const hasAll = requiredLocales.every(l => row.locales.includes(l));
  if (hasAll) complete++;
  row.complete = hasAll;
  (byType[row.type] ||= { total: 0, complete: 0 }).total++;
  if (hasAll) byType[row.type].complete++;
}
for (const t of Object.keys(byType)) {
  const entry = byType[t];
  entry.coveragePercent = entry.total ? +(entry.complete / entry.total * 100).toFixed(1) : 0;
}

const total = details.length;
const coveragePercent = total ? +(complete / total * 100).toFixed(1) : 0;

const output = {
  version: 2,
  requiredLocales,
  filteredTypes: filterTypes,
  total,
  complete,
  coveragePercent,
  perType: byType,
  details,
};

console.log(JSON.stringify(output, null, 2));
