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

type AllProducts16Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "all-products-16" }
>;

export default async function AllProducts16({
  padding,
  searchParams,
}: AllProducts16Props & {
  searchParams?: Promise<{
    page?: string;
    category?: string;
  }>;
}) {
  const PAGE_SIZE = 12;
  const params = searchParams ? await searchParams : undefined;
  const currentPage = params?.page ? Math.max(1, parseInt(params.page)) : 1;
  const activeCategory = params?.category || undefined;

  const [products, total] = await Promise.all(
    activeCategory
      ? [
          fetchSanityProductsByCategory({
            slug: activeCategory,
            page: currentPage,
            limit: PAGE_SIZE,
          }),
          fetchSanityProductsCountByCategory({ slug: activeCategory }),
        ]
      : [
          fetchSanityProducts({ page: currentPage, limit: PAGE_SIZE }),
          fetchSanityProductsCount(),
        ]
  );

  const categoryDoc = activeCategory
    ? await fetchSanityProductCategoryBySlug({ slug: activeCategory })
    : null;
  const isInvalidCategory = Boolean(activeCategory && !categoryDoc);

  const totalPages = Math.max(1, Math.ceil((total || 0) / PAGE_SIZE));

  const baseUrl = "/products";
  const baseSearchParams = new URLSearchParams();
  if (activeCategory) baseSearchParams.set("category", activeCategory);

  const isEmpty = !products || products.length === 0;

  const items: ProductsTableItem[] = (products || []).map((p) => {
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
      features: Array.isArray(p.keyFeatures) ? p.keyFeatures.slice(0, 3) : null,
      productAttributes: spec?.productAttributes || null,
      purity: spec?.purity || null,
      categories: Array.isArray(p.categories)
        ? p.categories.map((c) => ({
            _id: c?._id || undefined,
            title: c?.title || null,
            slug: c?.slug?.current || null,
          }))
        : null,
      href: `/products/${p.slug?.current || ""}`,
    };
  });

  return (
    <SectionContainer padding={padding}>
      <ProductsTable
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
                    ? "Category not found."
                    : "No products found in this category."}
                </p>
                <p className="mt-2">
                  <Link className="underline" href="/products">
                    Clear filter
                  </Link>
                </p>
              </>
            ) : (
              <p>No products found.</p>
            )}
          </div>
        }
      />
    </SectionContainer>
  );
}
