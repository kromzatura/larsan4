import Link from "next/link";
import { notFound } from "next/navigation";
import PostsList, { PostsListItem } from "@/components/posts/posts-list";
import SectionHeader from "@/components/blocks/section-header";
import Blocks from "@/components/blocks";
import {
  fetchSanityPageBySlug,
  fetchSanityPosts,
  fetchSanityPostsCount,
} from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { chipClass } from "@/components/ui/chip";
import { buildLocalizedPath, normalizeLocale } from "@/lib/i18n/routing";
import { buildAbsoluteUrl } from "@/lib/url";
import { toText } from "@/lib/utils";
import type { LangAsyncPageProps } from "@/lib/types/next";
import type { PAGE_QUERYResult } from "@/sanity.types";
import LdScript from "@/components/seo/ld-script";

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
    if (
      process.env.LOG_HREFLANG === "1" ||
      process.env.NEXT_PUBLIC_LOG_HREFLANG === "1"
    ) {
      // eslint-disable-next-line no-console
      console.info(
        JSON.stringify(
          {
            tag: "hreflang",
            note: "pagination/sort page returning canonical-only alternates",
            page: "blog-index",
            locale,
            pageNum,
            sort,
            canonical: basePath,
          },
          null,
          2
        )
      );
    }
    return {
      ...withRss,
      robots: "noindex",
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
  // Fetch the blog page document to render an optional Section Header block
  const pageDoc = await fetchSanityPageBySlug({ slug: "blog", lang: locale });
  type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
  // Extract hero blocks so they can render above the list
  const heroBlocks = (pageDoc?.blocks || []).filter(
    (b) => typeof b?._type === "string" && b._type.startsWith("hero-")
  ) as unknown as Block[];
  const sectionHeader = (pageDoc?.blocks || []).find(
    (b): b is Extract<Block, { _type: "section-header" }> =>
      b?._type === "section-header"
  );
  const totalPages = Math.max(1, Math.ceil((totalCount || 0) / POSTS_PER_PAGE));
  if (page > totalPages) notFound();

  const items: PostsListItem[] = (posts || []).map((p) => ({
    _id: p._id || "",
    slug: p.slug?.current || "",
    title: toText(p.title),
    createdAt: p._createdAt || null,
    excerpt: toText(p.excerpt),
    imageUrl: p.image?.asset?.url || null,
    imageAlt: (() => {
      const alt = (p.image as { alt?: unknown } | null | undefined)?.alt;
      return typeof alt === "string" ? alt : null;
    })(),
    imageMeta: p.image?.asset?.metadata || null,
    author: {
      name: toText(p.author?.name),
      title: toText(p.author?.title),
      imageUrl: p.author?.image?.asset?.url || null,
    },
    categories: Array.isArray(p.categories)
      ? p.categories.map((c) => ({
          _id: c?._id || undefined,
          title: toText(c?.title),
          slug: c?.slug || null,
        }))
      : null,
  }));

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
    ],
  } as const;

  // JSON-LD: CollectionPage with ItemList of current page's posts
  // Derive description with fallback to Section Header rich/plain text
  const sectionHeaderDescription = (() => {
    if (!sectionHeader) return undefined;
    const rich = (sectionHeader as unknown as { richDescription?: unknown })
      .richDescription;
    if (Array.isArray(rich)) {
      const plain = (
        rich as Array<{ _type?: string; children?: Array<{ text?: string }> }>
      )
        .filter((b) => b?._type === "block")
        .flatMap((b) => (b.children ?? []).map((c) => c?.text ?? ""))
        .join(" ")
        .trim();
      if (plain) return plain;
    }
    const desc = (sectionHeader as unknown as { description?: unknown })
      .description;
    return toText(desc) || undefined;
  })();

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    inLanguage: locale,
    name: "Blog",
    "@id": buildAbsoluteUrl(locale, "/blog"),
    url: buildAbsoluteUrl(locale, "/blog"),
    description:
      toText(
        (pageDoc as unknown as { meta?: { description?: unknown } })?.meta
          ?.description
      ) ||
      sectionHeaderDescription ||
      undefined,
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
  };

  return (
    <section className="container py-16 xl:py-20">
      <LdScript json={breadcrumbLd} />
      <LdScript json={collectionLd} />
      {page === 1 && sort === "newest" && heroBlocks.length > 0 && (
        <div className="mb-8">
          <Blocks blocks={heroBlocks} locale={locale} />
        </div>
      )}
      {sectionHeader ? (
        <SectionHeader {...sectionHeader} locale={locale} />
      ) : (
        <h1 className="text-3xl font-serif font-semibold md:text-5xl">Blog</h1>
      )}
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
