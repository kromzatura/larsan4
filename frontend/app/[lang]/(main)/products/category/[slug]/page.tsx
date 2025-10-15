import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import {
  fetchSanityProductsByCategory,
  fetchSanityProductsCountByCategory,
  fetchSanityProductCategoryBySlug,
} from "@/sanity/lib/fetch";
import ProductsTable, {
  ProductsTableItem,
} from "@/components/products/products-table";
import { normalizeLocale, buildLocalizedPath } from "@/lib/i18n/routing";
// no FALLBACK_LOCALE needed
import type { AsyncPageProps } from "@/lib/types/next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { mapProductToProductsTableItem } from "@/sanity/lib/mappers";
import { toText } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_SIZE = 12;

export async function generateMetadata(
  props: AsyncPageProps<{ slug: string; lang?: string }, { page?: string }>
) {
  const params = (await props.params)!;
  const searchParams = (await props.searchParams) || {};
  const locale = normalizeLocale(params.lang);
  const pageNum = Math.max(1, Number(searchParams?.page || 1));
  try {
    const cat = await fetchSanityProductCategoryBySlug({
      slug: params.slug,
      lang: locale,
    });
    if (!cat) notFound();
    const base = await generatePageMetadata({
      page: cat,
      slug: `products/category/${params.slug}`,
      type: "productCategory",
      locale,
    });
    return {
      ...base,
      ...(pageNum > 1
        ? {
            robots: {
              index: false,
              follow: true,
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[metadata] product category failed", {
      slug: params.slug,
      locale,
      error: message,
    });
    // Fail-safe: return empty metadata to avoid a 500 due to metadata errors
    return {} as {
      title?: string;
      description?: string;
      robots?: unknown;
      alternates?: unknown;
    };
  }
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
  const dictionary = await getDictionary(locale);
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
  const catTitle =
    toText(cat.title) || dictionary.products.categoryPage.breadcrumbCategory;
  const catDescription = toText(cat.description);
  const links = [
    {
      label: dictionary.products.categoryPage.breadcrumbProducts,
      href: productsPath,
    },
    {
      label: catTitle ?? dictionary.products.categoryPage.breadcrumbCategory,
      href: baseUrl,
    },
  ];

  return (
    <section className="container py-16 xl:py-20">
      <Breadcrumbs links={links} locale={locale} />
      <div className="mt-7 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-semibold md:text-5xl">
            {catTitle}
          </h1>
          {catDescription && (
            <p className="mt-3 max-w-3xl text-muted-foreground">
              {catDescription}
            </p>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">
            {dictionary.products.categoryPage.labelSort}
          </span>
          <Link
            href={`${baseUrl}?sort=newest`}
            className={`rounded-md border px-2 py-1 ${
              sort === "newest" ? "bg-muted" : "hover:bg-muted"
            }`}
          >
            {dictionary.products.categoryPage.sortNewest}
          </Link>
          <Link
            href={`${baseUrl}?sort=az`}
            className={`rounded-md border px-2 py-1 ${
              sort === "az" ? "bg-muted" : "hover:bg-muted"
            }`}
          >
            {dictionary.products.categoryPage.sortAZ}
          </Link>
          <Link
            href={`${baseUrl}?sort=za`}
            className={`rounded-md border px-2 py-1 ${
              sort === "za" ? "bg-muted" : "hover:bg-muted"
            }`}
          >
            {dictionary.products.categoryPage.sortZA}
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <ProductsTable
          labels={{
            headerProduct: dictionary.products.table.headerProduct,
            headerCategory: dictionary.products.table.headerCategory,
            headerKeyFeatures: dictionary.products.table.headerKeyFeatures,
            headerAttributes: dictionary.products.table.headerAttributes,
            headerAction: dictionary.products.table.headerAction,
            labelSku: dictionary.products.table.labelSku,
            labelPurity: dictionary.products.table.labelPurity,
            emptyState: dictionary.products.table.emptyState,
          }}
          items={(products || []).map<ProductsTableItem>((p) =>
            mapProductToProductsTableItem(p, locale)
          )}
          page={page}
          pageCount={totalPages}
          baseUrl={baseUrl}
          baseSearchParams={baseSearchParams.toString()}
          emptyState={
            <div className="rounded-lg border p-8 text-center text-muted-foreground">
              {dictionary.products.categoryPage.emptyState}
            </div>
          }
          locale={locale}
          className="mb-12"
        />
      </div>
    </section>
  );
}
