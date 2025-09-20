// Centralized route resolution for Sanity document + object like items
// Extend this map cautiously; keep stable public URLs.

export function resolveHref(docType: string | undefined, slug: string | undefined): string | null {
  if (!docType) return null;
  // Normalize slug value (some documents may store slug object, caller should pass slug.current)
  const s = slug?.replace(/^\//, "");
  switch (docType) {
    case "page":
      // Home page (root) sometimes represented by slug 'index' or empty
      if (!s || s === "index" || s === "home") return "/";
      return `/${s}`;
    case "post":
      if (!s) return null;
      return `/blog/${s}`;
    case "blogCategory":
    case "postCategory": // legacy alias if exists
    case "category": // legacy generic category
      if (!s) return null;
      return `/blog/category/${s}`;
    case "product":
      if (!s) return null;
      return `/products/${s}`;
    case "productCategory":
      if (!s) return null;
      return `/products/category/${s}`;
    default:
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
