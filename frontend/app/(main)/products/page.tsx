import Blocks from "@/components/blocks";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/sanity/lib/metadata";

export const revalidate = 60;

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; category?: string }>;
}) {
  const page = await fetchSanityPageBySlug({ slug: "products" });
  if (!page) return {};
  const sp = searchParams ? await searchParams : undefined;
  const pageNum = sp?.page ? Number(sp.page) : 1;
  const category = sp?.category || "";
  const base = generatePageMetadata({ page, slug: "products", type: "page" });
  if (pageNum && pageNum > 1) {
    const isFilteredCategory = Boolean(category);
    return {
      ...base,
      robots: "noindex",
      alternates: {
        canonical: isFilteredCategory
          ? `/products/category/${category}`
          : "/products",
      },
    } as any;
  }
  return base as any;
}

export default async function ProductsPage(props: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const page = await fetchSanityPageBySlug({ slug: "products" });
  if (!page) {
    notFound();
  }

  const pageParams = Promise.resolve((await props.searchParams) || {});

  return <Blocks blocks={page?.blocks ?? []} searchParams={pageParams} />;
}
