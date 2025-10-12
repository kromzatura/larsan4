import Blocks from "@/components/blocks";
import {
  fetchSanityPageBySlug,
  fetchSanityPagesStaticParams,
} from "@/sanity/lib/fetch";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { normalizeLocale, isSupportedLocale } from "@/lib/i18n/routing";
import { FALLBACK_LOCALE, SUPPORTED_LOCALES } from "@/lib/i18n/config";
import type { AsyncPageProps, SearchParams } from "@/lib/types/next";
import type { PAGE_QUERYResult } from "@/sanity.types";

// Strong local type: ensure title and blocks are present for typed rendering
type PageBlocks = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>;
type PageData = Omit<NonNullable<PAGE_QUERYResult>, "title" | "blocks"> & {
  title: string;
  blocks: PageBlocks;
};

const EXCLUDED_PAGE_SLUGS = new Set(["index", "home", ""]);

export async function generateStaticParams() {
  const pages = await fetchSanityPagesStaticParams({ lang: FALLBACK_LOCALE });

  const pageSlugs = pages
    .map((page) => page.slug?.current?.trim() || "")
    .filter((slug) => slug && !EXCLUDED_PAGE_SLUGS.has(slug));

  return SUPPORTED_LOCALES.flatMap((lang) =>
    pageSlugs.map((slug) => ({ lang, slug }))
  );
}

export async function generateMetadata(
  props: AsyncPageProps<{ lang?: string; slug: string }, SearchParams>
) {
  const params = (await props.params)!;
  const locale = normalizeLocale(params.lang);
  const page = (await fetchSanityPageBySlug({
    slug: params.slug,
    lang: locale,
  })) as PageData | null;

  // For metadata, prefer returning {} so Next can flow to the page's 404 guard
  if (!page || !page.title || !page.blocks || page.blocks.length === 0) {
    return {};
  }

  return generatePageMetadata({
    page,
    slug: params.slug,
    type: "page",
    locale,
  });
}

export default async function Page(
  props: AsyncPageProps<{ lang?: string; slug: string }, SearchParams>
) {
  const params = (await props.params)!;
  const locale = normalizeLocale(params.lang);

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const page = (await fetchSanityPageBySlug({
    slug: params.slug,
    lang: locale,
  })) as PageData | null;

  if (!page || !page.title || !page.blocks || page.blocks.length === 0) {
    notFound();
  }

  return (
    <>
      <Blocks
        blocks={page.blocks}
        searchParams={
          ((await props.searchParams) as { page?: string } | undefined) || {}
        }
        locale={locale}
      />
    </>
  );
}
