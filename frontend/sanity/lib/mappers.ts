import { buildLocalizedPath } from "@/lib/i18n/routing";
import type { SupportedLocale } from "@/lib/i18n/config";
import { urlFor } from "@/sanity/lib/image";

// Minimal product list item shape compatible with PRODUCTS_QUERYResult and by-category variants
type ProductListItem = {
  _id?: string | null;
  title?: string | null;
  slug?: { current?: string | null } | null;
  // Older content or schema experiments may have stored keyFeatures as objects.
  // Keep this broad here and normalize below so UI always receives string[]
  keyFeatures?: Array<unknown> | null;
  specifications?: Array<{
    _id?: string | null;
    sku?: string | null;
    purity?: string | number | null;
    productAttributes?: string | null;
  }> | null;
  image?: {
    asset?: {
      _id?: string | null;
      metadata?: {
        lqip?: string | null;
        dimensions?: { width?: number | null; height?: number | null } | null;
      } | null;
    } | null;
  } | null;
  categories?: Array<{
    _id?: string | null;
    title?: string | null;
    slug?: { current?: string | null } | null;
  }> | null;
};

// Returns an object structurally compatible with ProductsTableItem without importing from components
export function mapProductToProductsTableItem(
  p: ProductListItem,
  locale: SupportedLocale
) {
  const spec = Array.isArray(p.specifications)
    ? p.specifications[0]
    : undefined;

  const imageUrl = p.image?.asset?._id
    ? urlFor(p.image as any)
        .width(320)
        .height(213)
        .fit("crop")
        .url()
    : undefined;

  return {
    _id: p._id || "",
    slug: p.slug?.current || "",
    title: p.title || null,
    sku: spec?.sku || null,
    imageUrl,
    imageMeta: p.image?.asset?.metadata || null,
    features: Array.isArray(p.keyFeatures)
      ? p.keyFeatures
          .map((it: any) =>
            typeof it === "string"
              ? it
              : typeof it?.featureText === "string"
              ? it.featureText
              : typeof it?.text === "string"
              ? it.text
              : typeof it?.title === "string"
              ? it.title
              : ""
          )
          .filter(
            (s: unknown): s is string =>
              typeof s === "string" && s.trim().length > 0
          )
          .slice(0, 3)
      : null,
    productAttributes: spec?.productAttributes || null,
    purity: spec?.purity ?? null,
    categories: Array.isArray(p.categories)
      ? p.categories.map((c) => ({
          _id: c?._id || undefined,
          title: c?.title || null,
          slug: c?.slug?.current || null,
          href: buildLocalizedPath(
            locale,
            `/products/category/${c?.slug?.current || ""}`
          ),
        }))
      : null,
    href: buildLocalizedPath(locale, `/products/${p.slug?.current || ""}`),
  };
}
