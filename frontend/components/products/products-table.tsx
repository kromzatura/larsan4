"use client";

import Link from "next/link";
import Image from "next/image";
import { cn, toText } from "@/lib/utils";
import ClickableRow from "@/components/blocks/products/all-products-16/clickable-row";
import Pagination from "@/components/pagination";
import AddToInquiryButton from "@/components/inquiry/add-to-inquiry-button";
import { Badge } from "@/components/ui/badge";
import { buildLocalizedPath } from "@/lib/i18n/routing";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";
import MobileProductListItem from "@/components/products/MobileProductListItem";

export type ProductsTableItem = {
  _id: string;
  slug: string;
  title: string | null;
  sku?: string | null;
  imageUrl?: string | null;
  imageMeta?: {
    lqip?: string | null;
    dimensions?: { width?: number | null; height?: number | null } | null;
  } | null;
  features?: string[] | null;
  productAttributes?: string | null;
  purity?: string | number | null;
  categories?: Array<{
    _id?: string | null;
    title?: string | null;
    slug?: string | null;
    href?: string | null;
  }> | null;
  href: string;
};

export type ProductsTableProps = {
  labels: {
    headerProduct: string;
    headerCategory: string;
    headerKeyFeatures: string;
    headerAttributes: string;
    headerAction: string;
    labelSku: string;
    labelPurity: string;
    emptyState: string;
  };
  items: ProductsTableItem[];
  page: number;
  pageCount: number;
  baseUrl: string;
  baseSearchParams?: string;
  emptyState?: React.ReactNode;
  className?: string;
  locale?: SupportedLocale;
};

export default function ProductsTable({
  labels,
  items,
  page,
  pageCount,
  baseUrl,
  baseSearchParams,
  emptyState,
  className,
  locale = FALLBACK_LOCALE,
}: ProductsTableProps) {
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
      {/* Mobile-friendly cards */}
      <div className="md:hidden space-y-4">
        {items.map((item) => (
          <MobileProductListItem
            key={item._id}
            item={item}
            labels={{
              labelSku: labels.labelSku,
              labelPurity: labels.labelPurity,
            }}
            locale={locale}
          />
        ))}
      </div>

      {/* Desktop table */}
      <div
        className="hidden md:block overflow-x-auto rounded-lg border"
        role="region"
        aria-label="Products table (scroll horizontally on smaller screens)"
      >
        <table className="min-w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b">
            <tr>
              <th scope="col" className="px-6 py-4">
                {labels.headerProduct}
              </th>
              <th scope="col" className="px-6 py-4">
                {labels.headerCategory}
              </th>
              <th scope="col" className="px-6 py-4">
                {labels.headerKeyFeatures}
              </th>
              <th scope="col" className="px-6 py-4">
                {labels.headerAttributes}
              </th>
              <th scope="col" className="px-6 py-4 text-center">
                {labels.headerAction}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <ClickableRow
                href={item.href}
                key={item._id}
                className="group relative border-t transition-colors hover:bg-muted/30"
              >
                <td className="px-6 py-6 md:py-7 align-middle">
                  <div className="flex items-center gap-5">
                    {item.imageUrl ? (
                      <Link href={item.href} className="relative z-10 shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={toText(item.title as unknown) || "Product image"}
                          width={320}
                          height={213}
                          className="h-16 w-24 rounded object-cover ring-1 ring-border transition duration-200 ease-out group-hover:ring-primary/40 group-hover:shadow-sm group-hover:scale-[1.02]"
                          sizes="(min-width: 1024px) 240px, (min-width: 768px) 200px, 160px"
                          placeholder={
                            item.imageMeta?.lqip ? "blur" : undefined
                          }
                          blurDataURL={item.imageMeta?.lqip || undefined}
                        />
                      </Link>
                    ) : null}
                    <div className="flex flex-col gap-1">
                      <Link
                        href={item.href}
                        className="font-semibold hover:underline line-clamp-2 break-words leading-tight"
                      >
                        {toText(item.title as unknown) || ""}
                      </Link>
                      {toText(item.sku as unknown) && (
                        <span className="text-xs text-muted-foreground truncate block whitespace-nowrap font-mono">
                          {labels.labelSku}: {toText(item.sku as unknown)}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 md:py-7 align-top">
                  <div className="relative z-10 flex flex-wrap items-center gap-2">
                    {Array.isArray(item.categories) &&
                      item.categories?.map((c) => (
                        <Link
                          key={(c && c._id) || `${item._id}-${c?.slug}`}
                          href={
                            c?.href ||
                            buildLocalizedPath(
                              locale,
                              `/products/category/${c?.slug || ""}`
                            )
                          }
                          className="rounded outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Badge
                            variant="secondary"
                            className="transition-colors hover:bg-secondary/80 rounded-full px-2.5 py-0.5 text-xs"
                          >
                            {toText(c?.title as unknown) || ""}
                          </Badge>
                        </Link>
                      ))}
                  </div>
                </td>
                <td className="px-6 py-6 md:py-7 align-top">
                  <ul className="list-disc pl-5 space-y-1.5 marker:text-muted-foreground">
                    {Array.isArray(item.features) &&
                      item.features
                        ?.slice(0, 3)
                        .map((f, idx) => (
                          <li key={idx}>{toText(f as unknown) || ""}</li>
                        ))}
                  </ul>
                </td>
                <td className="px-6 py-6 md:py-7 align-top">
                  <div className="relative z-10 flex flex-wrap items-center gap-2">
                    {toText(item.productAttributes as unknown) && (
                      <Badge
                        variant="outline"
                        className="rounded-full px-2.5 py-0.5 text-xs"
                      >
                        {toText(item.productAttributes as unknown)}
                      </Badge>
                    )}
                    {toText(item.purity as unknown) && (
                      <Badge
                        variant="outline"
                        className="rounded-full px-2.5 py-0.5 text-xs"
                      >
                        {labels.labelPurity}: {toText(item.purity as unknown)}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="relative z-10 px-6 py-5 md:py-6 text-center align-middle">
                  {toText(item.sku as unknown) && (
                    <AddToInquiryButton
                      item={{
                        id: toText(item.sku as unknown)!,
                        name: toText(item.title as unknown),
                        productId: item._id || null,
                        slug: item.slug || null,
                        imageUrl: item.imageUrl || null,
                      }}
                      className="w-full max-w-44 px-6 mx-auto transition duration-150 ease-out group-hover:shadow-sm group-hover:-translate-y-0.5"
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
          className="mt-8"
        />
      )}
    </div>
  );
}
