import SectionContainer from "@/components/ui/section-container";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PostDate from "@/components/post-date";
import Link from "next/link";
import { PAGE_QUERYResult } from "@/sanity.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type Blog4 = Extract<Block, { _type: "blog-4" }>;

export default function Blog4({ padding, posts, gridColumns }: Blog4) {
  return (
    <SectionContainer padding={padding}>
      {posts && posts?.length > 0 && (
        <div
          className={cn(
            "grid gap-x-4 gap-y-8 md:grid-cols-2 lg:gap-x-6 lg:gap-y-12",
            `xl:${gridColumns}`
          )}
        >
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug?.current}`}
              className="group flex flex-col"
            >
              <div className="mb-4 flex overflow-clip rounded-xl md:mb-5">
                <div className="transition duration-300 group-hover:scale-105">
                  {post.image && post.image.asset?._id && (
                    <Image
                      src={urlFor(post.image).url()}
                      alt={post.image.alt || ""}
                      placeholder={
                        post.image?.asset?.metadata?.lqip ? "blur" : undefined
                      }
                      blurDataURL={post.image?.asset?.metadata?.lqip || ""}
                      className="aspect-[3/2] h-full w-full object-cover object-center"
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
              </div>

              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((category) => (
                    <Badge key={category._id}>{category.title}</Badge>
                  ))}
                </div>
              )}
              {post.title && (
                <h2 className="mb-2 line-clamp-3 pt-4 text-lg font-medium break-words md:mb-3 md:pt-4 md:text-2xl lg:pt-4 lg:text-3xl">
                  {post.title}
                </h2>
              )}
              {post.excerpt && (
                <div className="mb-4 line-clamp-2 text-sm text-muted-foreground md:mb-5 md:text-base">
                  {post.excerpt}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Avatar className="size-12">
                  <AvatarImage src={post.author?.image?.asset?.url || ""} />
                  <AvatarFallback>
                    {post.author?.name?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-px">
                  <span className="text-xs font-medium">
                    {post.author?.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    <PostDate date={post._createdAt} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
