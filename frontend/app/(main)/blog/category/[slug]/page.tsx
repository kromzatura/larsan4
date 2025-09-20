import Link from "next/link";
import { notFound } from "next/navigation";
import PostsList, { PostsListItem } from "@/components/posts/posts-list";
import {
  fetchSanityBlogCategoriesStaticParams,
  fetchSanityBlogCategoryBySlug,
  fetchSanityPostsByBlogCategory,
  fetchSanityPostsCountByBlogCategory,
} from "@/sanity/lib/fetch";
import { chipClass } from "@/components/ui/chip";

type BlogSort = "newest" | "az" | "za";
interface BlogCategorySearchParams {
  page?: string;
  sort?: BlogSort | string;
}
interface MetadataWithAlternates {
  alternates?: { types?: Record<string, string>; canonical?: string };
  robots?: string;
  [key: string]: unknown;
}

const POSTS_PER_PAGE = 6;

export async function generateStaticParams() {
  const cats = await fetchSanityBlogCategoriesStaticParams();
  return cats
    .filter((c) => c.slug?.current)
    .map((c) => ({ slug: c.slug.current }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<BlogCategorySearchParams>;
}) {
  const params = await props.params;
  const sp = props.searchParams ? await props.searchParams : undefined;
  const pageNum = Math.max(1, Number(sp?.page || 1));
  const rawSort = sp?.sort;
  const sort: BlogSort = rawSort === "az" || rawSort === "za" ? rawSort : "newest";
  const cat = await fetchSanityBlogCategoryBySlug({ slug: params.slug });
  if (!cat) notFound();
  // Category documents are not full page documents; cast for metadata helper which accepts broader page-like shapes.
  const base: MetadataWithAlternates = {
    title: cat.title || undefined,
    description: cat.description || undefined,
    alternates: { canonical: `/blog/category/${params.slug}` },
  };
  const withFeeds: MetadataWithAlternates = {
    ...base,
    alternates: {
      ...(base.alternates || {}),
      types: {
        "application/rss+xml": `/blog/category/${params.slug}/rss.xml`,
        "application/feed+json": `/blog/category/${params.slug}/feed.json`,
      },
    },
  };
  if (pageNum > 1 || sort !== "newest") {
    return { ...withFeeds, robots: "noindex" } as MetadataWithAlternates;
  }
  return withFeeds;
}

export default async function BlogCategoryPage(props: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<BlogCategorySearchParams>;
}) {
  const params = await props.params;
  const sp = props.searchParams ? await props.searchParams : undefined;
  const page = Math.max(1, Number(sp?.page || 1));
  const rawSort = sp?.sort;
  const sort: BlogSort = rawSort === "az" || rawSort === "za" ? rawSort : "newest";

  const [cat, posts, totalCount] = await Promise.all([
    fetchSanityBlogCategoryBySlug({ slug: params.slug }),
    fetchSanityPostsByBlogCategory({
      slug: params.slug,
      page,
      limit: POSTS_PER_PAGE,
      sort,
    }),
    fetchSanityPostsCountByBlogCategory({ slug: params.slug }),
  ]);
  if (!cat) notFound();
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
          slug: c?.slug || null,
        }))
      : null,
  }));

  const baseUrl = `/blog/category/${params.slug}`;
  const baseSearchParams = sort && sort !== "newest" ? `sort=${sort}` : "";
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cat.title || "Category",
        item: `${SITE_URL}${baseUrl}`,
      },
    ],
  } as const;

  return (
    <section className="container py-16 xl:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <h1 className="text-3xl font-semibold md:text-5xl">{cat.title}</h1>
      {cat.description && (
        <p className="mt-3 max-w-3xl text-muted-foreground">
          {cat.description}
        </p>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={`${baseUrl}/rss.xml`}
          prefetch
          aria-label={`Subscribe to ${cat.title ?? "this category"} RSS feed`}
          className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
        >
          Subscribe (RSS)
        </Link>
        <Link
          href={`${baseUrl}/feed.json`}
          prefetch
          aria-label={`Subscribe to ${cat.title ?? "this category"} JSON feed`}
          className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
        >
          Subscribe (JSON)
        </Link>
        <Link
          href={`${baseUrl}`}
          prefetch
          aria-label="Sort by newest"
          aria-current={sort === "newest" ? "page" : undefined}
          className={chipClass(sort === "newest")}
        >
          Newest
        </Link>
        <Link
          href={`${baseUrl}?sort=az`}
          prefetch
          aria-label="Sort by title A to Z"
          aria-current={sort === "az" ? "page" : undefined}
          className={chipClass(sort === "az")}
        >
          A–Z
        </Link>
        <Link
          href={`${baseUrl}?sort=za`}
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
            No posts in this category yet. See{" "}
            <Link href="/blog" className="underline underline-offset-2">
              all posts
            </Link>
            .
          </div>
        ) : (
          <PostsList
            items={items}
            page={page}
            pageCount={totalPages}
            baseUrl={baseUrl}
            baseSearchParams={baseSearchParams}
            activeCategorySlug={params.slug}
          />
        )}
      </div>
    </section>
  );
}
