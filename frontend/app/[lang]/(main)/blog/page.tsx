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
import { buildLocalizedPath, normalizeLocale } from "@/lib/i18n/routing";
import type { LangAsyncPageProps } from "@/lib/types/next";

type BlogSort = "newest" | "az" | "za";

interface MetadataWithAlternates {
  alternates?: {
    types?: Record<string, string>;
    canonical?: string;
  };
  robots?: string;
  [key: string]: unknown;
}

const POSTS_PER_PAGE = 6;

export async function generateMetadata(props: LangAsyncPageProps) {
  const params = props.params ? await props.params : undefined;
  const locale = normalizeLocale(params?.lang);
  const sp = (props.searchParams ? await props.searchParams : undefined) as
    | { page?: string; sort?: string }
    | undefined;
  const pageNum = Math.max(1, Number(sp?.page || 1));
  const rawSort = sp?.sort;
  const sort: BlogSort =
    rawSort === "az" || rawSort === "za" ? rawSort : "newest";
  const pageDoc = await fetchSanityPageBySlug({ slug: "blog", lang: locale });
  const basePath = buildLocalizedPath(locale, "/blog");
  const base = generatePageMetadata({
    page: pageDoc,
    slug: "blog",
    type: "page",
    locale,
  }) as MetadataWithAlternates;
  const withRss: MetadataWithAlternates = {
    ...base,
    alternates: {
      ...(base.alternates || {}),
      types: {
        ...(base.alternates?.types || {}),
        "application/rss+xml": `${basePath}/rss.xml`,
        "application/feed+json": `${basePath}/feed.json`,
      },
    },
  };
  if (pageNum > 1 || sort !== "newest") {
    return {
      ...withRss,
      robots: "noindex",
      alternates: { canonical: basePath },
    } as MetadataWithAlternates;
  }
  return withRss;
}

export default async function BlogIndex(props: LangAsyncPageProps) {
  const resolvedParams = props.params ? await props.params : undefined;
  const locale = normalizeLocale(resolvedParams?.lang);
  const sp = (props.searchParams ? await props.searchParams : undefined) as
    | { page?: string; sort?: string }
    | undefined;
  const page = Math.max(1, Number(sp?.page || 1));
  const rawSort = sp?.sort;
  const sort: BlogSort =
    rawSort === "az" || rawSort === "za" ? rawSort : "newest";
  const basePath = buildLocalizedPath(locale, "/blog");

  const [posts, totalCount] = await Promise.all([
    fetchSanityPosts({ page, limit: POSTS_PER_PAGE, sort, lang: locale }),
    fetchSanityPostsCount({ lang: locale }),
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
          slug: c?.slug || null,
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
        item: `${SITE_URL}${buildLocalizedPath(locale, "/")}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}${basePath}`,
      },
    ],
  } as const;

  return (
    <section className="container py-16 xl:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
  <h1 className="text-3xl font-serif font-semibold md:text-5xl">Blog</h1>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={`${basePath}/rss.xml`}
          prefetch
          aria-label="Subscribe to the blog RSS feed"
          className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
        >
          Subscribe (RSS)
        </Link>
        <Link
          href={`${basePath}/feed.json`}
          prefetch
          aria-label="Subscribe to the blog JSON feed"
          className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
        >
          Subscribe (JSON)
        </Link>
        <Link
          href={basePath}
          prefetch
          aria-label="Sort by newest"
          aria-current={sort === "newest" ? "page" : undefined}
          className={chipClass(sort === "newest")}
        >
          Newest
        </Link>
        <Link
          href={`${basePath}?sort=az`}
          prefetch
          aria-label="Sort by title A to Z"
          aria-current={sort === "az" ? "page" : undefined}
          className={chipClass(sort === "az")}
        >
          A–Z
        </Link>
        <Link
          href={`${basePath}?sort=za`}
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
            <Link
              href={buildLocalizedPath(locale, "/")}
              className="underline underline-offset-2"
            >
              go back home
            </Link>
            .
          </div>
        ) : (
          <PostsList
            items={items}
            page={page}
            pageCount={totalPages}
            baseUrl={basePath}
            baseSearchParams={sort && sort !== "newest" ? `sort=${sort}` : ""}
            locale={locale}
          />
        )}
      </div>
    </section>
  );
}
