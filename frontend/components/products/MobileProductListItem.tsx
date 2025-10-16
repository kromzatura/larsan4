"use client";

import Link from "next/link";
import Image from "next/image";
import AddToInquiryButton from "@/components/inquiry/add-to-inquiry-button";
import { Badge } from "@/components/ui/badge";
import { toText } from "@/lib/utils";
import { buildLocalizedPath } from "@/lib/i18n/routing";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";
import type { ProductsTableItem } from "./products-table";

type MobileLabels = {
  labelSku: string;
  labelPurity: string;
};

export default function MobileProductListItem({
  item,
  labels,
  locale = FALLBACK_LOCALE,
}: {
  item: ProductsTableItem;
  labels: MobileLabels;
  locale?: SupportedLocale;
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex gap-4">
        {item.imageUrl ? (
          <Link href={item.href} className="relative z-10 shrink-0">
            <Image
              src={item.imageUrl}
              alt={toText(item.title as unknown) || "Product image"}
              width={160}
              height={106}
              className="h-20 w-32 rounded object-cover ring-1 ring-border"
              sizes="160px"
              placeholder={item.imageMeta?.lqip ? "blur" : undefined}
              blurDataURL={item.imageMeta?.lqip || undefined}
            />
          </Link>
        ) : null}
        <div className="min-w-0 flex-1">
          <Link
            href={item.href}
            className="font-semibold hover:underline line-clamp-2 break-words leading-tight"
          >
            {toText(item.title as unknown) || ""}
          </Link>
          {toText(item.sku as unknown) && (
            <div className="mt-1 text-xs text-muted-foreground truncate whitespace-nowrap font-mono">
              {labels.labelSku}: {toText(item.sku as unknown)}
            </div>
          )}
          {Array.isArray(item.categories) && item.categories.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {item.categories.map((c) => (
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
                    className="rounded-full px-2.5 py-0.5 text-xs"
                  >
                    {toText(c?.title as unknown) || ""}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {Array.isArray(item.features) && item.features.length > 0 && (
              <span className="text-sm">
                • {toText(item.features[0] as unknown) || ""}
              </span>
            )}
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
        </div>
      </div>
      {toText(item.sku as unknown) && (
        <div className="mt-4">
          <AddToInquiryButton
            item={{
              id: toText(item.sku as unknown)!,
              name: toText(item.title as unknown),
              productId: item._id || null,
              slug: item.slug || null,
              imageUrl: item.imageUrl || null,
            }}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}
