import Link from "next/link";
import SectionContainer from "@/components/ui/section-container";
import { Badge } from "@/components/ui/badge";
import { PAGE_QUERYResult } from "@/sanity.types";
import { fetchSanityProductCategories } from "@/sanity/lib/fetch";
import { buildLocalizedPath } from "@/lib/i18n/routing";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";

type CategoriesBlockProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "product-categories-16" }
>;

export default async function ProductCategories16({
  padding,
  searchParams,
  locale = FALLBACK_LOCALE,
}: CategoriesBlockProps & {
  searchParams?: { category?: string };
  locale?: SupportedLocale;
}) {
  const cats = await fetchSanityProductCategories({ lang: locale });
  const params = searchParams;
  const active = params?.category;
  const slugs = new Set(
    cats.map((c) => (c.slug?.current ? String(c.slug.current) : ""))
  );
  const hasValidActive = !!(active && slugs.has(active));
  const productsBasePath = buildLocalizedPath(locale, "/products");
  return (
    <SectionContainer padding={padding}>
      <div className="rounded-lg border p-4">
        <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
          <span>Filter</span>
          <span>Category:</span>
          <Link
            href={productsBasePath}
            className="rounded outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Badge
              variant={hasValidActive ? "outline" : "secondary"}
              className="px-3 py-1 text-sm transition-colors hover:bg-secondary/80"
            >
              Any
            </Badge>
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {cats.map((c) => (
            <Link
              key={c._id}
              href={`${productsBasePath}?category=${c.slug?.current || ""}`}
              className="rounded outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Badge
                variant={active === c.slug?.current ? "secondary" : "outline"}
                className="px-3 py-1 text-sm transition-colors hover:bg-secondary/80"
              >
                {c.title}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
