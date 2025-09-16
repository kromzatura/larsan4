import Blocks from "@/components/blocks";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/sanity/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await fetchSanityPageBySlug({ slug: "products" });
  if (!page) return {};
  return generatePageMetadata({ page, slug: "products", type: "page" });
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
