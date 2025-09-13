import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { sanityFetch } from "@/sanity/lib/live";
import { groq } from "next-sanity";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type AllCategories16Props = Extract<Block, { _type: "all-categories-16" }>;

const ALL_CATEGORIES_QUERY = groq`*[_type == "category"] | order(title asc){
  _id,
  title,
  slug
}`;

export default async function AllCategories16({ padding }: AllCategories16Props) {
  const res = await sanityFetch({
    query: ALL_CATEGORIES_QUERY,
    perspective: "published",
    stega: false,
  });
  const categories = (res.data ?? []) as Array<{
    _id: string;
    title?: string;
    slug?: { current?: string };
  }>;

  return (
    <SectionContainer padding={padding}>
      <Separator />
      <div className="container flex flex-wrap gap-2 py-8">
        {categories?.length ? (
          categories.map((cat: { _id: string; title?: string; slug?: { current?: string } }) => (
            <Link
              key={cat._id}
              href={cat.slug?.current ? `/categories/${encodeURIComponent(cat.slug.current)}` : `/blog`}
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
