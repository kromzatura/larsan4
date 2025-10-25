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
import ProductGrid from "@/components/products/ProductGrid";
import { normalizeLocale, buildLocalizedPath } from "@/lib/i18n/routing";
// no FALLBACK_LOCALE needed
import type { AsyncPageProps } from "@/lib/types/next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { mapProductToProductsTableItem } from "@/sanity/lib/mappers";
import { toText } from "@/lib/utils";

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
    const result = {
      ...base,
      ...(pageNum > 1
        ? {
            robots: {
              index: false,
              follow: true,
            },
          }
        : {}),
    };
    if (
      pageNum > 1 &&
      (process.env.LOG_HREFLANG === "1" ||
        process.env.NEXT_PUBLIC_LOG_HREFLANG === "1")
    ) {
      // eslint-disable-next-line no-console
      console.info(
        JSON.stringify(
          {
            tag: "hreflang",
            note: "pagination category page returning canonical-only alternates",
            page: "product-category",
            locale,
            slug: params.slug,
            pageNum,
            canonical: buildLocalizedPath(
              locale,
              `/products/category/${params.slug}`
            ),
          },
          null,
          2
        )
      );
    }
    return result;
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
      <div className="mt-7 grid gap-3 md:grid-cols-[1fr_auto] md:items-end md:gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-serif font-semibold leading-tight md:text-5xl">
            {catTitle}
          </h1>
          {catDescription && (
            <p className="mt-3 max-w-3xl text-muted-foreground">
              {catDescription}
            </p>
          )}
        </div>
        <div className="md:justify-end md:ml-0 ml-auto flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">
            {dictionary.products.categoryPage.labelSort}
          </span>
          <Link
            href={`${baseUrl}?sort=newest`}
            aria-pressed={sort === "newest"}
            className={`inline-flex items-center rounded-md border px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              sort === "newest" ? "bg-muted" : "hover:bg-muted"
            }`}
          >
            {dictionary.products.categoryPage.sortNewest}
          </Link>
          <Link
            href={`${baseUrl}?sort=az`}
            aria-pressed={sort === "az"}
            className={`inline-flex items-center rounded-md border px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              sort === "az" ? "bg-muted" : "hover:bg-muted"
            }`}
          >
            {dictionary.products.categoryPage.sortAZ}
          </Link>
          <Link
            href={`${baseUrl}?sort=za`}
            aria-pressed={sort === "za"}
            className={`inline-flex items-center rounded-md border px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              sort === "za" ? "bg-muted" : "hover:bg-muted"
            }`}
          >
            {dictionary.products.categoryPage.sortZA}
          </Link>
        </div>
      </div>

      <div className="mt-10">
        {(() => {
          const items: ProductsTableItem[] = (products || []).map((p) =>
            mapProductToProductsTableItem(p, locale)
          );
          const sharedProps = {
            labels: {
              headerProduct: dictionary.products.table.headerProduct,
              headerCategory: dictionary.products.table.headerCategory,
              headerKeyFeatures: dictionary.products.table.headerKeyFeatures,
              headerAttributes: dictionary.products.table.headerAttributes,
              headerAction: dictionary.products.table.headerAction,
              labelSku: dictionary.products.table.labelSku,
              labelPurity: dictionary.products.table.labelPurity,
              emptyState: dictionary.products.table.emptyState,
            },
            items,
            page,
            pageCount: totalPages,
            baseUrl,
            baseSearchParams: baseSearchParams.toString(),
            emptyState: (
              <div className="rounded-lg border p-8 text-center text-muted-foreground">
                {dictionary.products.categoryPage.emptyState}
              </div>
            ),
            locale,
          } as const;

          return (
            <>
              {/* Mobile: ProductsTable renders list */}
              <div className="block md:hidden">
                <ProductsTable {...sharedProps} className="mb-12" />
              </div>
              {/* Tablet: ProductGrid */}
              <div className="hidden md:block xl:hidden">
                <ProductGrid {...sharedProps} className="mb-12" />
              </div>
              {/* Desktop: ProductsTable renders full table */}
              <div className="hidden xl:block">
                <ProductsTable {...sharedProps} className="mb-12" />
              </div>
            </>
          );
        })()}
      </div>
    </section>
  );
}
