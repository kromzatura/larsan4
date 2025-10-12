import Blocks from "@/components/blocks";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import type { Metadata } from "next";
import { buildLocalizedPath, normalizeLocale } from "@/lib/i18n/routing";
import type { LangAsyncPageProps } from "@/lib/types/next";

export const revalidate = 60;

export async function generateMetadata(
  props: LangAsyncPageProps
): Promise<Metadata | Record<string, unknown>> {
  const resolvedParams = props.params ? await props.params : undefined;
  const locale = normalizeLocale(resolvedParams?.lang);
  const page = await fetchSanityPageBySlug({ slug: "products", lang: locale });
  if (!page) return {};
  const sp = (props.searchParams ? await props.searchParams : undefined) as
    | { page?: string; category?: string }
    | undefined;
  const pageNum = sp?.page ? Number(sp.page) : 1;
  const category = sp?.category || "";
  const base = generatePageMetadata({
    page,
    slug: "products",
    type: "page",
    locale,
  });
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

export default async function ProductsPage(props: LangAsyncPageProps) {
  const resolvedParams = props.params ? await props.params : undefined;
  const locale = normalizeLocale(resolvedParams?.lang);
  const page = await fetchSanityPageBySlug({ slug: "products", lang: locale });
  if (!page) {
    notFound();
  }

  return (
    <Blocks
      blocks={page?.blocks ?? []}
      searchParams={
        ((await props.searchParams) as
          | { page?: string; category?: string }
          | undefined) || {}
      }
      locale={locale}
    />
  );
}
