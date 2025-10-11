import Blocks from "@/components/blocks";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import type { Metadata } from "next";
import { buildLocalizedPath, normalizeLocale } from "@/lib/i18n/routing";

type ProductsPageProps = {
  params?: Promise<{ lang?: string }>;
  searchParams?: Promise<{ page?: string; category?: string }>;
};

export const revalidate = 60;

export async function generateMetadata(
  props: ProductsPageProps
): Promise<Metadata | Record<string, unknown>> {
  const resolvedParams = props.params ? await props.params : undefined;
  const locale = normalizeLocale(resolvedParams?.lang);
  const page = await fetchSanityPageBySlug({ slug: "products", lang: locale });
  if (!page) return {};
  const sp = props.searchParams ? await props.searchParams : undefined;
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
          ? buildLocalizedPath(locale, `/products/category/${category}`)
          : buildLocalizedPath(locale, "/products"),
      },
    };
  }
  return base;
}

export default async function ProductsPage(props: ProductsPageProps) {
  const resolvedParams = props.params ? await props.params : undefined;
  const locale = normalizeLocale(resolvedParams?.lang);
  const page = await fetchSanityPageBySlug({ slug: "products", lang: locale });
  if (!page) {
    notFound();
  }

  const pageParams = Promise.resolve(
    (props.searchParams ? await props.searchParams : undefined) || {}
  );

  return (
    <Blocks
      blocks={page?.blocks ?? []}
      searchParams={pageParams}
      locale={locale}
    />
  );
}
