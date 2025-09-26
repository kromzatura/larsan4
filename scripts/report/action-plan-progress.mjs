#!/usr/bin/env node
/**
 * Simple progress reporter for an action plan markdown file.
 * Counts lines that start with a numeric task list entry and checks status symbols.
 * Usage: node scripts/report/action-plan-progress.mjs docs/action-plan/ACTIONS_V2.md
 */
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/report/action-plan-progress.mjs <path-to-action-plan.md>');
  process.exit(1);
}

const md = readFileSync(file, 'utf8');
// Task lines pattern: "<number>. <statusSymbol> ..."
const taskRegex = /^\s*(\d+)\.\s*([✔▶⏸☐])/u;

let total = 0;
let done = 0;
let inProgress = 0;
let blocked = 0;

for (const line of md.split('\n')) {
  const match = line.match(taskRegex);
  if (match) {
    total += 1;
    const symbol = match[2];
    switch (symbol) {
      case '✔':
        done += 1; break;
      case '▶':
        inProgress += 1; break;
      case '⏸':
        blocked += 1; break;
      default:
        break; // unchecked
    }
  }
}

const percent = total === 0 ? 0 : ((done / total) * 100).toFixed(1);

const report = {
  file: basename(file),
  totalTasks: total,
  doneCount: done,
  inProgressCount: inProgress,
  blockedCount: blocked,
  percentDone: Number(percent),
  timestamp: new Date().toISOString(),
};

console.log(JSON.stringify(report, null, 2));
