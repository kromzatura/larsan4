import Blocks from "@/components/blocks";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import { generatePageMetadata as generatePageMetadataUtil } from "@/sanity/lib/metadata";
import { notFound } from "next/navigation";
import { normalizeLocale } from "@/lib/i18n/routing";
import type { LangAsyncPageProps } from "@/lib/types/next";

export async function generateMetadata(props: LangAsyncPageProps) {
  const resolved = props.params ? await props.params : undefined;
  const locale = normalizeLocale(resolved?.lang);
  const page = await fetchSanityPageBySlug({ slug: "index", lang: locale });
  if (!page) {
    notFound();
  }
  return generatePageMetadataUtil({
    page,
    slug: "index",
    type: "page",
    locale,
  });
}

export default async function IndexPage(props: LangAsyncPageProps) {
  const resolved = props.params ? await props.params : undefined;
  const locale = normalizeLocale(resolved?.lang);
  const page = await fetchSanityPageBySlug({ slug: "index", lang: locale });

  if (!page) {
    notFound();
  }

  return <Blocks blocks={page?.blocks ?? []} locale={locale} />;
}
