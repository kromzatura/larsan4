import Blocks from "@/components/blocks";
import {
  fetchSanityPageBySlug,
  fetchSanityPagesStaticParams,
} from "@/sanity/lib/fetch";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { normalizeLocale } from "@/lib/i18n/routing";
import {
  FALLBACK_LOCALE,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/lib/i18n/config";

export async function generateStaticParams() {
  const pagesByLocale = await Promise.all(
    SUPPORTED_LOCALES.map(async (locale) => {
      const pages = await fetchSanityPagesStaticParams({ lang: locale });
      return pages
        .filter((page) => Boolean(page.slug?.current))
        .map((page) =>
          locale === FALLBACK_LOCALE
            ? { slug: page.slug?.current }
            : { slug: page.slug?.current, lang: locale }
        );
    })
  );

  const seen = new Set<string>();
  const params: Array<{ slug?: string; lang?: SupportedLocale }> = [];

  for (const entries of pagesByLocale) {
    for (const entry of entries) {
      if (!entry.slug) continue;
      const key = `${entry.slug}:${entry.lang ?? FALLBACK_LOCALE}`;
      if (seen.has(key)) continue;
      seen.add(key);
      params.push(entry);
    }
  }

  return params;
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
