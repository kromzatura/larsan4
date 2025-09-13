import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { fetchSanityAllCategories } from "@/sanity/lib/fetch";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type AllCategories16 = Extract<Block, { _type: "all-categories-16" }>;

export default async function AllCategories16({ padding }: AllCategories16) {
  const categories: Array<{
    _id: string;
    title?: string;
    slug?: { current?: string };
  }> = await fetchSanityAllCategories();

  return (
    <SectionContainer padding={padding}>
      <Separator />
      <div className="container flex flex-wrap gap-2 py-8">
        {categories?.length ? (
          categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/categories/${cat.slug?.current}`}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              {cat.title}
            </Link>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No categories yet.</p>
        )}
      </div>
      <Separator />
    </SectionContainer>
  );
}
