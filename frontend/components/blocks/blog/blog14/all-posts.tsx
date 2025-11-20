import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import { fetchSanityPosts, fetchSanityPostsCount } from "@/sanity/lib/fetch";
import Pagination from "@/components/pagination";
import { buildLocalizedPath } from "@/lib/i18n/routing";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";
import PostCard14 from "@/components/posts/post-card-14";

type AllPosts14Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "all-posts-14" }
>;

export default async function AllPosts14({
  padding,
  searchParams,
  locale = FALLBACK_LOCALE,
}: AllPosts14Props & {
  searchParams?: {
    page?: string;
  };
  locale?: SupportedLocale;
}) {
  const POSTS_PER_PAGE = 6;
  const currentPage = searchParams?.page
    ? parseInt(searchParams.page || "1")
    : 1;

  const [posts, totalPosts] = await Promise.all([
    fetchSanityPosts({
      page: currentPage,
      limit: POSTS_PER_PAGE,
      lang: locale,
    }),
    fetchSanityPostsCount({ lang: locale }),
  ]);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const baseBlogPath = buildLocalizedPath(locale, "/blog");

  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (pageNum > 1) params.set("page", pageNum.toString());
    return `${baseBlogPath}${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <SectionContainer padding={padding}>
      {posts && posts?.length > 0 && (
        <div className="grid grid-cols-1 gap-10 md:gap-6 lg:grid-cols-3">
          {posts.map((post, i) => (
            <PostCard14
              key={post._id}
              post={post}
              locale={locale}
              priority={currentPage === 1 && i === 0}
            />
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
