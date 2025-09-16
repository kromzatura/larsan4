import Link from "next/link";
import { notFound } from "next/navigation";
import PostsList, { PostsListItem } from "@/components/posts/posts-list";
import {
  fetchSanityBlogCategoriesStaticParams,
  fetchSanityBlogCategoryBySlug,
  fetchSanityPostsByBlogCategory,
  fetchSanityPostsCountByBlogCategory,
} from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";

const POSTS_PER_PAGE = 6;

export async function generateStaticParams() {
  const cats = await fetchSanityBlogCategoriesStaticParams();
  return cats
    .filter((c) => c.slug?.current)
    .map((c) => ({ slug: c.slug.current }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await props.params;
  const sp = props.searchParams ? await props.searchParams : undefined;
  const pageNum = Math.max(1, Number(sp?.page || 1));
  const cat = await fetchSanityBlogCategoryBySlug({ slug: params.slug });
  if (!cat) notFound();
  const base = generatePageMetadata({
    page: cat as any,
    slug: `blog/category/${params.slug}`,
    type: "page",
  });
  if (pageNum > 1) {
    return {
      ...base,
      robots: "noindex",
      alternates: { canonical: `/blog/category/${params.slug}` },
    } as any;
  }
  return base as any;
}

export default async function BlogCategoryPage(props: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await props.params;
  const sp = props.searchParams ? await props.searchParams : undefined;
  const page = Math.max(1, Number(sp?.page || 1));
  const sortParam = (sp as any)?.sort;
  const sort: "newest" | "az" | "za" =
    sortParam === "az" || sortParam === "za" ? sortParam : "newest";

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

  const baseUrl = `/blog/category/${params.slug}`;
  const baseSearchParams = sort && sort !== "newest" ? `sort=${sort}` : "";

  return (
    <section className="container py-16 xl:py-20">
      <h1 className="text-3xl font-semibold md:text-5xl">{cat.title}</h1>
      {cat.description && (
        <p className="mt-3 max-w-3xl text-muted-foreground">
          {cat.description}
        </p>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={`${baseUrl}`}
          prefetch
          className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background ${
            sort === "newest" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Newest
        </Link>
        <Link
          href={`${baseUrl}?sort=az`}
          prefetch
          className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background ${
            sort === "az" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          A–Z
        </Link>
        <Link
          href={`${baseUrl}?sort=za`}
          prefetch
          className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background ${
            sort === "za" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Z–A
        </Link>
      </div>
      <div className="mt-8">
        <PostsList
          items={items}
          page={page}
          pageCount={totalPages}
          baseUrl={baseUrl}
          baseSearchParams={baseSearchParams}
          activeCategorySlug={params.slug}
        />
      </div>
    </section>
  );
}
