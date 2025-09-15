import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import Pagination from "@/components/pagination";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { urlFor } from "@/sanity/lib/image";
import {
  fetchSanityProductCategoriesStaticParams,
  fetchSanityProductsByCategory,
  fetchSanityProductsCountByCategory,
  fetchSanityProductCategoryBySlug,
} from "@/sanity/lib/fetch";
import type {
  PRODUCT_CATEGORIES_QUERYResult,
  PRODUCTS_QUERYResult,
} from "@/sanity.types";

const PAGE_SIZE = 12;

export async function generateStaticParams() {
  const cats = await fetchSanityProductCategoriesStaticParams();
  return cats
    .filter((c) => c.slug?.current)
    .map((c) => ({ slug: c.slug!.current! }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const cat = await fetchSanityProductCategoryBySlug({ slug: params.slug });
  if (!cat) notFound();
  return generatePageMetadata({
    page: cat,
    slug: `products/category/${params.slug}`,
    type: "productCategory",
  });
}

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: "newest" | "az" | "za" }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const page = Math.max(1, Number(searchParams?.page || 1));
  const sort = (searchParams?.sort as "newest" | "az" | "za") || "newest";

  const [cat, products, totalCount] = await Promise.all([
    fetchSanityProductCategoryBySlug({ slug: params.slug }),
    fetchSanityProductsByCategory({
      slug: params.slug,
      page,
      limit: PAGE_SIZE,
      sort,
    }),
    fetchSanityProductsCountByCategory({ slug: params.slug }),
  ]);
  if (!cat) notFound();
  const totalPages = Math.max(1, Math.ceil((totalCount || 0) / PAGE_SIZE));
  const createPageUrl = (n: number) =>
    `/products/category/${params.slug}${n && n > 1 ? `?page=${n}` : ""}`;

  const links = [
    { label: "Products", href: "/products" },
    {
      label: cat.title ?? "Category",
      href: `/products/category/${params.slug}`,
    },
  ];

  return (
    <section className="container py-16 xl:py-20">
      <Breadcrumbs links={links} />
      <div className="mt-7 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold md:text-5xl">{cat.title}</h1>
          {cat.description && (
            <p className="mt-3 max-w-3xl text-muted-foreground">
              {cat.description}
            </p>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Sort</span>
          <Link
            href={`/products/category/${params.slug}?sort=newest`}
            className={`rounded-md border px-2 py-1 ${
              sort === "newest" ? "bg-muted" : "hover:bg-muted"
            }`}
          >
            Newest
          </Link>
          <Link
            href={`/products/category/${params.slug}?sort=az`}
            className={`rounded-md border px-2 py-1 ${
              sort === "az" ? "bg-muted" : "hover:bg-muted"
            }`}
          >
            A–Z
          </Link>
          <Link
            href={`/products/category/${params.slug}?sort=za`}
            className={`rounded-md border px-2 py-1 ${
              sort === "za" ? "bg-muted" : "hover:bg-muted"
            }`}
          >
            Z–A
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="mt-10 rounded-lg border p-8 text-center text-muted-foreground">
          No products in this category yet.
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article
              key={p._id}
              className="group overflow-hidden rounded-lg border"
            >
              <Link
                href={`/products/${p.slug?.current || ""}`}
                className="block"
              >
                {p.image?.asset?._id && (
                  <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                    <Image
                      src={urlFor(p.image)
                        .width(800)
                        .height(600)
                        .fit("crop")
                        .url()}
                      alt={p.image.alt || p.title || ""}
                      width={800}
                      height={600}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-lg font-semibold leading-snug">
                    {p.title}
                  </h2>
                  {p.excerpt && (
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {p.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}

      <div className="mt-10">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          createPageUrl={createPageUrl}
        />
      </div>
    </section>
  );
}
