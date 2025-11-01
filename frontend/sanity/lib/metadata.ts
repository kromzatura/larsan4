import { urlFor } from "@/sanity/lib/image";
import { getOgImageUrl } from "@/sanity/lib/fetch";
import type { Metadata } from "next";
import { buildCanonicalUrl } from "@/lib/url";
import { toText } from "@/lib/utils";
import {
  SUPPORTED_LOCALES,
  SupportedLocale,
  FORMAT_LOCALE_MAP,
  DEFAULT_LOCALE,
} from "@/lib/i18n/config";
import type {
  PAGE_QUERYResult,
  POST_QUERYResult,
  CONTACT_QUERYResult,
  PRODUCT_QUERYResult,
  ProductCategory,
} from "@/sanity.types";
import { resolveHref } from "@/lib/resolveHref";
import { DOC_TYPES } from "@/lib/docTypes";

const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

type SanityImageAsset = NonNullable<
  NonNullable<PAGE_QUERYResult>["meta"]
> extends { image: infer I }
  ? I extends { asset: infer A }
    ? A
    : never
  : never;

// --- NEW TYPE HELPERS ---
type Translation = {
  lang: string;
  slug: string;
};
type TranslationRaw = {
  lang: string;
  slug: string | null;
};

type WithMetaAndTranslations = {
  meta?: {
    title?: unknown;
    description?: unknown;
    noindex?: boolean | null;
    image?: unknown;
  } | null;
  allTranslations?: TranslationRaw[] | null;
};

// Accept any document shape that includes meta and translations. The caller
// provides the specific content type via the `type` argument.
type PageWithTranslations = WithMetaAndTranslations;
// --- END ---

// Map metadata types to document types for routing consistency
const typeToDocType: Record<string, string> = {
  post: DOC_TYPES.POST,
  product: DOC_TYPES.PRODUCT,
  productCategory: DOC_TYPES.PRODUCT_CATEGORY,
  page: DOC_TYPES.PAGE,
  blogCategory: DOC_TYPES.BLOG_CATEGORY,
};

