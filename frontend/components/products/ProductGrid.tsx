"use client";

import ProductCard from "@/components/products/ProductCard";
import Pagination from "@/components/pagination";
import { cn } from "@/lib/utils";
import type { ProductsTableItem, ProductsTableProps } from "@/components/products/products-table";

type ProductGridProps = Omit<ProductsTableProps, "labels" | "items"> & {
  labels: ProductsTableProps["labels"];
  items: ProductsTableItem[];
};

export default function ProductGrid({
  labels,
  items,
  page,
  pageCount,
  baseUrl,
  baseSearchParams,
  emptyState,
  className,
}: ProductGridProps) {
  const hasItems = items && items.length > 0;

  if (!hasItems) {
    return (
      <div className={cn("w-full", className)}>
        {emptyState ?? (
          <p className="text-sm text-muted-foreground">{labels.emptyState}</p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <ProductCard key={item._id} item={item} labels={{ labelSku: labels.labelSku }} />
        ))}
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
