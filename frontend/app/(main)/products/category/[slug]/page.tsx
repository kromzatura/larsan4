import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import {
  fetchSanityProductCategoriesStaticParams,
  fetchSanityProductsByCategory,
  fetchSanityProductsCountByCategory,
  fetchSanityProductCategoryBySlug,
} from "@/sanity/lib/fetch";
import ProductsTable, {
  ProductsTableItem,
} from "@/components/products/products-table";
import { urlFor } from "@/sanity/lib/image";
import { normalizeLocale, buildLocalizedPath } from "@/lib/i18n/routing";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";
import type { AsyncPageProps } from "@/lib/types/next";

const PAGE_SIZE = 12;

export async function generateStaticParams() {
  const cats = await fetchSanityProductCategoriesStaticParams({
    lang: FALLBACK_LOCALE,
  });
  return cats
    .filter((c) => c.slug?.current)
    .map((c) => ({ slug: c.slug!.current! }));
}

export async function generateMetadata(
  props: AsyncPageProps<{ slug: string; lang?: string }, { page?: string }>
) {
  const params = (await props.params)!;
  const searchParams = (await props.searchParams) || {};
  const locale = normalizeLocale(params.lang);
  const pageNum = Math.max(1, Number(searchParams?.page || 1));
  const cat = await fetchSanityProductCategoryBySlug({
    slug: params.slug,
    lang: locale,
  });
  if (!cat) notFound();
  const base = await generatePageMetadata({
    page: cat,
    slug: `products/category/${params.slug}`,
    type: "productCategory",
  });
  return {
    ...base,
    ...(pageNum > 1
      ? {
          robots: {
            index: false,
            follow: false,
          },
          alternates: {
            canonical: buildLocalizedPath(
              locale,
              `/products/category/${params.slug}`
            ),
          },
        }
      : {}),
  };
}

export default async function CategoryPage(
  props: AsyncPageProps<
    { slug: string; lang?: string },
    { page?: string; sort?: "newest" | "az" | "za" }
  >
) {
  const params = (await props.params)!;
  const searchParams = (await props.searchParams) || {};
  const locale = normalizeLocale(params.lang);
  const page = Math.max(1, Number(searchParams?.page || 1));
  const sort = (searchParams?.sort as "newest" | "az" | "za") || "newest";

  const [cat, products, totalCount] = await Promise.all([
    fetchSanityProductCategoryBySlug({ slug: params.slug, lang: locale }),
    fetchSanityProductsByCategory({
      slug: params.slug,
      page,
      limit: PAGE_SIZE,
      sort,
      lang: locale,
    }),
    fetchSanityProductsCountByCategory({ slug: params.slug, lang: locale }),
  ]);
  if (!cat) notFound();
  const totalPages = Math.max(1, Math.ceil((totalCount || 0) / PAGE_SIZE));
  const baseUrl = buildLocalizedPath(
    locale,
    `/products/category/${params.slug}`
  );
  const baseSearchParams = new URLSearchParams();
  if (sort) baseSearchParams.set("sort", sort);

  const productsPath = buildLocalizedPath(locale, "/products");
  const links = [
    { label: "Products", href: productsPath },
    {
      label: cat.title ?? "Category",
      href: baseUrl,
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
            href={`${baseUrl}?sort=newest`}
            className={`rounded-md border px-2 py-1 ${
              sort === "newest" ? "bg-muted" : "hover:bg-muted"
            }`}
          >
            Newest
          </Link>
          <Link
            href={`${baseUrl}?sort=az`}
            className={`rounded-md border px-2 py-1 ${
              sort === "az" ? "bg-muted" : "hover:bg-muted"
            }`}
          >
            A–Z
          </Link>
          <Link
            href={`${baseUrl}?sort=za`}
            className={`rounded-md border px-2 py-1 ${
              sort === "za" ? "bg-muted" : "hover:bg-muted"
            }`}
          >
            Z–A
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <ProductsTable
          items={(products || []).map<ProductsTableItem>((p) => {
            const spec = Array.isArray(p.specifications)
              ? p.specifications[0]
              : undefined;
            return {
              _id: p._id || "",
              slug: p.slug?.current || "",
              title: p.title || null,
              sku: spec?.sku || null,
              imageUrl: p.image?.asset?._id
                ? urlFor(p.image).width(96).height(64).fit("crop").url()
                : undefined,
              features: Array.isArray(p.keyFeatures)
                ? p.keyFeatures.slice(0, 3)
                : null,
              productAttributes: spec?.productAttributes || null,
              purity: spec?.purity || null,
              categories: Array.isArray(p.categories)
                ? p.categories.map((c) => ({
                    _id: c?._id || undefined,
                    title: c?.title || null,
                    slug: c?.slug?.current || null,
                    href: buildLocalizedPath(
                      locale,
                      `/products?category=${c?.slug?.current || ""}`
                    ),
                  }))
                : null,
              href: buildLocalizedPath(
                locale,
                `/products/${p.slug?.current || ""}`
              ),
            };
          })}
          page={page}
          pageCount={totalPages}
          baseUrl={baseUrl}
          baseSearchParams={baseSearchParams.toString()}
          emptyState={
            <div className="rounded-lg border p-8 text-center text-muted-foreground">
              No products in this category yet.
            </div>
          }
          locale={locale}
        />
      </div>
    </section>
  );
}
