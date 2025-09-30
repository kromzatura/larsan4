/**
 * Shared Pricing Utility Functions
 *
 * Centralizes logic for classifying products and computing adoption stats.
 */

export function classifyProductRecord(p) {
  const hasStructured = !!(p.pricing && Array.isArray(p.pricing.tiers) && p.pricing.tiers.length > 0);
  // Legacy shape (older adoption script uses pricingTiers root array) OR legacy fields monthlyPrice/yearlyPrice
  const hasRootStructured = !!(Array.isArray(p.pricingTiers) && p.pricingTiers.length > 0);
  const hasLegacy = !!(p.monthlyPrice || p.yearlyPrice);
  const structured = hasStructured || hasRootStructured;
  if (structured && hasLegacy) return 'mixed';
  if (structured) return 'structured';
  if (hasLegacy) return 'legacyOnly';
  return 'none';
}

export function accumulateClassification(products, classifier = classifyProductRecord) {
  const ids = { structured: [], legacyOnly: [], mixed: [], none: [] };
  for (const p of products) {
    const c = classifier(p);
    ids[c].push(p._id);
  }
  const counts = Object.fromEntries(Object.entries(ids).map(([k, arr]) => [k, arr.length]));
  const total = products.length || 0;
  const percentages = Object.fromEntries(
    Object.entries(counts).map(([k, v]) => [k, total ? +((v / total) * 100).toFixed(1) : 0])
  );
  return { ids, counts, total, percentages };
}

export function adoptionResult({ total, counts, percentages, minThreshold, ids }) {
  const structuredPercent = percentages.structured;
  return {
    version: 1,
    totalProducts: total,
    structuredCount: counts.structured,
    legacyOnlyCount: counts.legacyOnly,
    noPricingCount: counts.none,
    mixedCount: counts.mixed,
    structuredPercent,
    legacyOnlyPercent: percentages.legacyOnly,
    noPricingPercent: percentages.none,
    mixedPercent: percentages.mixed,
    threshold: minThreshold,
    pass: minThreshold == null ? null : structuredPercent >= minThreshold,
    ids,
  };
}
