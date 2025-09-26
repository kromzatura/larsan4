#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2] || "studio/schemas";

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (p.endsWith(".ts") || p.endsWith(".tsx")) files.push(p);
  }
  return files;
}

const files = walk(root).sort();
const hash = createHash("sha256");
for (const f of files) {
  hash.update(f + "\n");
  hash.update(readFileSync(f));
}
const digest = hash.digest("hex");

const result = {
  directory: root,
  fileCount: files.length,
  hash: digest,
  generatedAt: new Date().toISOString(),
};
console.log(JSON.stringify(result, null, 2));
