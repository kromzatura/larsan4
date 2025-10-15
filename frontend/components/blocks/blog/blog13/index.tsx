import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import { cn, toText } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight } from "lucide-react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PostDate from "@/components/post-date";
import Link from "next/link";
import { buildLocalizedPath } from "@/lib/i18n/routing";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type Blog13 = Extract<Block, { _type: "blog-13" }>;

export default function Blog13({
  padding,
  posts,
  gridColumns,
  locale = FALLBACK_LOCALE,
}: Blog13 & { locale?: SupportedLocale }) {
  return (
    <SectionContainer padding={padding}>
      {posts && posts?.length > 0 && (
        <div
          className={cn(
            "mx-auto grid gap-6",
            gridColumns === "grid-cols-2" ? "max-w-5xl" : undefined,
            `lg:${gridColumns}`
          )}
        >
          {posts.map((post) => (
            <div key={post._id} className="flex flex-col">
              <div className="relative">
                {post.image && post.image.asset?._id && (
                  <Image
                    src={urlFor(post.image).url()}
                    alt={post.image.alt || ""}
                    placeholder={
                      post.image?.asset?.metadata?.lqip ? "blur" : undefined
                    }
                    blurDataURL={post.image?.asset?.metadata?.lqip || ""}
                    className="aspect-video w-full rounded-lg object-cover"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    width={post.image.asset?.metadata?.dimensions?.width || 700}
                    height={
                      post.image.asset?.metadata?.dimensions?.height || 400
                    }
                    quality={100}
                  />
                )}
                {post.categories && post.categories.length > 0 && (
                  <div className="absolute top-4 right-4 flex flex-wrap gap-2">
                    {post.categories.map((category) => {
                      const slug = category.slug?.current ?? undefined;
                      const categoryHref = slug
                        ? buildLocalizedPath(locale, `/blog/category/${slug}`)
                        : buildLocalizedPath(locale, "/blog");
                      return (
                        <Link
                          key={category._id}
                          href={categoryHref}
                          className="focus:outline-none"
                        >
                          <Badge
                            variant="secondary"
                            className="bg-background/70 px-3 py-1 text-sm backdrop-blur-sm hover:bg-background/90"
                          >
                            {toText(category.title)}
                          </Badge>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="flex h-full flex-col justify-between p-4">
                {toText(post.title) && (
                  <h2 className="mb-5 text-xl font-semibold">{toText(post.title)}</h2>
                )}
                <div className="flex justify-between gap-6 text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <PostDate date={post._createdAt} />
                  </span>
                  <Link
                    href={buildLocalizedPath(
                      locale,
                      `/blog/${post.slug?.current ?? ""}`
                    )}
                    className="flex items-center gap-1"
                  >
                    Read more
                    <ChevronRight className="h-full w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
