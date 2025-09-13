import SectionContainer from "@/components/ui/section-container";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PostDate from "@/components/post-date";
import Link from "next/link";
import { PAGE_QUERYResult } from "@/sanity.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchSanityPosts, fetchSanityPostsCount } from "@/sanity/lib/fetch";
import Pagination from "@/components/pagination";

type AllPosts4Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "all-posts-4" }
>;

export default async function AllPosts4({
  padding,
  searchParams,
}: AllPosts4Props & {
  searchParams?: Promise<{
    page?: string;
  }>;
}) {
  const POSTS_PER_PAGE = 6;

  const currentPage = searchParams
    ? parseInt((await searchParams).page || "1")
    : 1;

  const [posts, totalPosts] = await Promise.all([
    fetchSanityPosts({
      page: currentPage,
      limit: POSTS_PER_PAGE,
    }),
    fetchSanityPostsCount(),
  ]);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (pageNum > 1) params.set("page", pageNum.toString());
    return `/blog${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <SectionContainer padding={padding}>
      {posts && posts?.length > 0 && (
        <div className="grid gap-x-4 gap-y-8 md:grid-cols-2 lg:gap-x-6 lg:gap-y-12 xl:grid-cols-3">
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        createPageUrl={createPageUrl}
        className="mt-8"
      />
    </SectionContainer>
  );
}
