import SectionContainer from "@/components/ui/section-container";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight } from "lucide-react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PostDate from "@/components/post-date";
import Link from "next/link";
import { PAGE_QUERYResult } from "@/sanity.types";
import { fetchSanityPosts, fetchSanityPostsCount } from "@/sanity/lib/fetch";
import Pagination from "@/components/pagination";

type AllPosts14Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "all-posts-14" }
>;

export default async function AllPosts14({
  padding,
  searchParams,
}: AllPosts14Props & {
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
        <div className="grid grid-cols-1 gap-10 md:gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.title} className="flex flex-col items-start gap-4">
              {post.image && post.image.asset?._id && (
                <Image
                  src={urlFor(post.image).url()}
                  alt={post.image.alt || ""}
                  placeholder={
                    post.image?.asset?.metadata?.lqip ? "blur" : undefined
                  }
                  blurDataURL={post.image?.asset?.metadata?.lqip || ""}
                  className="aspect-video rounded-lg object-cover"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  width={post.image.asset?.metadata?.dimensions?.width || 700}
                  height={post.image.asset?.metadata?.dimensions?.height || 400}
                  quality={100}
                />
              )}
              {posts[0].categories && posts[0].categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {posts[0].categories.map((category) => (
                    <Badge key={category._id} variant="secondary">
                      {category.title}
                    </Badge>
                  ))}
                </div>
              )}
              {post.title && (
                <h3 className="text-xl font-semibold text-balance md:max-w-md">
                  {post.title}
                </h3>
              )}
              {post.excerpt && (
                <p className="text-muted-foreground md:max-w-md">
                  {post.excerpt}
                </p>
              )}
              <div className="flex justify-between gap-6 text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <PostDate date={post._createdAt} />
                </span>
                <Link
                  href={`/blog/${post.slug?.current}`}
                  className="flex items-center gap-1"
                >
                  Read more
                  <ChevronRight className="h-full w-3" />
                </Link>
              </div>
            </div>
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
