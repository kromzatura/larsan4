// Centralized route resolution for Sanity document + object like items
// Extend this map cautiously; keep stable public URLs.
import { DOC_TYPES, CATEGORY_DOC_TYPES } from "./docTypes";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";
import { buildLocalizedPath } from "@/lib/i18n/routing";

function withLocale(path: string | null, locale: SupportedLocale): string | null {
  if (!path) return null;
  return buildLocalizedPath(locale, path);
}

export function resolveHref(
  docType: string | undefined,
  slug: string | undefined,
  locale: SupportedLocale = FALLBACK_LOCALE
): string | null {
  if (!docType) return null;
  // Normalize slug value (some documents may store slug object, caller should pass slug.current)
  const s = slug?.replace(/^\//, "");
  switch (docType) {
    case DOC_TYPES.PAGE:
      // Home page (root) sometimes represented by slug 'index' or empty
      if (!s || s === "index" || s === "home") return withLocale("/", locale);
      return withLocale(`/${s}`, locale);
    case DOC_TYPES.POST:
      if (!s) return null;
      return withLocale(`/blog/${s}`, locale);
    case DOC_TYPES.PRODUCT:
      if (!s) return null;
      return withLocale(`/products/${s}`, locale);
    case DOC_TYPES.PRODUCT_CATEGORY:
      if (!s) return null;
      return withLocale(`/products/category/${s}`, locale);
    case DOC_TYPES.CONTACT:
      return withLocale("/contact", locale);
    default:
      if (CATEGORY_DOC_TYPES.includes(docType as (typeof CATEGORY_DOC_TYPES)[number])) {
        if (!s) return null;
        return withLocale(`/blog/category/${s}`, locale);
      }
      return null;
}
}

// Narrow helper for items already containing `_type` + `slug` shape
type DocWithSlug = {
  _type?: string;
  slug?: { current?: string } | string;
} | null | undefined;

export function resolveDocHref(
  doc: DocWithSlug,
  locale: SupportedLocale = FALLBACK_LOCALE
): string | null {
  if (!doc) return null;
  const { _type } = doc;
  let slugValue: string | undefined;
  const slugField = doc.slug;
  if (typeof slugField === "string") slugValue = slugField;
  else if (slugField && typeof slugField.current === "string") slugValue = slugField.current;
  return resolveHref(_type, slugValue, locale);
}

type LinkLike = {
  isExternal?: boolean | null;
  href?: string | null;
  internalType?: string | null;
  internalSlug?: string | null;
};

export function resolveLinkHref(
  link: LinkLike | null | undefined,
  locale: SupportedLocale = FALLBACK_LOCALE
): string | null {
  if (!link) return null;
  if (link.isExternal) {
    return link.href ?? null;
  }
  if (link.internalType) {
    const computed = resolveHref(link.internalType, link.internalSlug ?? undefined, locale);
    if (computed) return computed;
  }
  return link.href ?? null;
}
