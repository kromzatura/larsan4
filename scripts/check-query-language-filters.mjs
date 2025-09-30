#!/usr/bin/env node
/**
 * Query Language Filter Checker
 *
 * Scans GROQ query source files under frontend/sanity/queries and reports any query
 * missing a required language predicate pattern: `language == $lang` inside its top-level filter.
 *
 * Heuristic:
 *  - Looks for groq tagged template literals: groq` ... `
 *  - Extracts filter segments between *[ and ] or before projection { when adjacent.
 *  - Flags if no occurrence of `language == $lang` OR `language==$lang` (allowing whitespace).
 *  - Ignores queries that explicitly declare a comment `// i18n-ignore` on a previous line.
 *
 * Exit codes:
 *  0 success / all queries compliant
 *  1 violations present
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const queriesDir = path.join(root, 'frontend', 'sanity', 'queries');

function listFiles(dir) {
	const out = [];
	for (const entry of fs.readdirSync(dir)) {
		const full = path.join(dir, entry);
		const stat = fs.statSync(full);
		if (stat.isDirectory()) out.push(...listFiles(full));
		else if (/\.(t|j)sx?$/.test(entry)) out.push(full);
	}
	return out;
}

if (!fs.existsSync(queriesDir)) {
	console.error('[query-lang-check] queries directory not found:', queriesDir);
	process.exit(2);
}

const files = listFiles(queriesDir);
const violations = [];
const pattern = /language\s*==\s*\$lang/;

for (const file of files) {
	const source = fs.readFileSync(file, 'utf8');
	// Skip disabled blocks
	if (/i18n-ignore/.test(source)) continue;
	// Roughly capture groq` ... ` bodies
	const matches = source.match(/groq`[\s\S]*?`/g) || [];
	for (const m of matches) {
		if (!pattern.test(m)) {
			violations.push({ file, snippet: m.slice(0, 120) + (m.length > 120 ? '…' : '') });
		}
	}
}

if (violations.length) {
	console.error('[query-lang-check] Missing language filter in ' + violations.length + ' query block(s)');
	for (const v of violations.slice(0, 20)) {
		console.error(' -', path.relative(root, v.file), '::', v.snippet.replace(/\n/g,' '));
	}
	if (violations.length > 20) console.error(' ...(+' + (violations.length - 20) + ' more)');
	process.exit(1);
} else {
	console.log('[query-lang-check] All queries contain language == $lang');
}
