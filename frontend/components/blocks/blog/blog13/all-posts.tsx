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

type AllPosts13Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "all-posts-13" }
>;

export default async function AllPosts13({
  padding,
  searchParams,
}: AllPosts13Props & {
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
        <div className="mx-auto grid gap-6 lg:grid-cols-3">
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
                    {post.categories.map((category) => (
                      <Badge
                        key={category._id}
                        variant="secondary"
                        className="bg-background/70 px-3 py-1 text-sm backdrop-blur-sm"
                      >
                        {category.title}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex h-full flex-col justify-between p-4">
                {post.title && (
                  <h2 className="mb-5 text-xl font-semibold">{post.title}</h2>
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
