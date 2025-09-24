// Scans for duplicate slug.current values within the same `language`
// across i18n-enabled types. Useful before enabling translations widely.
// Run with: pnpm -C studio migrate:check-slugs

import { getCliClient } from "sanity/cli";

const TYPES = [
  "page",
  "post",
  "product",
  "productCategory",
  "category",
];

async function main() {
  const client = getCliClient({ apiVersion: process.env.SANITY_STUDIO_API_VERSION || "2024-10-31" });

  const docs = await client.fetch(
    `*[_type in $types && defined(slug.current) && defined(language)]{
      _id,
      _type,
      "slug": slug.current,
      language
    }`,
    { types: TYPES }
  );

  const byKey = new Map();
  for (const d of docs) {
    const key = `${d._type}:${d.language}:${d.slug}`;
    const arr = byKey.get(key) || [];
    arr.push(d._id);
    byKey.set(key, arr);
  }

  const collisions = Array.from(byKey.entries())
    .filter(([, ids]) => ids.length > 1)
    .map(([k, ids]) => ({ key: k, ids }));

  if (collisions.length === 0) {
    console.log("No per-locale slug collisions found. ✅");
    return;
  }

  console.log("Found per-locale slug collisions:\n");
  for (const c of collisions) {
    console.log(c.key, "=>", c.ids.join(", "));
  }

  process.exitCode = 1; // signal attention needed
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
