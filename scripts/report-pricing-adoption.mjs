#!/usr/bin/env node
/**
 * Pricing Adoption Metrics Script (Gate 4)
 *
 * Purpose:
 *   Reports adoption of structured pricing on product documents.
 *   Structured pricing is assumed present if ANY of these conditions hold:
 *     - product.pricingTiers array has length > 0
 *     - product has monthlyPrice OR yearlyPrice (legacy fields) -> counted as LEGACY
 *
 * Output JSON schema:
 * {
 *   version: 1,
 *   totalProducts: number,
 *   structuredCount: number,
 *   legacyOnlyCount: number,
 *   noPricingCount: number,
 *   structuredPercent: number,    // (structuredCount / totalProducts)*100
 *   legacyOnlyPercent: number,
 *   noPricingPercent: number,
 *   mixedCount: number,           // (both legacy + structured present)
 *   mixedPercent: number,
 *   threshold: number|null,       // from --min if provided
 *   pass: boolean|null
 * }
 *
 * Flags:
 *   --project <id> (optional if env var present)
 *   --dataset <dataset> (default production)
 *   --token <token> (optional for read if public dataset; else required)
 *   --min <percent>  (fail with exit code 1 if structuredPercent < min)
 *   --json           (print JSON only, no human summary)
 *   --details        (include arrays of product ids by category)
 *
 * Environment fallbacks:
 *   SANITY_STUDIO_PROJECT_ID / NEXT_PUBLIC_SANITY_PROJECT_ID
 *   SANITY_STUDIO_DATASET / NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_READ_TOKEN / SANITY_WRITE_TOKEN (for private datasets)
 */

import { createClient } from "@sanity/client";
import { classifyProductRecord, accumulateClassification, adoptionResult } from './lib/pricing-utils.mjs';

const args = process.argv.slice(2);
const getArgVal = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : undefined;
};

const projectId =
  getArgVal("--project") ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  getArgVal("--dataset") ||
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";
const token =
  getArgVal("--token") ||
  process.env.SANITY_API_READ_TOKEN ||
  process.env.SANITY_WRITE_TOKEN;
const minRaw = getArgVal("--min");
const wantJson = args.includes("--json");
const wantDetails = args.includes("--details");

if (!projectId) {
  console.error(
    "[pricing-adoption] Missing projectId. Use --project or set SANITY_STUDIO_PROJECT_ID"
  );
  process.exit(2);
}

// Basic client (token optional if dataset is public)
const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-31",
  token,
  useCdn: false,
});

let minThreshold = null;
if (minRaw !== undefined) {
  if (isNaN(Number(minRaw))) {
    console.error("[pricing-adoption] --min must be numeric");
    process.exit(2);
  }
  minThreshold = Number(minRaw);
}

// Fetch only required fields to reduce payload.
// Support both legacy root-level pricingTiers and normalized pricing container so classification can see either.
const query = `*[_type == "product"]{ _id, pricingTiers[]{ _key }, pricing{ tiers[]{ _key } }, monthlyPrice, yearlyPrice }`;

const run = async () => {
  const products = await client.fetch(query);
  const { ids, counts, total, percentages } = accumulateClassification(products, classifyProductRecord);
  const result = adoptionResult({
    total,
    counts,
    percentages,
    minThreshold,
    ids: wantDetails ? ids : undefined,
  });

  if (wantJson) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(
      "[pricing-adoption] project=" + projectId + " dataset=" + dataset
    );
    console.log("[pricing-adoption] total=" + result.totalProducts);
    console.log("[pricing-adoption] structured=" + result.structuredCount + ` (${result.structuredPercent}%)`);
    console.log("[pricing-adoption] legacyOnly=" + result.legacyOnlyCount + ` (${result.legacyOnlyPercent}%)`);
    console.log("[pricing-adoption] mixed=" + result.mixedCount + ` (${result.mixedPercent}%)`);
    console.log("[pricing-adoption] none=" + result.noPricingCount + ` (${result.noPricingPercent}%)`);
    if (minThreshold != null) {
      console.log(
        "[pricing-adoption] threshold=" +
          minThreshold +
          " pass=" +
          (result.pass ? "yes" : "no")
      );
    }
  }

  if (minThreshold != null && !result.pass) {
    process.exit(1);
  }
};

run().catch((e) => {
  console.error("[pricing-adoption] error", e);
  process.exit(1);
});
