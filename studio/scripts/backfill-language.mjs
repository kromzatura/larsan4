#!/usr/bin/env node
// Backfill `language` field for translatable documents.
// Run with: pnpm backfill:language:dry  (dry-run)
//          pnpm backfill:language       (apply)
// Depends on @sanity/client from studio workspace.

// Try multiple dotenv variants (.env.local preferred for Next/Sanity setups)
let dotenvLoaded = false;
for (const mod of ["dotenv/config"]) {
  try {
    await import(mod);
    dotenvLoaded = true;
    break;
  } catch {}
}
// Manual fallback for .env.local if dotenv didn't auto-load (Node ESM dynamic import)
if (!dotenvLoaded) {
  import("fs").then((fs) => {
    try {
      if (fs.existsSync(".env.local")) {
        const content = fs.readFileSync(".env.local", "utf8");
        content.split(/\r?\n/).forEach((line) => {
          const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
          if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
        });
      }
    } catch {}
  });
}
import { createClient } from "@sanity/client";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";
const token =
  process.env.SANITY_WRITE_TOKEN ||
  process.env.SANITY_API_TOKEN ||
  process.env.SANITY_STUDIO_WRITE_TOKEN;

const dry = process.argv.includes("--dry");
const includeDrafts = process.argv.includes("--include-drafts");

if (!projectId) {
  console.error(
    "[backfill-language] Missing projectId (SANITY_STUDIO_PROJECT_ID or NEXT_PUBLIC_SANITY_PROJECT_ID)"
  );
  process.exit(1);
}
if (!token && !dry) {
  console.error(
    "[backfill-language] Missing write token (SANITY_WRITE_TOKEN / SANITY_API_TOKEN). For dry runs a token is not required."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-31",
  token,
  useCdn: false,
});

console.log(
  `[backfill-language] project=${projectId} dataset=${dataset} mode=${
    dry ? "dry" : "write"
  } drafts=${includeDrafts ? "included" : "skipped"}`
);

const TYPES = [
  "page",
  "post",
  "product",
  "productCategory",
  "category",
  "settings",
  "navigation",
  "faq",
  "specification",
  "banner",
  "contact",
  "author",
  "changelog",
  "team",
  "testimonial",
  "translationTest",
];

// dry already computed above

(async () => {
  const filter = includeDrafts
    ? "*[_type in $types && !defined(language)]{ _id, _type }"
    : '*[_type in $types && !defined(language) && !(_id in path("drafts.**"))]{ _id, _type }';
  const docs = await client.fetch(filter, { types: TYPES });
  if (!docs.length) {
    console.log("[backfill-language] No documents missing language field.");
    return;
  }
  console.log(
    `[backfill-language] Found ${docs.length} docs to backfill${
      includeDrafts ? "" : " (drafts excluded)"
    }`
  );

  let patched = 0;
  for (const d of docs) {
    const m = d._id.match(/\.([a-z]{2})(?:$|[\-])/i);
    const locale = m ? m[1] : "en";
    if (dry) {
      console.log("[dry-run] would patch", d._id, "->", locale);
      continue;
    }
    await client.patch(d._id).set({ language: locale }).commit();
    patched++;
    console.log("patched", d._id, "->", locale);
  }
  if (!dry)
    console.log(`[backfill-language] Completed. Patched ${patched} documents.`);
})();
