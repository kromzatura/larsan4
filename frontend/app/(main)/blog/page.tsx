import Link from "next/link";
import { notFound } from "next/navigation";
import PostsList, { PostsListItem } from "@/components/posts/posts-list";
import {
  fetchSanityPageBySlug,
  fetchSanityPosts,
  fetchSanityPostsCount,
} from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { chipClass } from "@/components/ui/chip";

const POSTS_PER_PAGE = 6;

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; sort?: string }>;
}) {
  const sp = searchParams ? await searchParams : undefined;
  const pageNum = Math.max(1, Number(sp?.page || 1));
  const sortParam = (sp as any)?.sort;
  const sort: "newest" | "az" | "za" =
    sortParam === "az" || sortParam === "za" ? sortParam : "newest";
  const pageDoc = await fetchSanityPageBySlug({ slug: "blog" });
  const base = generatePageMetadata({
    page: pageDoc as any,
    slug: "blog",
    type: "page",
  });
  const withRss = {
    ...base,
    alternates: {
      ...(base as any)?.alternates,
      types: {
        ...(base as any)?.alternates?.types,
        "application/rss+xml": "/blog/rss.xml",
        "application/feed+json": "/blog/feed.json",
      },
    },
  } as any;
  if (pageNum > 1 || sort !== "newest") {
    return {
      ...withRss,
      robots: "noindex",
      alternates: { canonical: "/blog" },
    } as any;
  }
  return withRss as any;
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
  if (page > totalPages) notFound();

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
          slug: (c as any)?.slug || null,
        }))
      : null,
  }));

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
    ],
  } as const;

  return (
    <section className="container py-16 xl:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <h1 className="text-3xl font-semibold md:text-5xl">Blog</h1>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/blog/rss.xml"
          prefetch
          aria-label="Subscribe to the blog RSS feed"
          className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
        >
          Subscribe (RSS)
        </Link>
        <Link
          href="/blog/feed.json"
          prefetch
          aria-label="Subscribe to the blog JSON feed"
          className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
        >
          Subscribe (JSON)
        </Link>
        <Link
          href={`/blog`}
          prefetch
          aria-label="Sort by newest"
          aria-current={sort === "newest" ? "page" : undefined}
          className={chipClass(sort === "newest")}
        >
          Newest
        </Link>
        <Link
          href={`/blog?sort=az`}
          prefetch
          aria-label="Sort by title A to Z"
          aria-current={sort === "az" ? "page" : undefined}
          className={chipClass(sort === "az")}
        >
          A–Z
        </Link>
        <Link
          href={`/blog?sort=za`}
          prefetch
          aria-label="Sort by title Z to A"
          aria-current={sort === "za" ? "page" : undefined}
          className={chipClass(sort === "za")}
        >
          Z–A
        </Link>
      </div>
      <div className="mt-8">
        {items.length === 0 ? (
          <div className="rounded-md border p-6 text-sm text-muted-foreground">
            No posts found. Try adjusting your sort, or{" "}
            <a href="/" className="underline underline-offset-2">
              go back home
            </a>
            .
          </div>
        ) : (
          <PostsList
            items={items}
            page={page}
            pageCount={totalPages}
            baseUrl="/blog"
            baseSearchParams={sort && sort !== "newest" ? `sort=${sort}` : ""}
          />
        )}
      </div>
    </section>
  );
}
