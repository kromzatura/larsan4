// Centralized route resolution for Sanity document + object like items
// Extend this map cautiously; keep stable public URLs.
import { DOC_TYPES, CATEGORY_DOC_TYPES } from "./docTypes";

export function resolveHref(docType: string | undefined, slug: string | undefined): string | null {
  if (!docType) return null;
  // Normalize slug value (some documents may store slug object, caller should pass slug.current)
  const s = slug?.replace(/^\//, "");
  switch (docType) {
    case DOC_TYPES.PAGE:
      // Home page (root) sometimes represented by slug 'index' or empty
      if (!s || s === "index" || s === "home") return "/";
      return `/${s}`;
    case DOC_TYPES.POST:
      if (!s) return null;
      return `/blog/${s}`;
    case DOC_TYPES.PRODUCT:
      if (!s) return null;
      return `/products/${s}`;
    case DOC_TYPES.PRODUCT_CATEGORY:
      if (!s) return null;
      return `/products/category/${s}`;
    case DOC_TYPES.CONTACT:
      return "/contact";
    default:
      if (CATEGORY_DOC_TYPES.includes(docType as (typeof CATEGORY_DOC_TYPES)[number])) {
        if (!s) return null;
        return `/blog/category/${s}`;
      }
      return null;
}
}

// Narrow helper for items already containing `_type` + `slug` shape
type DocWithSlug = {
  _type?: string;
  slug?: { current?: string } | string;
} | null | undefined;

export function resolveDocHref(doc: DocWithSlug): string | null {
  if (!doc) return null;
  const { _type } = doc;
  let slugValue: string | undefined;
  const slugField = doc.slug;
  if (typeof slugField === "string") slugValue = slugField;
  else if (slugField && typeof slugField.current === "string") slugValue = slugField.current;
  return resolveHref(_type, slugValue);
}

type LinkLike = {
  isExternal?: boolean | null;
  href?: string | null;
  internalType?: string | null;
  internalSlug?: string | null;
};

export function resolveLinkHref(link: LinkLike | null | undefined): string | null {
  if (!link) return null;
  if (link.isExternal) {
    return link.href ?? null;
  }
  if (link.internalType) {
    const computed = resolveHref(link.internalType, link.internalSlug ?? undefined);
    if (computed) return computed;
  }
  return link.href ?? null;
}
