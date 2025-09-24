/*
  Backfill the document-internationalization language field for existing docs.
  Usage:
    pnpm -C studio exec tsx scripts/set-i18n-locale.ts -- --dataset <dataset> --project <projectId> --lang en
*/

import "dotenv/config";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { createClient } from "@sanity/client";

const argv = await yargs(hideBin(process.argv))
  .option("project", {
    type: "string",
    default: process.env.SANITY_STUDIO_PROJECT_ID,
    demandOption: true,
  })
  .option("dataset", {
    type: "string",
    default: process.env.SANITY_STUDIO_DATASET,
    demandOption: true,
  })
  .option("token", { type: "string", default: process.env.SANITY_WRITE_TOKEN })
  .option("lang", {
    type: "string",
    default: "en",
    describe: "Language to set when missing",
  })
  .parseAsync();

const client = createClient({
  projectId: argv.project as string,
  dataset: argv.dataset as string,
  token: argv.token as string | undefined,
  apiVersion: process.env.SANITY_STUDIO_API_VERSION || "2024-10-31",
  useCdn: false,
});

const TYPES = ["page", "post", "product", "productCategory", "category"];

const main = async () => {
  const lang = (argv.lang as string).toLowerCase();
  const tx = client.transaction();

  const docs = (await client.fetch(
    `array::compact([
      ${TYPES.map(
        (t) => `...*[_type == "${t}" && !defined(language)]._id`
      ).join(",")}
    ])`
  )) as string[];

  if (!docs.length) {
    console.log("No documents missing language field. Done.");
    return;
  }

  console.log(`Updating ${docs.length} docs to language="${lang}"...`);
  docs.forEach((id) => {
    tx.patch(id, (p) => p.set({ language: lang }));
  });

  await tx.commit();
  console.log("Language backfill complete.");
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
