// Sets `language: "en"` on existing documents that are missing it
// Limited to the schema types configured for the i18n plugin.
// Run with: pnpm -C studio migrate:set-locale

import { getCliClient } from "sanity/cli";

const TYPES = [
  "page",
  "post",
  "product",
  "productCategory",
  "category",
];

const BATCH_SIZE = 100;

async function main() {
  const client = getCliClient({ apiVersion: process.env.SANITY_STUDIO_API_VERSION || "2024-10-31" });

  const docs = await client.fetch(
    `*[_type in $types && !defined(language)]{
      _id,
      _type
    }`,
    { types: TYPES }
  );

  if (!docs.length) {
    console.log("All set — no documents missing language.");
    return;
  }

  console.log(`Patching ${docs.length} documents to language: en`);

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const slice = docs.slice(i, i + BATCH_SIZE);
    const tx = client.transaction();
    slice.forEach((doc) => {
      tx.patch(doc._id, { set: { language: "en" } });
    });
    const res = await tx.commit({ visibility: "async" });
    console.log(`Committed ${slice.length} patches`, res.transactionId || "");
  }

  console.log("Done. You can now create translations from Studio.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
