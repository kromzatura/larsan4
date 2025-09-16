import Link from "next/link";
import SectionContainer from "@/components/ui/section-container";
import { Badge } from "@/components/ui/badge";
import { PAGE_QUERYResult } from "@/sanity.types";
import { fetchSanityProductCategories } from "@/sanity/lib/fetch";

type CategoriesBlockProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "product-categories-16" }
>;

export default async function ProductCategories16({
  padding,
  searchParams,
}: CategoriesBlockProps & {
  searchParams?: Promise<{ category?: string }>;
}) {
  const cats = await fetchSanityProductCategories();
  const params = searchParams ? await searchParams : undefined;
  const active = params?.category;
  return (
    <SectionContainer padding={padding}>
      <div className="rounded-lg border p-3">
        <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
          <span>Filter</span>
          <span>Category:</span>
          <Link href={`/products`}>
            <Badge variant={active ? "outline" : "secondary"}>Any</Badge>
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {cats.map((c) => (
            <Link
              key={c._id}
              href={`/products?category=${c.slug?.current || ""}`}
            >
              <Badge
                variant={active === c.slug?.current ? "secondary" : "outline"}
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
