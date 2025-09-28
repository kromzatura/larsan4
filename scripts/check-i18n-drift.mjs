#!/usr/bin/env node
/**
 * Compares the documentInternationalization plugin schemaTypes list
 * with the actual document types defined in studio/schema.ts (via import & introspection).
 * Outputs JSON summary and non-zero exit if drift detected (optional flag --strict).
 */
import path from 'node:path';
import fs from 'node:fs';

const projectRoot = process.cwd();
const studioDir = path.join(projectRoot, 'studio');
const sanityConfigPath = path.join(studioDir, 'sanity.config.ts');
const documentsDir = path.join(studioDir, 'schemas', 'documents');

if (!fs.existsSync(sanityConfigPath) || !fs.existsSync(documentsDir)) {
  console.error('[error] Cannot locate Studio config or documents directory. Run from repository root.');
  process.exit(1);
}

// Dynamic ESM import of schema & config. We only need the plugin options; instead of executing full config,
// we parse the file text to extract schemaTypes array from documentInternationalization call.
const configSource = fs.readFileSync(sanityConfigPath, 'utf8');

// Naive regex to capture schemaTypes array literal inside documentInternationalization({...})
const schemaTypesMatch = configSource.match(/documentInternationalization\(\{[\s\S]*?schemaTypes:\s*\[([\s\S]*?)\]/);
if (!schemaTypesMatch) {
  console.error('[error] Could not find schemaTypes array in sanity.config.ts');
  process.exit(1);
}

const rawList = schemaTypesMatch[1]
  .split(/[,\n]/)
  .map(l => l.trim().replace(/['"`]/g, ''))
  .filter(Boolean)
  .filter(v => !v.startsWith('//'));
const pluginTypes = Array.from(new Set(rawList));

// Derive document types from filenames in documents directory (basename without extension)
const documentTypes = fs.readdirSync(documentsDir)
  .filter(f => f.endsWith('.ts'))
  .map(f => f.replace(/\.ts$/, ''));

const missing = pluginTypes.filter(t => !documentTypes.includes(t));
const unmanaged = documentTypes.filter(dt => !pluginTypes.includes(dt));

const result = { pluginTypes, documentTypes, missing, unmanaged };
console.log(JSON.stringify(result, null, 2));

if ((missing.length || unmanaged.length) && process.argv.includes('--strict')) {
  process.exit(2);
}
