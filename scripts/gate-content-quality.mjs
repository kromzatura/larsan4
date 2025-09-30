#!/usr/bin/env node
/**
 * Content Quality Gate (Composite)
 *
 * Runs translation coverage (offline NDJSON snapshot) and pricing adoption live query.
 * Intended for CI gating.
 *
 * Behavior:
 *  - Requires at least one of --coverage-file OR --skip-coverage
 *  - Requires project/dataset for pricing adoption unless --skip-pricing
 *  - Fails (exit 1) if thresholds not met.
 *
 * Flags:
 *   --coverage-file <path.ndjson>    NDJSON export for translation coverage
 *   --coverage-min <percent>         Minimum translation coverage percent
 *   --project <id>                   Sanity project id
 *   --dataset <name>                 Dataset (default production)
 *   --token <token>                  Token (if needed for pricing adoption query)
 *   --pricing-min <percent>          Minimum structured pricing percent
 *   --skip-coverage                  Skip translation coverage check
 *   --skip-pricing                   Skip pricing adoption check
 *   --json                           Emit single JSON summary object
 *   --details                        Pass through details for pricing adoption
 */

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const args = process.argv.slice(2);
const getArgVal = (f) => { const i = args.indexOf(f); return i !== -1 ? args[i+1] : undefined; };
const coverageFile = getArgVal('--coverage-file');
const coverageMinRaw = getArgVal('--coverage-min');
const pricingMinRaw = getArgVal('--pricing-min');
const skipCoverage = args.includes('--skip-coverage');
const skipPricing = args.includes('--skip-pricing');
const wantJson = args.includes('--json');
const wantDetails = args.includes('--details');

const projectId = getArgVal('--project') || process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = getArgVal('--dataset') || process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = getArgVal('--token') || process.env.SANITY_API_READ_TOKEN || process.env.SANITY_WRITE_TOKEN;

const rootDir = path.dirname(fileURLToPath(import.meta.url));
function scriptPath(rel) { return path.join(rootDir, rel); }

let coverageMin = coverageMinRaw ? Number(coverageMinRaw) : null;
if (coverageMinRaw && (isNaN(coverageMin) || coverageMin < 0)) { console.error('[gate] invalid --coverage-min'); process.exit(2); }
let pricingMin = pricingMinRaw ? Number(pricingMinRaw) : null;
if (pricingMinRaw && (isNaN(pricingMin) || pricingMin < 0)) { console.error('[gate] invalid --pricing-min'); process.exit(2); }

if (!skipCoverage && !coverageFile) { console.error('[gate] coverage file required unless --skip-coverage'); process.exit(2); }
if (!skipPricing && !projectId) { console.error('[gate] project id required for pricing unless --skip-pricing'); process.exit(2); }

function runNodeScript(nodeArgs, script, extraArgs=[]) {
  return new Promise((resolve) => {
    const proc = spawn(process.execPath, [...nodeArgs, script, ...extraArgs], { stdio: ['ignore','pipe','pipe'] });
    let stdout=''; let stderr='';
    proc.stdout.on('data', d => stdout += d.toString());
    proc.stderr.on('data', d => stderr += d.toString());
    proc.on('close', code => resolve({ code, stdout, stderr }));
  });
}

async function main() {
  let coverageResult = null; let pricingResult = null; let failed = false;

  if (!skipCoverage) {
    const coverArgs = [scriptPath('check-translation-coverage.mjs')];
    if (coverageMin != null) coverArgs.push('--min', String(coverageMin));
    if (coverageFile) coverArgs.push(coverageFile);
    const r = await runNodeScript(['--no-warnings'], coverArgs[0], coverArgs.slice(1));
    try { coverageResult = JSON.parse(r.stdout); } catch { coverageResult = { parseError: true, raw: r.stdout }; }
    if (coverageMin != null && coverageResult.coveragePercent != null && coverageResult.coveragePercent < coverageMin) failed = true;
    if (r.code !== 0) failed = true;
  }

  if (!skipPricing) {
    const adoptionArgs = [scriptPath('report-pricing-adoption.mjs')];
    if (pricingMin != null) adoptionArgs.push('--min', String(pricingMin));
    if (projectId) adoptionArgs.push('--project', projectId);
    if (dataset) adoptionArgs.push('--dataset', dataset);
    if (token) adoptionArgs.push('--token', token);
    if (wantDetails) adoptionArgs.push('--details');
    adoptionArgs.push('--json');
    const r = await runNodeScript(['--no-warnings'], adoptionArgs[0], adoptionArgs.slice(1));
    try { pricingResult = JSON.parse(r.stdout); } catch { pricingResult = { parseError: true, raw: r.stdout }; }
    if (pricingMin != null && pricingResult.structuredPercent != null && pricingResult.structuredPercent < pricingMin) failed = true;
    if (r.code !== 0) failed = true;
  }

  const summary = {
    version: 1,
    coverage: coverageResult,
    pricing: pricingResult,
    thresholds: { coverageMin, pricingMin },
    pass: !failed,
  };

  if (wantJson) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    console.log('[gate] pass=' + (!failed));
    if (coverageResult) console.log('[gate] coverage=' + coverageResult.coveragePercent + '% (min ' + coverageMin + ')');
    if (pricingResult) console.log('[gate] pricingStructured=' + pricingResult.structuredPercent + '% (min ' + pricingMin + ')');
  }

  process.exit(failed ? 1 : 0);
}

main().catch(e => { console.error('[gate] error', e); process.exit(1); });
