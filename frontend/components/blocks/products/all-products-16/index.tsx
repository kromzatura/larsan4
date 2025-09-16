import Image from "next/image";
import Link from "next/link";
import SectionContainer from "@/components/ui/section-container";
import { Badge } from "@/components/ui/badge";
import { PAGE_QUERYResult } from "@/sanity.types";
import {
  fetchSanityProducts,
  fetchSanityProductsCount,
  fetchSanityProductsByCategory,
  fetchSanityProductsCountByCategory,
} from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import Pagination from "@/components/pagination";
import AddToInquiryButton from "@/components/inquiry/add-to-inquiry-button";

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

  const totalPages = Math.max(1, Math.ceil((total || 0) / PAGE_SIZE));

  const createPageUrl = (pageNum: number) => {
    const qp = new URLSearchParams();
    if (pageNum > 1) qp.set("page", String(pageNum));
    if (activeCategory) qp.set("category", activeCategory);
    return `/products${qp.toString() ? `?${qp.toString()}` : ""}`;
  };

  const isEmpty = !products || products.length === 0;

  return (
    <SectionContainer padding={padding}>
      {!isEmpty ? (
        <>
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-6 py-3">Products</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Key features</th>
                  <th className="px-6 py-3">Product attributes</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const spec = Array.isArray(p.specifications)
                    ? p.specifications[0]
                    : undefined;
                  return (
                    <tr
                      key={p._id}
                      className="border-t transition-colors hover:bg-muted/40"
                    >
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-4">
                          {p.image?.asset?._id && (
                            <Link href={`/products/${p.slug?.current || ""}`}>
                              <Image
                                src={urlFor(p.image)
                                  .width(96)
                                  .height(64)
                                  .fit("crop")
                                  .url()}
                                alt={p.image.alt || p.title || ""}
                                width={96}
                                height={64}
                                className="h-16 w-24 rounded object-cover"
                              />
                            </Link>
                          )}
                          <div className="flex flex-col">
                            <Link
                              href={`/products/${p.slug?.current || ""}`}
                              className="font-semibold hover:underline"
                            >
                              {p.title}
                            </Link>
                            {spec?.sku && (
                              <span className="text-xs text-muted-foreground">
                                SKU: {spec.sku}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="flex flex-wrap items-center gap-2">
                          {Array.isArray(p.categories) &&
                            p.categories.map((c) => (
                              <Link
                                key={c?._id}
                                href={`/products?category=${
                                  c?.slug?.current || ""
                                }`}
                              >
                                <Badge
                                  variant="secondary"
                                  className="transition-colors hover:bg-secondary/80"
                                >
                                  {c?.title}
                                </Badge>
                              </Link>
                            ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <ul className="list-disc pl-5">
                          {Array.isArray(p.keyFeatures) &&
                            p.keyFeatures
                              .slice(0, 3)
                              .map((f, idx) => <li key={idx}>{f}</li>)}
                        </ul>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="flex flex-wrap items-center gap-2">
                          {spec?.productAttributes && (
                            <Badge variant="outline">
                              {spec.productAttributes}
                            </Badge>
                          )}
                          {spec?.purity && (
                            <Badge variant="outline">
                              Purity: {spec.purity}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        {spec?.sku && (
                          <AddToInquiryButton
                            item={{
                              id: spec.sku,
                              name: p.title || null,
                              productId: p._id || null,
                              slug: p.slug?.current || null,
                              imageUrl: p.image?.asset?.url || null,
                            }}
                            className="px-6"
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              createPageUrl={createPageUrl}
              className="mt-6"
            />
          )}
        </>
      ) : (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          {activeCategory ? (
            <>
              <p>No products found in this category.</p>
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
      )}
    </SectionContainer>
  );
}
