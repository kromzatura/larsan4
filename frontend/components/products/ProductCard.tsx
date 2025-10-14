import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { ProductsTableItem } from "@/components/products/products-table";

export default function ProductCard({
  item,
  labels,
}: {
  item: ProductsTableItem;
  labels?: { labelSku: string };
}) {
  return (
    <Link
      href={item.href}
      className="group block overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      {item.imageUrl && (
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={item.imageUrl}
            alt={item.title || "Product image"}
            fill
            className="object-cover"
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 45vw, 90vw"
            placeholder={item.imageMeta?.lqip ? "blur" : "empty"}
            blurDataURL={item.imageMeta?.lqip || undefined}
          />
        </div>
      )}

      <div className="p-4">
        {item.categories && item.categories.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {item.categories.map((c) => (
              <Badge
                key={(c && c._id) || `${item._id}-${c?.slug}`}
                variant="outline"
                className="text-xs"
              >
                {c?.title}
              </Badge>
            ))}
          </div>
        )}

        <h3 className="font-semibold text-foreground group-hover:text-primary line-clamp-2">
          {item.title}
        </h3>

        {item.sku && (
          <p className="mt-1 font-mono text-sm text-muted-foreground">
            {(labels && labels.labelSku) || "SKU"}: {item.sku}
          </p>
        )}

        {item.features && item.features.length > 0 && (
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {item.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/40" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
