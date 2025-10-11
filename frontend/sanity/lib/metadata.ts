import { urlFor } from "@/sanity/lib/image";
import {
  PAGE_QUERYResult,
  POST_QUERYResult,
  CONTACT_QUERYResult,
  PRODUCT_QUERYResult,
  ProductCategory,
} from "@/sanity.types";
import { getOgImageUrl } from "@/sanity/lib/fetch";
import type { Metadata } from "next";

const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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
}): Metadata {
  const meta = page?.meta;
  const imgAsset = meta?.image?.asset;
  const pagePath = slug === "index" ? "" : `/${slug}`;

  const robotsValue = (() => {
    if (!isProduction) return { index: false, follow: false } as const;
    if (meta?.noindex) return { index: false, follow: true } as const;
    return { index: true, follow: true } as const;
  })();
  return {
    title: meta?.title ?? undefined,
    description: meta?.description ?? undefined,
    openGraph: {
      title: meta?.title ?? undefined,
      description: meta?.description ?? undefined,
      images: [
        {
          url: meta?.image
            ? urlFor(meta?.image).quality(100).url()
            : getOgImageUrl({ type, slug }),
          width: ((): number => {
            const a = imgAsset as unknown;
            if (
              a &&
              typeof a === "object" &&
              "metadata" in a &&
              (a as any).metadata?.dimensions?.width
            ) {
              return (a as any).metadata.dimensions.width ?? 1200;
            }
            return 1200;
          })(),
          height: ((): number => {
            const a = imgAsset as unknown;
            if (
              a &&
              typeof a === "object" &&
              "metadata" in a &&
              (a as any).metadata?.dimensions?.height
            ) {
              return (a as any).metadata.dimensions.height ?? 630;
            }
            return 630;
          })(),
        },
      ],
      locale: "en_US",
      type: "website",
    },
    robots: robotsValue,
    alternates: {
      canonical: new URL(pagePath, baseUrl).toString(),
    },
  };
}
