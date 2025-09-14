import { urlFor } from "@/sanity/lib/image";
import { PAGE_QUERYResult, POST_QUERYResult, CONTACT_QUERYResult } from "@/sanity.types";
import { getOgImageUrl } from "@/sanity/lib/fetch";
const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

// Accepts any object that may carry `meta` and optional top-level title/description
type SeoLike =
  | PAGE_QUERYResult
  | POST_QUERYResult
  | CONTACT_QUERYResult
  | {
      meta?: {
        title?: string | null;
        description?: string | null;
        image?: unknown;
        noindex?: boolean | null;
      } | null;
      title?: string | null;
      description?: string | null;
    };

export function generatePageMetadata({
  page,
  slug,
  type,
}: {
  page: SeoLike;
  slug: string;
  type: "post" | "page";
}) {
  const title = (page as any)?.meta?.title ?? (page as any)?.title;
  const description = (page as any)?.meta?.description ?? (page as any)?.description;
  const metaImage = (page as any)?.meta?.image;
  const noindex = (page as any)?.meta?.noindex;
  return {
    title,
    description,
    openGraph: {
      images: [
        {
          url: metaImage
            ? urlFor(metaImage).quality(100).url()
            : getOgImageUrl({ type, slug }),
          width: (metaImage as any)?.asset?.metadata?.dimensions?.width || 1200,
          height: (metaImage as any)?.asset?.metadata?.dimensions?.height || 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    robots: !isProduction
      ? "noindex, nofollow"
      : noindex
        ? "noindex"
        : "index, follow",
    alternates: {
      canonical: `/${slug === "index" ? "" : slug}`,
    },
  };
}
