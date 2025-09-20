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
      if (CATEGORY_DOC_TYPES.includes(docType as any)) {
        if (!s) return null;
        return `/blog/category/${s}`;
      }
      return null;
}
}

// Narrow helper for items already containing `_type` + `slug` shape
export function resolveDocHref(doc: { _type?: string; slug?: { current?: string } | string } | null | undefined): string | null {
  if (!doc) return null;
  const { _type } = doc as { _type?: string };
  let slugValue: string | undefined;
  const slugField = (doc as any).slug;
  if (typeof slugField === "string") slugValue = slugField;
  else if (slugField && typeof slugField.current === "string") slugValue = slugField.current;
  return resolveHref(_type, slugValue);
}
