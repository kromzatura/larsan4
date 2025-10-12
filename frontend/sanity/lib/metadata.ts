import { urlFor } from "@/sanity/lib/image";
import { getOgImageUrl } from "@/sanity/lib/fetch";
import type { Metadata } from "next";
import { buildCanonicalUrl } from "@/lib/url";
import {
  SUPPORTED_LOCALES,
  SupportedLocale,
  FORMAT_LOCALE_MAP,
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

export function generatePageMetadata({
  page,
  slug,
  type,
  locale,
}: {
  page:
    | PAGE_QUERYResult
    | POST_QUERYResult
    | CONTACT_QUERYResult
    | PRODUCT_QUERYResult
    | ProductCategory;
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

  const languageAlternates = SUPPORTED_LOCALES.reduce((acc, lang) => {
    acc[lang] = buildCanonicalUrl(lang, canonicalPath);
    return acc;
  }, {} as Record<SupportedLocale, string>);

  return {
    title: meta?.title ?? undefined,
    description: meta?.description ?? undefined,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      title: meta?.title ?? undefined,
      description: meta?.description ?? undefined,
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
      type: "website",
    },
    robots: robotsValue,
  };
}
