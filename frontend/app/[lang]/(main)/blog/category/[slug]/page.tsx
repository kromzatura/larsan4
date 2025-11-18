import Link from "next/link";
import { notFound } from "next/navigation";
import PostsList, { PostsListItem } from "@/components/posts/posts-list";
import {
  fetchSanityBlogCategoryBySlug,
  fetchSanityPostsByBlogCategory,
  fetchSanityPostsCountByBlogCategory,
} from "@/sanity/lib/fetch";
import { chipClass } from "@/components/ui/chip";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { normalizeLocale, buildLocalizedPath } from "@/lib/i18n/routing";
import { buildAbsoluteUrl } from "@/lib/url";
import type { AsyncPageProps, SearchParams } from "@/lib/types/next";
import { toText } from "@/lib/utils";
import LdScript from "@/components/seo/ld-script";

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

// Narrow structural type to satisfy generatePageMetadata without using `any`
type CategoryForMeta = {
  meta?: {
    title?: unknown;
    description?: unknown;
    noindex?: boolean | null;
    image?: unknown;
  } | null;
  allTranslations?: Array<{ lang: string; slug: string }>;
};

const POSTS_PER_PAGE = 6;

export async function generateMetadata(
  props: AsyncPageProps<{ slug: string; lang?: string }, SearchParams>
) {
  const params = (await props.params)!;
  const locale = normalizeLocale(params.lang);
  const sp = (props.searchParams ? await props.searchParams : undefined) as
    | BlogCategorySearchParams
    | undefined;
  const pageNum = Math.max(1, Number(sp?.page || 1));
  const rawSort = sp?.sort;
  const sort: BlogSort =
    rawSort === "az" || rawSort === "za" ? rawSort : "newest";
  const cat = await fetchSanityBlogCategoryBySlug({
    slug: params.slug,
    lang: locale,
  });
  if (!cat) notFound();
  // Build base metadata (canonical + alternates) using centralized helper with translations
  const base = generatePageMetadata({
    page: cat as unknown as CategoryForMeta,
    slug: `blog/category/${params.slug}`,
    type: "blogCategory",
    locale,
  }) as MetadataWithAlternates;
  const basePath = buildLocalizedPath(locale, `/blog/category/${params.slug}`);
  const withFeeds: MetadataWithAlternates = {
    ...base,
    alternates: {
      ...(base.alternates || {}),
      types: {
        "application/rss+xml": `${basePath}/rss.xml`,
        "application/feed+json": `${basePath}/feed.json`,
      },
    },
  };
  if (pageNum > 1 || sort !== "newest") {
    if (
      process.env.LOG_HREFLANG === "1" ||
      process.env.NEXT_PUBLIC_LOG_HREFLANG === "1"
    ) {
      // eslint-disable-next-line no-console
      console.info(
        JSON.stringify(
          {
            tag: "hreflang",
            note: "pagination/sort category page returning canonical-only alternates",
            page: "blog-category",
            locale,
            slug: params.slug,
            pageNum,
            sort,
            canonical: basePath,
          },
          null,
          2
        )
      );
    }
    return { ...withFeeds, robots: "noindex" } as MetadataWithAlternates;
  }
  return withFeeds;
}

export default async function BlogCategoryPage(
  props: AsyncPageProps<{ slug: string; lang?: string }, SearchParams>
) {
  const params = (await props.params)!;
  const locale = normalizeLocale(params.lang);
  const sp = (props.searchParams ? await props.searchParams : undefined) as
    | BlogCategorySearchParams
    | undefined;
  const page = Math.max(1, Number(sp?.page || 1));
  const rawSort = sp?.sort;
  const sort: BlogSort =
    rawSort === "az" || rawSort === "za" ? rawSort : "newest";

  const [cat, posts, totalCount] = await Promise.all([
    fetchSanityBlogCategoryBySlug({ slug: params.slug, lang: locale }),
    fetchSanityPostsByBlogCategory({
      slug: params.slug,
      page,
      limit: POSTS_PER_PAGE,
      sort,
      lang: locale,
    }),
    fetchSanityPostsCountByBlogCategory({ slug: params.slug, lang: locale }),
  ]);
  if (!cat) notFound();
  const totalPages = Math.max(1, Math.ceil((totalCount || 0) / POSTS_PER_PAGE));
  if (page > totalPages) notFound();

  const catTitle = toText(cat.title) || "Category";
  const catDescription = toText(cat.description);

  const items: PostsListItem[] = (posts || []).map((p) => ({
    _id: p._id || "",
    slug: p.slug?.current || "",
    title: p.title || null,
    imageUrl: p.image?.asset?.url || null,
    imageAlt: (() => {
      const alt = (p.image as { alt?: unknown } | null | undefined)?.alt;
      return typeof alt === "string" ? alt : null;
    })(),
    imageMeta: p.image?.asset?.metadata || null,
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

  const baseUrl = buildLocalizedPath(locale, `/blog/category/${params.slug}`);
  const blogPath = buildLocalizedPath(locale, "/blog");
  const baseSearchParams = sort && sort !== "newest" ? `sort=${sort}` : "";
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    inLanguage: locale,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: buildAbsoluteUrl(locale, "/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: buildAbsoluteUrl(locale, "/blog"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: catTitle,
        item: buildAbsoluteUrl(locale, `/blog/category/${params.slug}`),
      },
    ],
  } as const;

  // JSON-LD: CollectionPage with ItemList of current page's posts
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    inLanguage: locale,
    name: catTitle,
    "@id": buildAbsoluteUrl(locale, `/blog/category/${params.slug}`),
    url: buildAbsoluteUrl(locale, `/blog/category/${params.slug}`),
    description: catDescription || undefined,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalCount || 0,
      itemListElement: (posts || []).map((p, idx) => ({
        "@type": "ListItem",
        position: (page - 1) * POSTS_PER_PAGE + idx + 1,
        name: toText(p.title) || undefined,
        url: buildAbsoluteUrl(locale, `/blog/${p.slug?.current ?? ""}`),
      })),
    },
  } as const;

  return (
    <section className="container py-16 xl:py-20">
      <LdScript json={breadcrumbLd} />
      <LdScript json={collectionLd} />
      <h1 className="text-3xl font-serif font-semibold md:text-5xl">
        {catTitle}
      </h1>
      {catDescription && (
        <p className="mt-3 max-w-3xl text-muted-foreground">{catDescription}</p>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={`${baseUrl}/rss.xml`}
          prefetch
          aria-label={`Subscribe to ${catTitle ?? "this category"} RSS feed`}
          className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
        >
          Subscribe (RSS)
        </Link>
        <Link
          href={`${baseUrl}/feed.json`}
          prefetch
          aria-label={`Subscribe to ${catTitle ?? "this category"} JSON feed`}
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
            <Link href={blogPath} className="underline underline-offset-2">
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
            locale={locale}
          />
        )}
      </div>
    </section>
  );
}
