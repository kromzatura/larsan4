import { urlFor } from "@/sanity/lib/image";
import {
  PAGE_QUERYResult,
  POST_QUERYResult,
  CONTACT_QUERYResult,
  PRODUCT_QUERYResult,
  ProductCategory,
} from "@/sanity.types";
import { getOgImageUrl } from "@/sanity/lib/fetch";
import { buildAlternatesLanguages } from "@/lib/alternates";

type SanityImageAsset = {
  _id?: string;
  url?: string;
  metadata?: {
    dimensions?: { width?: number; height?: number } | null;
  } | null;
};
const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

export function generatePageMetadata({
  page,
  slug,
  type,
  lang,
}: {
  page:
    | PAGE_QUERYResult
    | POST_QUERYResult
    | CONTACT_QUERYResult
    | PRODUCT_QUERYResult
    | ProductCategory;
  slug: string;
  type: "post" | "page" | "product" | "productCategory";
  lang?: "en" | "nl" | (string & {});
}) {
  const imgAsset = page?.meta?.image?.asset as SanityImageAsset | undefined;
  const ogLocale = lang === "nl" ? "nl_NL" : "en_US";
  const pathFor = (l: string) => {
    const s = slug === "index" ? "" : `/${slug}`;
    return `/${l}${s}`;
  };
  const pageI18n = (page as any)?.i18n as Array<{ language?: string; slug?: string }> | undefined;
  const i18nLanguages = buildAlternatesLanguages(slug, pageI18n);
  return {
    title: page?.meta?.title,
    description: page?.meta?.description,
    openGraph: {
      images: [
        {
          url: page?.meta?.image
            ? urlFor(page?.meta?.image).quality(100).url()
            : getOgImageUrl({ type, slug }),
          width: imgAsset?.metadata?.dimensions?.width || 1200,
          height: imgAsset?.metadata?.dimensions?.height || 630,
        },
      ],
      locale: ogLocale,
      type: "website",
    },
    robots: !isProduction
      ? "noindex, nofollow"
      : page?.meta?.noindex
      ? "noindex"
      : "index, follow",
    alternates: lang
      ? {
          canonical: pathFor(lang),
          languages: i18nLanguages,
        }
      : {
          canonical: `/${slug === "index" ? "" : slug}`,
        },
  };
}
