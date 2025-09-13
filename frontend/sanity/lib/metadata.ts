import { urlFor } from "@/sanity/lib/image";
import {
  PAGE_QUERYResult,
  POST_QUERYResult,
  CONTACT_QUERYResult,
} from "@/sanity.types";
import { getOgImageUrl } from "@/sanity/lib/fetch";
const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

export function generatePageMetadata({
  page,
  slug,
  type,
}: {
  page: PAGE_QUERYResult | POST_QUERYResult | CONTACT_QUERYResult;
  slug: string;
  type: "post" | "page";
}) {
  return {
    title: page?.meta?.title,
    description: page?.meta?.description,
    openGraph: {
      images: [
        {
          url: page?.meta?.image
            ? urlFor(page?.meta?.image).quality(100).url()
            : getOgImageUrl({ type, slug }),
          width: page?.meta?.image?.asset?.metadata?.dimensions?.width || 1200,
          height: page?.meta?.image?.asset?.metadata?.dimensions?.height || 630,
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
