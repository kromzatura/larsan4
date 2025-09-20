import { urlFor } from "@/sanity/lib/image";
import {
  PAGE_QUERYResult,
  POST_QUERYResult,
  CONTACT_QUERYResult,
  PRODUCT_QUERYResult,
  ProductCategory,
} from "@/sanity.types";
import { getOgImageUrl } from "@/sanity/lib/fetch";

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
}: {
  page:
    | PAGE_QUERYResult
    | POST_QUERYResult
    | CONTACT_QUERYResult
    | PRODUCT_QUERYResult
    | ProductCategory;
  slug: string;
  type: "post" | "page" | "product" | "productCategory";
}) {
  const imgAsset = page?.meta?.image?.asset as SanityImageAsset | undefined;
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
      locale: "en_US",
      type: "website",
    },
    robots: !isProduction
      ? "noindex, nofollow"
      : page?.meta?.noindex
      ? "noindex"
      : "index, follow",
    alternates: {
      canonical: `/${slug === "index" ? "" : slug}`,
    },
  };
}
