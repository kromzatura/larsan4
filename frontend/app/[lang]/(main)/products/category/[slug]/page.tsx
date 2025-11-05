import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import Blocks from "@/components/blocks";
import { PAGE_QUERYResult } from "@/sanity.types";
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
import { buildAbsoluteUrl } from "@/lib/url";

const PAGE_SIZE = 12;

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

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const homeUrl = buildAbsoluteUrl(locale, "/");
  const productsUrl = `${SITE_URL}${buildLocalizedPath(locale, "/products")}`;
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    inLanguage: locale,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: homeUrl },
      { "@type": "ListItem", position: 2, name: "Products", item: productsUrl },
      {
        "@type": "ListItem",
        position: 3,
        name: catTitle,
        item: `${SITE_URL}${baseUrl}`,
      },
    ],
  } as const;

  // JSON-LD: CollectionPage with ItemList of the current page's products
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    inLanguage: locale,
    name: catTitle,
    url: `${SITE_URL}${baseUrl}`,
    description: catDescription || undefined,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalCount || 0,
      itemListElement: (products || []).map((p, idx) => ({
        "@type": "ListItem",
        position: (page - 1) * PAGE_SIZE + idx + 1,
        name: p?.title || undefined,
        url: `${SITE_URL}${buildLocalizedPath(
          locale,
          `/products/${p?.slug?.current ?? ""}`
        )}`,
      })),
    },
  };

  const categoryBlocks = (cat.blocks ?? []) as NonNullable<
    NonNullable<PAGE_QUERYResult>["blocks"]
  >;
  const categoryBlocksAfter = (cat as unknown as {
    blocksAfter?: NonNullable<PAGE_QUERYResult>["blocks"];
  }).blocksAfter || ([] as NonNullable<PAGE_QUERYResult>["blocks"]);

  return (
    <section className="container py-16 xl:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <Breadcrumbs links={links} locale={locale} />
      {Array.isArray(cat.blocks) && cat.blocks.length > 0 ? (
        <div className="mt-7">
          <Blocks blocks={categoryBlocks} locale={locale} />
        </div>
      ) : (
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
      )}
      {/* When a Section Header is used, keep the sort toolbar accessible below */}
      {Array.isArray(cat.blocks) && cat.blocks.length > 0 && (
        <div className="mt-6 md:flex md:justify-end ml-auto flex flex-wrap items-center gap-2 text-sm">
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
      )}

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
              {Array.isArray(categoryBlocksAfter) &&
                categoryBlocksAfter.length > 0 && (
                  <div className="mt-12">
                    <Blocks blocks={categoryBlocksAfter} locale={locale} />
                  </div>
                )}
            </>
          );
        })()}
      </div>
    </section>
  );
}
