import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import Pagination from "@/components/pagination";
import Link from "next/link";
import PostDate from "@/components/post-date";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  fetchSanityCategoryBySlug,
  fetchSanityCategoriesStaticParams,
  fetchSanityPostsByCategory,
  fetchSanityPostsByCategoryCount,
} from "@/sanity/lib/fetch";
import { getOgImageUrl } from "@/sanity/lib/fetch";

export async function generateStaticParams() {
  const categories = await fetchSanityCategoriesStaticParams();
  return categories.map((cat: { slug?: { current?: string } }) => ({
    slug: cat.slug?.current,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const category = await fetchSanityCategoryBySlug({ slug: params.slug });
  if (!category) notFound();
  return {
    title: category.seo?.title || category.title || "Category",
    description: category.seo?.metaDescription || category.description,
    alternates: {
      canonical: `/categories/${params.slug}`,
    },
    openGraph: {
      images: [
        {
          url: getOgImageUrl({
            type: "page",
            slug: `categories/${params.slug}`,
          }),
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const { slug } = await props.params;
  const currentPage = props.searchParams
    ? parseInt((await props.searchParams).page || "1")
    : 1;

  const category = await fetchSanityCategoryBySlug({ slug });
  if (!category) notFound();

  const POSTS_PER_PAGE = 6;
  const [posts, total] = await Promise.all([
    fetchSanityPostsByCategory({
      slug,
      page: currentPage,
      limit: POSTS_PER_PAGE,
    }),
    fetchSanityPostsByCategoryCount({ slug }),
  ]);

  const totalPages = Math.ceil((total || 0) / POSTS_PER_PAGE) || 1;

  const links = [
    { label: "Categories", href: "/categories" },
    { label: category.title || "Category", href: "#" },
  ];

  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (pageNum > 1) params.set("page", pageNum.toString());
    return `/categories/${slug}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
  };

  return (
    <section className="container py-16 xl:py-20">
      <Breadcrumbs links={links} />
      <h1 className="mt-7 mb-3 text-3xl font-semibold md:text-5xl">
        {category.title}
      </h1>
      {category.description && (
        <p className="mb-8 max-w-2xl text-muted-foreground">
          {category.description}
        </p>
      )}
      <Separator />

      <div>
        {posts?.length ? (
          posts.map((post: any) => (
            <div
              key={post._id}
              className="grid grid-cols-1 gap-6 py-8 lg:grid-cols-4"
            >
              <div className="hidden items-center gap-3 self-start lg:flex">
                <Avatar className="size-12">
                  <AvatarImage src={post.author?.image?.asset?.url || ""} />
                  <AvatarFallback>
                    {post.author?.name?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">{post.author?.name}</span>
                  {post.author?.title && (
                    <span className="text-sm text-muted-foreground">
                      {post.author?.title}
                    </span>
                  )}
                </div>
              </div>
              <div className="col-span-2 max-w-xl">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <PostDate date={post._createdAt} />
                  <span className="inline lg:hidden">
                    {" "}
                    - {post.author?.name}
                  </span>
                </span>
                <h3 className="text-2xl font-bold hover:underline lg:text-3xl">
                  {post.title && (
                    <Link href={`/blog/${post.slug?.current}`}>
                      {post.title}
                    </Link>
                  )}
                </h3>
              </div>
              <Link
                href={`/blog/${post.slug?.current}`}
                className="ml-auto hidden lg:flex h-9 w-9 items-center justify-center rounded-md border px-0"
                aria-label="Read more"
              >
                <span className="sr-only">Read more</span>→
              </Link>
            </div>
          ))
        ) : (
          <p className="py-8 text-sm text-muted-foreground">
            No posts in this category yet.
          </p>
        )}
        <Separator />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        createPageUrl={createPageUrl}
        className="mt-8"
      />
    </section>
  );
}
