import { notFound } from "next/navigation";
import PostsList, { PostsListItem } from "@/components/posts/posts-list";
import {
  fetchSanityPageBySlug,
  fetchSanityPosts,
  fetchSanityPostsCount,
} from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";

const POSTS_PER_PAGE = 6;

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  // Prefer Sanity page doc for blog landing metadata when present
  const pageDoc = await fetchSanityPageBySlug({ slug: "blog" });
  const base = pageDoc
    ? generatePageMetadata({ page: pageDoc as any, slug: "blog", type: "page" })
    : generatePageMetadata({
        page: { meta: {} } as any,
        slug: "blog",
        type: "page",
      });
  const sp = searchParams ? await searchParams : undefined;
  const pageNum = sp?.page ? Number(sp.page) : 1;
  if (pageNum > 1) {
    return {
      ...base,
      robots: "noindex",
      alternates: { canonical: "/blog" },
    } as any;
  }
  return base as any;
}

export default async function BlogIndex(props: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const sp = props.searchParams ? await props.searchParams : undefined;
  const page = Math.max(1, Number(sp?.page || 1));
  const sortParam = (sp as any)?.sort;
  const sort: "newest" | "az" | "za" =
    sortParam === "az" || sortParam === "za" ? sortParam : "newest";

  const [posts, totalCount] = await Promise.all([
    fetchSanityPosts({ page, limit: POSTS_PER_PAGE, sort }),
    fetchSanityPostsCount(),
  ]);
  const totalPages = Math.max(1, Math.ceil((totalCount || 0) / POSTS_PER_PAGE));

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
        }))
      : null,
  }));

  return (
    <section className="container py-16 xl:py-20">
      <h1 className="text-3xl font-semibold md:text-5xl">Blog</h1>
      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href={`/blog`}
          className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm ${sort === "newest" ? "bg-muted" : "hover:bg-muted"}`}
        >
          Newest
        </a>
        <a
          href={`/blog?sort=az`}
          className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm ${sort === "az" ? "bg-muted" : "hover:bg-muted"}`}
        >
          A–Z
        </a>
        <a
          href={`/blog?sort=za`}
          className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm ${sort === "za" ? "bg-muted" : "hover:bg-muted"}`}
        >
          Z–A
        </a>
      </div>
      <div className="mt-8">
        <PostsList
          items={items}
          page={page}
          pageCount={totalPages}
          baseUrl="/blog"
          baseSearchParams={sort && sort !== "newest" ? `sort=${sort}` : ""}
        />
      </div>
    </section>
  );
}
