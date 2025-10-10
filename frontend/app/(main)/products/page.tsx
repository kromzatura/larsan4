import Blocks from "@/components/blocks";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import type { ResolvingMetadata } from "next";

type ProductSearchParams = {
  page?: string;
  category?: string;
};

export const revalidate = 60;

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<ProductSearchParams>;
}): Promise<ResolvingMetadata | Record<string, unknown>> {
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
    };
  }
  return base;
}

export default async function ProductsPage(props: {
  searchParams: Promise<ProductSearchParams>;
}) {
  const page = await fetchSanityPageBySlug({ slug: "products" });
  if (!page) {
    notFound();
  }

  const resolvedSearchParams = await props.searchParams;
  const pageParams = Promise.resolve(resolvedSearchParams || {});

  return <Blocks blocks={page?.blocks ?? []} searchParams={pageParams} />;
}
