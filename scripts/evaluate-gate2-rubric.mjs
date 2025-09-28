#!/usr/bin/env node
/**
 * Gate 2 rubric evaluator
 * Input: JSON array of rubric row objects OR file path argument.
 * Row shape example:
 * {"doc":"hero-marketing","type":"page","accuracy":5,"terminology":4,"readability":4,"structure":5,"effortPercent":20}
 */
import fs from 'node:fs';

const arg = process.argv[2];
let data = [];
if (arg) {
  const raw = fs.readFileSync(arg, 'utf8');
  data = JSON.parse(raw);
} else {
  const stdin = fs.readFileSync(0, 'utf8');
  if (!stdin.trim()) {
    console.error('Provide rubric JSON via file path or stdin.');
    process.exit(1);
  }
  data = JSON.parse(stdin);
}

if (!Array.isArray(data) || !data.length) {
  console.error('Rubric data empty.');
  process.exit(1);
}

const numeric = ["accuracy","terminology","readability","structure"];
const sums = { accuracy:0, terminology:0, readability:0, structure:0 };
let effortSum = 0;
for (const row of data) {
  numeric.forEach(k => { if (typeof row[k] === 'number') sums[k]+=row[k]; });
  if (typeof row.effortPercent === 'number') effortSum += row.effortPercent;
}
const count = data.length;
const averages = Object.fromEntries(Object.entries(sums).map(([k,v]) => [k, +(v/count).toFixed(2)]));
const avgEffort = +(effortSum / count).toFixed(2);
const composite = +(Object.values(averages).reduce((a,b)=>a+b,0)/numeric.length).toFixed(2);

const exitCriteria = {
  minComposite: 4.0,
  maxEffortPercent: 30,
};

const passes = composite >= exitCriteria.minComposite && avgEffort <= exitCriteria.maxEffortPercent;

console.log(JSON.stringify({ count, averages, avgEffort, composite, passes, exitCriteria }, null, 2));

if (!passes) process.exit(2);
