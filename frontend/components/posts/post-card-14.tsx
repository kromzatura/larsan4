import { Badge } from "@/components/ui/badge";
import PostDate from "@/components/post-date";
import { buildLocalizedPath } from "@/lib/i18n/routing";
import type { SupportedLocale } from "@/lib/i18n/config";
import { toText } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import { Calendar, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Post = {
  _id?: string | null;
  _createdAt?: string | null;
  title?: unknown;
  slug?: { current?: string | null } | null;
  excerpt?: unknown;
  image?: {
    alt?: unknown;
    asset?: {
      _id?: string | null;
      url?: string | null;
      metadata?: {
        lqip?: string | null;
        dimensions?: { width?: number | null; height?: number | null } | null;
      } | null;
    } | null;
  } | null;
  categories?: Array<{
    _id?: string | null;
    title?: unknown;
    slug?: { current?: string | null } | null;
  }> | null;
};

export default function PostCard14({
  post,
  locale,
  priority = false,
}: {
  post: Post;
  locale: SupportedLocale;
  priority?: boolean;
}) {
  const baseBlogPath = buildLocalizedPath(locale, "/blog");
  const titleText = toText(post?.title);
  const excerptText = toText(post?.excerpt);
  const postHref = buildLocalizedPath(locale, `/blog/${post?.slug?.current || ""}`);
  const altText = toText(post?.image?.alt) || titleText || "";
  return (
    <div className="group flex flex-col items-start gap-4">
      {post?.image && post.image.asset?._id && (
        <div className="overflow-hidden rounded-lg">
          <Image
            src={urlFor(post.image).url()}
            alt={altText}
            placeholder={post.image?.asset?.metadata?.lqip ? "blur" : undefined}
            blurDataURL={post.image?.asset?.metadata?.lqip || ""}
            className="aspect-video object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(min-width: 1024px) 33vw, 100vw"
            width={post.image.asset?.metadata?.dimensions?.width || 700}
            height={post.image.asset?.metadata?.dimensions?.height || 400}
            quality={100}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
          />
        </div>
      )}
      {post?.categories && post.categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.categories.map((category) => {
            const slug = category?.slug?.current ?? undefined;
            const href = slug
              ? buildLocalizedPath(locale, `/blog/category/${slug}`)
              : baseBlogPath;
            return (
              <Link key={category?._id ?? slug ?? "cat"} href={href} aria-label={`View category: ${toText(category?.title)}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded-md">
                <Badge variant="secondary">{toText(category?.title)}</Badge>
              </Link>
            );
          })}
        </div>
      )}
      {titleText ? (
        <h3 className="text-xl font-semibold text-balance md:max-w-md">
          <Link
            href={postHref}
            aria-label={`Read post: ${titleText}`}
            className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded-sm"
          >
            {titleText}
          </Link>
        </h3>
      ) : null}
      {excerptText ? (
        <p className="text-muted-foreground md:max-w-md">{excerptText}</p>
      ) : null}
      <div className="flex justify-between gap-6 text-sm w-full">
        <span className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <PostDate date={post?._createdAt || ""} />
        </span>
        <Link
          href={postHref}
          aria-label={`Read more: ${titleText || "post"}`}
          className="flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded-sm"
        >
          Read more
          <ChevronRight className="h-full w-3" />
        </Link>
      </div>
    </div>
  );
}