export function generatePageMetadata({
  page,
  slug,
  type,
  locale,
}: {
  page: PageWithTranslations | null;
  slug: string;
  type: "post" | "page" | "product" | "productCategory" | "blogCategory";
  locale: SupportedLocale;
}): Metadata {
  const meta = page?.meta;
  // Type guard and helper types for Sanity image handling
  type SanityImageLike = { asset: SanityImageAsset } & Record<string, unknown>;
  const hasAsset = (v: unknown): v is SanityImageLike =>
    !!v && typeof v === "object" && "asset" in v;

  const imgAsset = hasAsset(meta?.image) ? meta!.image.asset : undefined;

  const robotsValue = (() => {
    if (!isProduction) return { index: false, follow: false } as const;
    if (meta?.noindex) return { index: false, follow: true } as const;
    return { index: true, follow: true } as const;
  })();

  const canonicalPath = slug === "index" ? "/" : `/${slug}`;
  const canonicalUrl = buildCanonicalUrl(locale, canonicalPath);

  // Build alternates from actual translations to avoid slug mismatches
  const allTranslations = (page?.allTranslations ?? []).filter(
    (t): t is Translation => !!t?.lang && !!t?.slug
  );
  const languageAlternates: Record<string, string> = {};
  const ogAlternateLocales: string[] = [];

  // Use resolveHref to build correct paths for each content type
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const docType = typeToDocType[type] || DOC_TYPES.PAGE;

  // Set x-default
  // Policy:
  // - For homepage (slug === "index"), point x-default to the bare site root (no locale segment)
  //   to avoid duplicate hrefs (e.g., en and x-default both being /en) and follow common auditor guidance.
  // - For other pages, point x-default to the default-locale version of the same path when available.
  if (slug === "index") {
    languageAlternates["x-default"] = `${baseUrl}/`;
  } else {
    const defaultTranslation = allTranslations.find(
      (t) => t.lang === DEFAULT_LOCALE
    );
    if (defaultTranslation) {
      const href = resolveHref(
        docType,
        defaultTranslation.slug,
        DEFAULT_LOCALE
      );
      if (href) {
        languageAlternates["x-default"] = `${baseUrl}${href}`;
      }
    }
  }

  // Add all available language alternates using resolveHref for consistency
  for (const t of allTranslations) {
    const href = resolveHref(docType, t.slug, t.lang as SupportedLocale);
    if (href) {
      languageAlternates[t.lang] = `${baseUrl}${href}`;
    }

    // Build OpenGraph alternate locales
    if (t.lang !== locale) {
      const og = FORMAT_LOCALE_MAP[t.lang as SupportedLocale];
      if (og) ogAlternateLocales.push(og);
    }
  }

  // Ensure a self hreflang is always present for the current locale
  if (!languageAlternates[locale]) {
    languageAlternates[locale] = canonicalUrl;
  }

  // Ensure x-default is present; if we couldn't resolve a default locale translation,
  // fall back to the DEFAULT_LOCALE version of the same path. This yields a stable
  // default experience and avoids missing x-default entirely.
  if (!languageAlternates["x-default"]) {
    languageAlternates["x-default"] =
      slug === "index"
        ? `${baseUrl}/`
        : buildCanonicalUrl(DEFAULT_LOCALE as SupportedLocale, canonicalPath);
  }

  // Optional debug output to investigate hreflang conflicts in production scans
  // Enable by setting LOG_HREFLANG=1 or NEXT_PUBLIC_LOG_HREFLANG=1
  try {
    const shouldLog =
      process.env.LOG_HREFLANG === "1" ||
      process.env.NEXT_PUBLIC_LOG_HREFLANG === "1";
    if (shouldLog) {
      // Detect duplicate hrefs mapped to different hreflang codes (often flagged by auditors)
      const hrefToLangs = new Map<string, string[]>();
      for (const [code, href] of Object.entries(languageAlternates)) {
        const key = href.split("#")[0];
        hrefToLangs.set(key, [...(hrefToLangs.get(key) || []), code]);
      }
      const duplicates: Array<{ href: string; langs: string[] }> = [];
      for (const [href, codes] of hrefToLangs.entries()) {
        if (codes.length > 1) duplicates.push({ href, langs: codes });
      }
      // eslint-disable-next-line no-console
      console.info(
        JSON.stringify(
          {
            tag: "hreflang",
            type,
            locale,
            slug,
            canonicalUrl,
            languages: languageAlternates,
            duplicateHrefGroups: duplicates,
          },
          null,
          2
        )
      );
    }
  } catch {}

  // Titles are authored without brand suffix; layout template adds the brand.
  // Provide resilient fallbacks so <title> is never missing in crawls.
  const pageTitleField = (page as any)?.title as unknown | undefined;
  const coerceString = (v: unknown): string | undefined => {
    const t = toText(v as any);
    return t && typeof t === "string" && t.trim() ? t.trim() : undefined;
  };
  const humanizeSlug = (s: string): string =>
    s
      .replace(/^\/+|\/+$/g, "")
      .split("/")
      .pop()!
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase());

  let rawTitle = coerceString(meta?.title);
  if (!rawTitle) rawTitle = coerceString(pageTitleField);
  if (!rawTitle) {
    // Sensible defaults per type/slug to avoid empty titles
    if (type === "productCategory") {
      rawTitle = `Category: ${humanizeSlug(slug)}`;
    } else if (type === "product") {
      rawTitle = humanizeSlug(slug);
    } else if (type === "post" || type === "blogCategory") {
      rawTitle = humanizeSlug(slug);
    } else if (slug === "products") {
      rawTitle = "Products";
    } else if (slug === "index" || slug === "") {
      // Let layout default apply on home if nothing authored
      rawTitle = undefined as unknown as string | undefined;
    } else {
      rawTitle = humanizeSlug(slug);
    }
  }
  const title: Metadata["title"] = rawTitle;

  const descriptionText =
    toText(meta?.description as unknown) ??
    (type === "product" || type === "post"
      ? toText((page as any)?.excerpt as unknown)
      : undefined);

  return {
    title,
    description: descriptionText ?? undefined,
    alternates: {
      canonical: canonicalUrl,
      languages: Object.keys(languageAlternates).length
        ? languageAlternates
        : undefined,
    },
    openGraph: {
      title: rawTitle ?? undefined,
      description: descriptionText ?? undefined,
      url: canonicalUrl,
      images: [
        {
          url:
            meta?.image && hasAsset(meta.image)
              ? urlFor(meta.image as SanityImageLike)
                  .quality(100)
                  .url()
              : getOgImageUrl({
                  type: (type === "blogCategory" ? "page" : type) as
                    | "post"
                    | "page"
                    | "product"
                    | "productCategory",
                  slug,
                }),
          width: imgAsset?.metadata?.dimensions?.width ?? 1200,
          height: imgAsset?.metadata?.dimensions?.height ?? 630,
        },
      ],
      locale: FORMAT_LOCALE_MAP[locale],
      // Add alternate locales if available
      alternateLocale: ogAlternateLocales.length
        ? ogAlternateLocales
        : undefined,
      type: "website",
    },
    robots: robotsValue,
    twitter: {
      card: "summary_large_image",
    },
  };
}
