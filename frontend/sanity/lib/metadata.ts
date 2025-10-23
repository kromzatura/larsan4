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

type WithMetaAndTranslations = {
  meta?: {
    title?: unknown;
    description?: unknown;
    noindex?: boolean | null;
    image?: unknown;
  } | null;
  allTranslations?: Translation[];
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
};

export function generatePageMetadata({
  page,
  slug,
  type,
  locale,
}: {
  page: PageWithTranslations | null;
  slug: string;
  type: "post" | "page" | "product" | "productCategory";
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

  // Set x-default when default locale translation exists
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

  return {
    title: toText(meta?.title as unknown) ?? undefined,
    description: toText(meta?.description as unknown) ?? undefined,
    alternates: {
      canonical: canonicalUrl,
      languages: Object.keys(languageAlternates).length
        ? languageAlternates
        : undefined,
    },
    openGraph: {
      title: toText(meta?.title as unknown) ?? undefined,
      description: toText(meta?.description as unknown) ?? undefined,
      url: canonicalUrl,
      images: [
        {
          url:
            meta?.image && hasAsset(meta.image)
              ? urlFor(meta.image as SanityImageLike).quality(100).url()
              : getOgImageUrl({ type, slug }),
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
  };
}
