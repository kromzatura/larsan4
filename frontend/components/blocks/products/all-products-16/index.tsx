import Link from "next/link";
import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import {
  fetchSanityProducts,
  fetchSanityProductsCount,
  fetchSanityProductsByCategory,
  fetchSanityProductsCountByCategory,
} from "@/sanity/lib/fetch";
import ProductsTable, {
  ProductsTableItem,
} from "@/components/products/products-table";
import ProductGrid from "@/components/products/ProductGrid";
import { fetchSanityProductCategoryBySlug } from "@/sanity/lib/fetch";
import { buildLocalizedPath } from "@/lib/i18n/routing";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { mapProductToProductsTableItem } from "@/sanity/lib/mappers";
import { toText } from "@/lib/utils";

type AllProducts16Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "all-products-16" }
>;

export default async function AllProducts16({
  padding,
  searchParams,
  locale = FALLBACK_LOCALE,
}: AllProducts16Props & {
  searchParams?: {
    page?: string;
    category?: string;
    sort?: "newest" | "az" | "za";
  };
  locale?: SupportedLocale;
}) {
  const dictionary = await getDictionary(locale);
  const PAGE_SIZE = 12;
  const params = searchParams;
  const currentPage = params?.page ? Math.max(1, parseInt(params.page)) : 1;
  const activeCategory = params?.category || undefined;
  const sort = (params?.sort as "newest" | "az" | "za") || "newest";

  const [products, total] = await Promise.all(
    activeCategory
      ? [
          fetchSanityProductsByCategory({
            slug: activeCategory,
            page: currentPage,
            limit: PAGE_SIZE,
            sort,
            lang: locale,
          }),
          fetchSanityProductsCountByCategory({
            slug: activeCategory,
            lang: locale,
          }),
        ]
      : [
          fetchSanityProducts({
            page: currentPage,
            limit: PAGE_SIZE,
            lang: locale,
          }),
          fetchSanityProductsCount({ lang: locale }),
        ]
  );

  const categoryDoc = activeCategory
    ? await fetchSanityProductCategoryBySlug({
        slug: activeCategory,
        lang: locale,
      })
    : null;
  const isInvalidCategory = Boolean(activeCategory && !categoryDoc);

  const totalPages = Math.max(1, Math.ceil((total || 0) / PAGE_SIZE));

  const baseUrl = buildLocalizedPath(locale, "/products");
  const baseSearchParams = new URLSearchParams();
  if (activeCategory) baseSearchParams.set("category", activeCategory);
  if (activeCategory && sort) baseSearchParams.set("sort", sort);

  const items: ProductsTableItem[] = (products || []).map((p) =>
    mapProductToProductsTableItem(p, locale)
  );

  const catTitle = activeCategory
    ? toText((categoryDoc as unknown as { title?: unknown })?.title) || ""
    : "";
  const catDescription = activeCategory
    ? toText(
        (categoryDoc as unknown as { description?: unknown })?.description
      ) || ""
    : "";

  return (
    <SectionContainer padding={padding}>
      {activeCategory && (
        <div className="mb-6 mt-2 grid gap-3 md:grid-cols-[1fr_auto] md:items-end md:gap-4">
          <div className="min-w-0">
            <h2 className="text-2xl font-serif font-semibold leading-tight md:text-4xl">
              {catTitle || dictionary.products.categoryPage.breadcrumbCategory}
            </h2>
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
              href={`${baseUrl}?category=${activeCategory}&sort=newest`}
              aria-pressed={sort === "newest"}
              className={`inline-flex items-center rounded-md border px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                sort === "newest" ? "bg-muted" : "hover:bg-muted"
              }`}
            >
              {dictionary.products.categoryPage.sortNewest}
            </Link>
            <Link
              href={`${baseUrl}?category=${activeCategory}&sort=az`}
              aria-pressed={sort === "az"}
              className={`inline-flex items-center rounded-md border px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                sort === "az" ? "bg-muted" : "hover:bg-muted"
              }`}
            >
              {dictionary.products.categoryPage.sortAZ}
            </Link>
            <Link
              href={`${baseUrl}?category=${activeCategory}&sort=za`}
              aria-pressed={sort === "za"}
              className={`inline-flex items-center rounded-md border px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                sort === "za" ? "bg-muted" : "hover:bg-muted"
              }`}
            >
              {dictionary.products.categoryPage.sortZA}
            </Link>
          </div>
        </div>
      )}
      {(() => {
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
          page: currentPage,
          pageCount: totalPages,
          baseUrl,
          baseSearchParams: baseSearchParams.toString(),
          emptyState: (
            <div className="rounded-lg border p-8 text-center text-muted-foreground">
              {activeCategory ? (
                <>
                  <p>
                    {isInvalidCategory
                      ? dictionary.products.listingBlock
                          .emptyStateCategoryNotFound
                      : dictionary.products.listingBlock
                          .emptyStateNoProductsInCategory}
                  </p>
                  <p className="mt-2">
                    <Link className="underline" href={baseUrl}>
                      {dictionary.products.listingBlock.actionClearFilter}
                    </Link>
                  </p>
                </>
              ) : (
                <p>{dictionary.products.listingBlock.emptyStateGeneral}</p>
              )}
            </div>
          ),
          locale,
        } as const;

        return (
          <>
            {/* Mobile: list inside ProductsTable */}
            <div className="block md:hidden">
              <ProductsTable {...sharedProps} className="mb-12" />
            </div>
            {/* Tablet: grid for visual layout */}
            <div className="hidden md:block xl:hidden">
              <ProductGrid {...sharedProps} className="mb-12" />
            </div>
            {/* Desktop: full table */}
            <div className="hidden xl:block">
              <ProductsTable {...sharedProps} className="mb-12" />
            </div>
          </>
        );
      })()}
    </SectionContainer>
  );
}
