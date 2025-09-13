import SectionContainer from "@/components/ui/section-container";
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
import { fetchSanityPosts, fetchSanityPostsCount } from "@/sanity/lib/fetch";
import Pagination from "@/components/pagination";

type AllPosts7Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "all-posts-7" }
>;

export default async function AllPosts7({
  padding,
  searchParams,
}: AllPosts7Props & {
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
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8 lg:grid-cols-3">
          {posts.map((post) => (
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
                    width={post.image.asset?.metadata?.dimensions?.width || 700}
                    height={
                      post.image.asset?.metadata?.dimensions?.height || 400
                    }
                    quality={100}
                  />
                )}
              </div>
              <CardHeader>
                <h3 className="text-lg font-semibold hover:underline md:text-xl">
                  <Link key={post._id} href={`/blog/${post.slug?.current}`}>
                    {post.title}
                  </Link>
                </h3>
              </CardHeader>
              {post.excerpt && (
                <CardContent>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </CardContent>
              )}
              <CardFooter>
                <Link
                  key={post._id}
                  href={`/blog/${post.slug?.current}`}
                  className="flex items-center text-foreground hover:underline"
                >
                  Read more
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </CardFooter>
            </Card>
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
