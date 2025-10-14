import Link from "next/link";
import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import {
  fetchSanityProducts,
  fetchSanityProductsCount,
  fetchSanityProductsByCategory,
  fetchSanityProductsCountByCategory,
} from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import ProductsTable, {
  ProductsTableItem,
} from "@/components/products/products-table";
import { fetchSanityProductCategoryBySlug } from "@/sanity/lib/fetch";
import { buildLocalizedPath } from "@/lib/i18n/routing";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { mapProductToProductsTableItem } from "@/sanity/lib/mappers";

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
  };
  locale?: SupportedLocale;
}) {
  const dictionary = await getDictionary(locale);
  const PAGE_SIZE = 12;
  const params = searchParams;
  const currentPage = params?.page ? Math.max(1, parseInt(params.page)) : 1;
  const activeCategory = params?.category || undefined;

  const [products, total] = await Promise.all(
    activeCategory
      ? [
          fetchSanityProductsByCategory({
            slug: activeCategory,
            page: currentPage,
            limit: PAGE_SIZE,
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

  const items: ProductsTableItem[] = (products || []).map((p) =>
    mapProductToProductsTableItem(p as any, locale)
  );

  return (
    <SectionContainer padding={padding}>
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
        items={items}
        page={currentPage}
        pageCount={totalPages}
        baseUrl={baseUrl}
        baseSearchParams={baseSearchParams.toString()}
        emptyState={
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
        }
        locale={locale}
        className="mb-12"
      />
    </SectionContainer>
  );
}
