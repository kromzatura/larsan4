import SectionContainer from "@/components/ui/section-container";
import { cn, toText } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PAGE_QUERYResult } from "@/sanity.types";
import { buildLocalizedPath } from "@/lib/i18n/routing";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type Blog7 = Extract<Block, { _type: "blog-7" }>;

export default function Blog7({
  padding,
  posts,
  gridColumns,
  locale = FALLBACK_LOCALE,
}: Blog7 & { locale?: SupportedLocale }) {
  return (
    <SectionContainer padding={padding}>
      {posts && posts?.length > 0 && (
        <div
          className={cn(
            "grid gap-6 md:grid-cols-2 lg:gap-8",
            `lg:${gridColumns}`
          )}
        >
          {posts.map((post) => {
            const postSlug = post.slug?.current ?? "";
            const postHref = postSlug
              ? buildLocalizedPath(locale, `/blog/${postSlug}`)
              : buildLocalizedPath(locale, "/blog");
            return (
              <Card
                key={post._id}
                className="grid grid-rows-[auto_auto_1fr_auto] pt-0 overflow-hidden"
              >
                <div className="aspect-[16/9] w-full">
                  {post.image && post.image.asset?._id && (
                    <Image
                      src={urlFor(post.image).url()}
                      alt={post.image.alt || ""}
                      placeholder={
                        post.image?.asset?.metadata?.lqip ? "blur" : undefined
                      }
                      blurDataURL={post.image?.asset?.metadata?.lqip || ""}
                      className="h-full w-full object-cover object-center"
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      width={
                        post.image.asset?.metadata?.dimensions?.width || 700
                      }
                      height={
                        post.image.asset?.metadata?.dimensions?.height || 400
                      }
                      quality={100}
                    />
                  )}
                </div>
                <CardHeader>
                  <h3 className="text-lg font-semibold hover:underline md:text-xl">
                    <Link key={post._id} href={postHref}>
                      {toText(post.title)}
                    </Link>
                  </h3>
                </CardHeader>
                {toText(post.excerpt) && (
                  <CardContent>
                    <p className="text-muted-foreground">
                      {toText(post.excerpt)}
                    </p>
                  </CardContent>
                )}
                <CardFooter>
                  <Link
                    key={post._id}
                    href={postHref}
                    className="flex items-center text-foreground hover:underline"
                  >
                    Read more
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </SectionContainer>
  );
}
