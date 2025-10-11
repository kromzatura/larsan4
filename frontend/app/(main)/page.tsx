import Blocks from "@/components/blocks";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import { generatePageMetadata as generatePageMetadataUtil } from "@/sanity/lib/metadata";
import MissingSanityPage from "@/components/ui/missing-sanity-page";
import { normalizeLocale } from "@/lib/i18n/routing";
// import { FALLBACK_LOCALE } from "@/lib/i18n/config";
// No PageProps type in our Next version; accept optional params directly.

export async function generateMetadata(props: {
  params?: Promise<{ lang?: string }>;
}) {
  const resolved = props.params ? await props.params : undefined;
  const locale = normalizeLocale(resolved?.lang);
  const page = await fetchSanityPageBySlug({ slug: "index", lang: locale });
  if (!page) {
    return { title: "Content not available in this language" };
  }
  return generatePageMetadataUtil({ page, slug: "index", type: "page" });
}

type IndexPageProps = { params?: Promise<{ lang?: string }> };

export default async function IndexPage(props: IndexPageProps) {
  const resolved = props.params ? await props.params : undefined;
  const locale = normalizeLocale(resolved?.lang);
  const page = await fetchSanityPageBySlug({ slug: "index", lang: locale });

  if (!page) {
    return MissingSanityPage({ document: "page", slug: "index" });
  }

  return <Blocks blocks={page?.blocks ?? []} locale={locale} />;
}
