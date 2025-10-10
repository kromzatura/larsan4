import Blocks from "@/components/blocks";
import {
  fetchSanityPageBySlug,
  fetchSanityPagesStaticParams,
} from "@/sanity/lib/fetch";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { normalizeLocale } from "@/lib/i18n/routing";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";

export async function generateStaticParams() {
  const pages = await fetchSanityPagesStaticParams({ lang: FALLBACK_LOCALE });

  return pages
    .filter((page) => Boolean(page.slug?.current))
    .map((page) => ({ slug: page.slug?.current }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string; lang?: string }>;
}) {
  const params = await props.params;
  const locale = normalizeLocale(params.lang);
  const page = await fetchSanityPageBySlug({ slug: params.slug, lang: locale });

  if (!page) {
    notFound();
  }

  return generatePageMetadata({ page, slug: params.slug, type: "page" });
}

export default async function Page(props: {
  params: Promise<{ slug: string; lang?: string }>;
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const params = await props.params;
  const locale = normalizeLocale(params.lang);
  const page = await fetchSanityPageBySlug({ slug: params.slug, lang: locale });

  if (!page) {
    notFound();
  }

  const pageParams = Promise.resolve((await props.searchParams) || {});

  return (
    <Blocks
      blocks={page?.blocks ?? []}
      searchParams={pageParams}
      locale={locale}
    />
  );
}
