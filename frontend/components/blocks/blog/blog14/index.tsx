import SectionContainer from "@/components/ui/section-container";
import { cn, toText } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PostDate from "@/components/post-date";
import Link from "next/link";
import { PAGE_QUERYResult } from "@/sanity.types";
import { Calendar, ChevronRight } from "lucide-react";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";
import { buildLocalizedPath } from "@/lib/i18n/routing";
type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type Blog14 = Extract<Block, { _type: "blog-14" }>;

export default function Blog14({
  padding,
  posts,
  title,
  gridColumns,
  locale = FALLBACK_LOCALE,
}: Blog14 & { locale?: SupportedLocale }) {
  return (
    <SectionContainer padding={padding}>
      {posts && posts?.length > 0 && (
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 lg:gap-16">
          {posts[0].image && posts[0].image.asset?._id && (
            <Image
              src={urlFor(posts[0].image).url()}
              alt={toText(posts[0].image.alt) || ""}
              placeholder={
                posts[0].image?.asset?.metadata?.lqip ? "blur" : undefined
              }
              blurDataURL={posts[0].image?.asset?.metadata?.lqip || ""}
              className="aspect-video rounded-lg object-cover"
              sizes="(min-width: 1024px) 33vw, 100vw"
              width={posts[0].image.asset?.metadata?.dimensions?.width || 700}
              height={posts[0].image.asset?.metadata?.dimensions?.height || 400}
              quality={100}
            />
          )}
          <div className="flex flex-col items-start gap-4">
            {posts[0].categories && posts[0].categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {posts[0].categories.map((category) => {
                  const slug = category.slug?.current ?? undefined;
                  const href = slug
                    ? buildLocalizedPath(locale, `/blog/category/${slug}`)
                    : buildLocalizedPath(locale, "/blog");
                  const catTitle = toText(category.title);
                  return (
                    <Link key={category._id} href={href}>
                      {catTitle && (
                        <Badge variant="secondary">{catTitle}</Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
            {toText(posts[0].title) && (
              <h2 className="text-2xl font-semibold text-balance md:max-w-lg lg:text-3xl">
                {toText(posts[0].title)}
              </h2>
            )}
            {toText(posts[0].excerpt) && (
              <p className="text-muted-foreground md:max-w-lg">
                {toText(posts[0].excerpt)}
              </p>
            )}
            <div className="flex justify-between gap-6 text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <PostDate date={posts[0]._createdAt} />
              </span>
              <Link
                href={buildLocalizedPath(
                  locale,
                  `/blog/${posts[0].slug?.current || ""}`
                )}
                className="flex items-center gap-1"
              >
                Read more
                <ChevronRight className="h-full w-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
      {posts && posts?.length > 1 && (
        <div className="mt-16">
          {toText(title) && (
            <p className="mb-8 text-2xl font-medium md:text-3xl">
              {toText(title)}
            </p>
          )}
          <div
            className={cn(
              "grid grid-cols-1 gap-10 md:gap-6",
              `lg:${gridColumns}`
            )}
          >
            {posts.slice(1).map((post) => (
              <div key={post._id} className="flex flex-col items-start gap-4">
                {post.image && post.image.asset?._id && (
                  <Image
                    src={urlFor(post.image).url()}
                    alt={toText(post.image.alt) || ""}
                    placeholder={
                      post.image?.asset?.metadata?.lqip ? "blur" : undefined
                    }
                    blurDataURL={post.image?.asset?.metadata?.lqip || ""}
                    className="aspect-video rounded-lg object-cover"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    width={post.image.asset?.metadata?.dimensions?.width || 700}
                    height={
                      post.image.asset?.metadata?.dimensions?.height || 400
                    }
                    quality={100}
                  />
                )}
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((category) => {
                      const slug = category.slug?.current ?? undefined;
                      const href = slug
                        ? buildLocalizedPath(locale, `/blog/category/${slug}`)
                        : buildLocalizedPath(locale, "/blog");
                      return (
                        <Link key={category._id} href={href}>
                          <Badge variant="secondary">
                            {toText(category.title)}
                          </Badge>
                        </Link>
                      );
                    })}
                  </div>
                )}
                {toText(post.title) && (
                  <h3 className="text-xl font-semibold text-balance md:max-w-md">
                    {toText(post.title)}
                  </h3>
                )}
                {toText(post.excerpt) && (
                  <p className="text-muted-foreground md:max-w-md">
                    {toText(post.excerpt)}
                  </p>
                )}
                <div className="flex justify-between gap-6 text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <PostDate date={post._createdAt} />
                  </span>
                  <Link
                    href={buildLocalizedPath(
                      locale,
                      `/blog/${post.slug?.current || ""}`
                    )}
                    className="flex items-center gap-1"
                  >
                    Read more
                    <ChevronRight className="h-full w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionContainer>
  );
}
