#!/usr/bin/env node
/**
 * Aggregates Assist evaluation markdown templates into a summary JSON.
 * Scans docs/i18n/assist-evidence/raw/*.md
 * Looks for lines: `Accuracy: N`, `Terminology: N`, `Grammar: N`, `Tone: N`, `Formatting: N`
 * Outputs JSON with averages and optional GO/HOLD decision suggestion.
 */
import fs from 'node:fs';
import path from 'node:path';

const RAW_DIR = path.resolve('docs/i18n/assist-evidence/raw');

const metrics = ['Accuracy','Terminology','Grammar','Tone','Formatting'];
const totals = Object.fromEntries(metrics.map(m=>[m.toLowerCase(),0]));
let count = 0;
const samples = [];

if (!fs.existsSync(RAW_DIR)) {
  console.error(`Raw directory not found: ${RAW_DIR}`);
  process.exit(1);
}

for (const file of fs.readdirSync(RAW_DIR)) {
  if (!file.endsWith('.md')) continue;
  const full = path.join(RAW_DIR,file);
  const text = fs.readFileSync(full,'utf8');
  const sample = { file };
  let hasMetric = false;
  for (const m of metrics) {
    const regex = new RegExp(`^\\s*${m}\\s*:\\s*(\\d+(?:\\.\\d+)?)\\s*$`,'im');
    const match = text.match(regex);
    if (match) {
      const val = Number(match[1]);
      if (!Number.isNaN(val)) {
        totals[m.toLowerCase()] += val;
        sample[m.toLowerCase()] = val;
        hasMetric = true;
      }
    }
  }
  if (hasMetric) {
    count++;
    samples.push(sample);
  }
}

if (count === 0) {
  console.error('No evaluation samples with metrics found.');
  process.exit(2);
}

const averages = Object.fromEntries(Object.entries(totals).map(([k,v])=>[k, Number((v/count).toFixed(2))]));

// Decision heuristic (mirror assist-eval.md guidance)
const minAverage = Number(process.env.ASSIST_MIN_AVG || '3.8');
const minMetric = Number(process.env.ASSIST_MIN_METRIC || '3.5');
let decision = 'GO';
for (const v of Object.values(averages)) {
  if (v < minMetric) { decision = 'HOLD'; break; }
}
if (decision === 'GO' && (Object.values(averages).reduce((a,b)=>a+b,0)/metrics.length) < minAverage) {
  decision = 'HOLD';
}

const result = {
  samples: count,
  averages,
  thresholds: { minAverage, minMetric },
  decision,
  samplesDetail: samples,
  timestamp: new Date().toISOString()
};

if (process.argv.includes('--json')) {
  process.stdout.write(JSON.stringify(result,null,2));
} else {
  console.log('Assist Evaluation Summary');
  console.log('Samples:', count);
  console.log('Averages:', averages);
  console.log('Decision:', decision);
  console.log('(set ASSIST_MIN_AVG / ASSIST_MIN_METRIC env vars to adjust thresholds)');
}

if (decision === 'HOLD') process.exitCode = 3;
