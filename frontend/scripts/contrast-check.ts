#!/usr/bin/env ts-node
/*
  Issue 005: Accessibility Contrast Check
  - Parses CSS custom properties for core semantic tokens from globals.css
  - Computes WCAG contrast ratios (sRGB) for specified foreground/background pairs
  - Exits with non-zero code if any pair fails thresholds
*/

import fs from 'node:fs';
import path from 'node:path';
import Color from 'colorjs.io';

// Pairs to validate: [foregroundVar, backgroundVar, isLargeText]
const PAIRS: Array<{ fg: string; bg: string; large?: boolean; label?: string }> = [
  { fg: '--foreground', bg: '--background' },
  { fg: '--muted-foreground', bg: '--muted' },
  { fg: '--primary-foreground', bg: '--primary' },
  { fg: '--destructive-foreground', bg: '--destructive' },
  { fg: '--accent-foreground', bg: '--accent' },
  { fg: '--ring-focus', bg: '--background', large: true, label: 'focus ring' },
];

// Minimum contrast thresholds
const NORMAL_MIN = 4.5;
const LARGE_MIN = 3.0;

function readGlobalsCss(): string {
  const cssPath = path.join(process.cwd(), 'app', 'globals.css');
  return fs.readFileSync(cssPath, 'utf8');
}

function extractVariables(css: string, selector: string): Record<string, string> {
  const pattern = new RegExp(`${selector}\\s*{([\\s\\S]*?)}`,'m');
  const block = css.match(pattern)?.[1] || '';
  const varRegex = /--([a-zA-Z0-9-]+):\s*([^;]+);/g;
  const vars: Record<string,string> = {};
  let m: RegExpExecArray | null;
  while ((m = varRegex.exec(block))) {
    vars[`--${m[1]}`] = m[2].trim();
  }
  return vars;
}

function toSRGB(colorValue: string): Color | null {
  try {
    // colorjs.io can parse oklch(), color-mix() etc.
    return new Color(colorValue).to('srgb');
  } catch {
    return null;
  }
}

function contrast(c1: Color, c2: Color): number {
  return c1.contrast(c2, 'WCAG21');
}

interface Result { pair: string; ratio: number; pass: boolean; threshold: number; context: string; }

function evaluate(vars: Record<string,string>, pair: {fg:string; bg:string; large?:boolean; label?:string}, context: string): Result {
  const fgVal = vars[pair.fg];
  const bgVal = vars[pair.bg];
  const fg = fgVal ? toSRGB(fgVal) : null;
  const bg = bgVal ? toSRGB(bgVal) : null;
  const ratio = fg && bg ? contrast(fg, bg) : 0;
  const threshold = pair.large ? LARGE_MIN : NORMAL_MIN;
  return {
    pair: `${pair.fg} on ${pair.bg}` + (pair.label ? ` (${pair.label})` : ''),
    ratio,
    pass: ratio >= threshold,
    threshold,
    context,
  };
}

function run() {
  const css = readGlobalsCss();
  const lightVars = extractVariables(css, ':root');
  const darkVars = extractVariables(css, '.dark');

  const all: Result[] = [];
  for (const p of PAIRS) {
    all.push(evaluate(lightVars, p, 'light'));
    all.push(evaluate(darkVars, p, 'dark'));
  }

  const failures = all.filter(r => !r.pass);

  const format = (r: Result) => `${r.pass ? 'PASS' : 'FAIL'} ${r.context.padEnd(5)} ${r.pair.padEnd(45)} ratio=${r.ratio.toFixed(2)} (min ${r.threshold})`;

  console.log('\nContrast Report (Issue 005)');
  console.log('---------------------------------------------');
  for (const r of all) console.log(format(r));

  if (failures.length) {
    console.error(`\n${failures.length} contrast pair(s) failed.`);
    process.exit(1);
  } else {
    console.log('\nAll contrast checks passed.');
  }
}

run();
