"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import AddToInquiryButton from "@/components/inquiry/add-to-inquiry-button";
import type { ProductsTableItem } from "@/components/products/products-table";
import { toText } from "@/lib/utils";
import { buildLocalizedPath } from "@/lib/i18n/routing";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";

export default function ProductCard({
  item,
  labels,
  locale = FALLBACK_LOCALE,
}: {
  item: ProductsTableItem;
  labels?: { labelSku: string; labelPurity?: string };
  locale?: SupportedLocale;
}) {
  const title = toText(item.title as unknown) || "";
  const sku = toText(item.sku as unknown);

  return (
    <Card className="overflow-hidden">
      {item.imageUrl ? (
        <Link href={item.href} className="relative block aspect-[4/3]">
          <Image
            src={item.imageUrl}
            alt={title || "Product image"}
            fill
            className="object-cover"
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 45vw, 90vw"
            placeholder={item.imageMeta?.lqip ? "blur" : undefined}
            blurDataURL={item.imageMeta?.lqip || undefined}
          />
        </Link>
      ) : null}

      <CardContent className="py-4">
        {Array.isArray(item.categories) && item.categories.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
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

        <Link
          href={item.href}
          className="font-semibold hover:underline line-clamp-2 break-words leading-tight"
        >
          {title}
        </Link>

        {sku && (
          <div className="mt-1 text-xs text-muted-foreground truncate whitespace-nowrap font-mono">
            {(labels?.labelSku || "SKU") + ": "}
            {sku}
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
              {(labels?.labelPurity || "Purity") + ": "}
              {toText(item.purity as unknown)}
            </Badge>
          )}
        </div>

        {sku && (
          <div className="mt-4">
            <AddToInquiryButton
              item={{
                id: sku,
                name: title,
                productId: item._id || null,
                slug: item.slug || null,
                imageUrl: item.imageUrl || null,
              }}
              className="w-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
