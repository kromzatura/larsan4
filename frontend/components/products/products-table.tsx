"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ClickableRow from "@/components/blocks/products/all-products-16/clickable-row";
import Pagination from "@/components/pagination";
import AddToInquiryButton from "@/components/inquiry/add-to-inquiry-button";
import { Badge } from "@/components/ui/badge";

export type ProductsTableItem = {
  _id: string;
  slug: string;
  title: string | null;
  sku?: string | null;
  imageUrl?: string | null;
  features?: string[] | null;
  productAttributes?: string | null;
  purity?: string | number | null;
  categories?: Array<{
    _id?: string | null;
    title?: string | null;
    slug?: string | null;
  }> | null;
  href: string;
};

export type ProductsTableProps = {
  items: ProductsTableItem[];
  page: number;
  pageCount: number;
  baseUrl: string;
  baseSearchParams?: string;
  emptyState?: React.ReactNode;
  className?: string;
};

export default function ProductsTable({
  items,
  page,
  pageCount,
  baseUrl,
  baseSearchParams,
  emptyState,
  className,
}: ProductsTableProps) {
  const hasItems = items && items.length > 0;

  if (!hasItems) {
    return (
      <div className={cn("w-full", className)}>
        {emptyState ?? (
          <p className="text-sm text-muted-foreground">No products found.</p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th scope="col" className="px-6 py-4">
                Products
              </th>
              <th scope="col" className="px-6 py-4">
                Category
              </th>
              <th scope="col" className="px-6 py-4">
                Key features
              </th>
              <th scope="col" className="px-6 py-4">
                Product attributes
              </th>
              <th scope="col" className="px-6 py-4 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <ClickableRow
                href={item.href}
                key={item._id}
                className="group relative border-t transition-colors hover:bg-muted/40"
              >
                <td className="px-6 py-5 md:py-6 align-middle">
                  <div className="flex items-center gap-5">
                    {item.imageUrl ? (
                      <Link href={item.href} className="relative z-10 shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.title || "Product image"}
                          width={96}
                          height={64}
                          className="h-16 w-24 rounded object-cover ring-1 ring-border"
                        />
                      </Link>
                    ) : null}
                    <div className="flex flex-col gap-1">
                      <Link
                        href={item.href}
                        className="font-semibold hover:underline line-clamp-2 break-words"
                      >
                        {item.title}
                      </Link>
                      {item.sku && (
                        <span className="text-xs text-muted-foreground truncate block whitespace-nowrap">
                          SKU: {item.sku}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 md:py-6 align-top">
                  <div className="relative z-10 flex flex-wrap items-center gap-2">
                    {Array.isArray(item.categories) &&
                      item.categories?.map((c) => (
                        <Link
                          key={(c && c._id) || `${item._id}-${c?.slug}`}
                          href={`/products?category=${c?.slug || ""}`}
                          className="rounded outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                <td className="px-6 py-5 md:py-6 align-top">
                  <ul className="list-disc pl-5 space-y-1.5 marker:text-muted-foreground">
                    {Array.isArray(item.features) &&
                      item.features
                        ?.slice(0, 3)
                        .map((f, idx) => <li key={idx}>{f}</li>)}
                  </ul>
                </td>
                <td className="px-6 py-5 md:py-6 align-top">
                  <div className="relative z-10 flex flex-wrap items-center gap-2">
                    {item.productAttributes && (
                      <Badge variant="outline">{item.productAttributes}</Badge>
                    )}
                    {item.purity && (
                      <Badge variant="outline">Purity: {item.purity}</Badge>
                    )}
                  </div>
                </td>
                <td className="relative z-10 px-6 py-5 md:py-6 text-center align-middle">
                  {item.sku && (
                    <AddToInquiryButton
                      item={{
                        id: item.sku,
                        name: item.title || null,
                        productId: item._id || null,
                        slug: item.slug || null,
                        imageUrl: item.imageUrl || null,
                      }}
                      className="w-full max-w-44 px-6 mx-auto"
                    />
                  )}
                </td>
              </ClickableRow>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <Pagination
          currentPage={page}
          totalPages={pageCount}
          createPageUrl={(pageNum) => {
            const qp = new URLSearchParams(baseSearchParams || "");
            if (pageNum > 1) qp.set("page", String(pageNum));
            else qp.delete("page");
            const qs = qp.toString();
            return `${baseUrl}${qs ? `?${qs}` : ""}`;
          }}
          className="mt-6"
        />
      )}
    </div>
  );
}
