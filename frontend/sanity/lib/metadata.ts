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

type PageWithTranslations = (
  | PAGE_QUERYResult
  | POST_QUERYResult
  | CONTACT_QUERYResult
  | PRODUCT_QUERYResult
  | ProductCategory
) & WithMetaAndTranslations;
// --- END ---

export function generatePageMetadata({
  page,
  slug,
  type,
  locale,
}: {
  page: PageWithTranslations;
  slug: string;
  type: "post" | "page" | "product" | "productCategory";
  locale: SupportedLocale;
}): Metadata {
  const meta = page?.meta;
  const imgAsset = meta?.image?.asset as SanityImageAsset | undefined;

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

  // Set x-default when default locale translation exists
  const defaultTranslation = allTranslations.find(
    (t) => t.lang === DEFAULT_LOCALE
  );
  if (defaultTranslation) {
    const defaultPath =
      defaultTranslation.slug === "index" ? "/" : `/${defaultTranslation.slug}`;
    languageAlternates["x-default"] = buildCanonicalUrl(
      DEFAULT_LOCALE,
      defaultPath
    );
  }

  // Add all available language alternates from data
  for (const t of allTranslations) {
    const path = t.slug === "index" ? "/" : `/${t.slug}`;
    languageAlternates[t.lang] = buildCanonicalUrl(
      t.lang as SupportedLocale,
      path
    );
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
          url: meta?.image
            ? urlFor(meta.image).quality(100).url()
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
