import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import { fetchSanityPosts, fetchSanityPostsCount } from "@/sanity/lib/fetch";
import PostsList, { PostsListItem } from "@/components/posts/posts-list";
import { buildLocalizedPath } from "@/lib/i18n/routing";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";

type AllPosts16Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "all-posts-16" }
>;

export default async function AllPosts16({
  padding,
  searchParams,
  locale = FALLBACK_LOCALE,
}: AllPosts16Props & {
  searchParams?: {
    page?: string;
  };
  locale?: SupportedLocale;
}) {
  const POSTS_PER_PAGE = 6;
  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;

  const [posts, totalPosts] = await Promise.all([
    fetchSanityPosts({
      page: currentPage,
      limit: POSTS_PER_PAGE,
      lang: locale,
    }),
    fetchSanityPostsCount({ lang: locale }),
  ]);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const items: PostsListItem[] = (posts || []).map((p) => ({
    _id: p._id || "",
    slug: p.slug?.current || "",
    title: p.title || null,
    createdAt: p._createdAt || null,
    excerpt: p.excerpt || null,
    author: {
      name: p.author?.name || null,
      title: p.author?.title || null,
      imageUrl: p.author?.image?.asset?.url || null,
    },
    categories: Array.isArray(p.categories)
      ? p.categories.map((c) => ({
          _id: c?._id || undefined,
          title: c?.title || null,
          slug: c?.slug || null,
        }))
      : null,
  }));

  const baseUrl = buildLocalizedPath(locale, "/blog");

  return (
    <SectionContainer padding={padding}>
      <PostsList
        items={items}
        page={currentPage}
        pageCount={totalPages}
        baseUrl={baseUrl}
        locale={locale}
      />
    </SectionContainer>
  );
}
