#!/usr/bin/env node
/**
 * Duplicate route health check for Next.js App Router
 * - Scans frontend/app directory for routes
 * - Normalizes route paths by removing route groups (e.g., (main))
 * - Flags duplicates that resolve to the same URL path
 */

import fs from "node:fs";
import path from "node:path";

const APP_DIR = path.resolve(process.cwd(), "app");

/** Normalize a file path within app/ into a route path */
function normalizeRoute(filePath) {
  // Split into segments and drop route-groups like (main)
  const rel = path.relative(APP_DIR, filePath);
  const segments = rel.split(path.sep).filter(Boolean);
  const cleaned = segments
    .filter((seg) => !(seg.startsWith("(") && seg.endsWith(")")))
    .filter(
      (seg) =>
        seg !== "route.ts" &&
        seg !== "page.tsx" &&
        seg !== "page.ts" &&
        seg !== "route.js" &&
        seg !== "page.js"
    );

  // Map segments: [lang] stays as [lang]; files in folders like feed.json/route.ts should produce '/[lang]/blog/feed.json'
  const route = "/" + cleaned.join("/");
  // Ensure leading slash and collapse double slashes
  return route.replace(/\/+/, "/");
}

function* walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile()) {
      // Consider route files
      if (/^(page|route)\.(tsx|ts|js|mjs)$/.test(entry.name)) {
        yield full;
      }
    }
  }
}

function main() {
  if (!fs.existsSync(APP_DIR)) {
    console.error(`No app directory at ${APP_DIR}`);
    process.exit(0);
  }

  const seen = new Map();
  const duplicates = [];

  for (const file of walk(APP_DIR)) {
    const route = normalizeRoute(file);
    const existing = seen.get(route);
    if (existing) {
      duplicates.push({ route, files: [existing, file] });
    } else {
      seen.set(route, file);
    }
  }

  if (duplicates.length > 0) {
    console.error(
      `Duplicate routes detected (normalized by removing route-groups):`
    );
    for (const d of duplicates) {
      console.error(
        `  ${d.route}\n    - ${path.relative(
          APP_DIR,
          d.files[0]
        )}\n    - ${path.relative(APP_DIR, d.files[1])}`
      );
    }
    process.exit(1);
  }

  console.log("No duplicate routes detected.");
}

main();
