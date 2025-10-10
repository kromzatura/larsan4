import Blocks from "@/components/blocks";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import MissingSanityPage from "@/components/ui/missing-sanity-page";
import { normalizeLocale } from "@/lib/i18n/routing";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";

export async function generateMetadata() {
  const page = await fetchSanityPageBySlug({
    slug: "index",
    lang: FALLBACK_LOCALE,
  });

  return generatePageMetadata({ page, slug: "index", type: "page" });
}

export default async function IndexPage({
  params,
}: {
  params?: { lang?: string };
} = {}) {
  const locale = normalizeLocale(params?.lang);
  const page = await fetchSanityPageBySlug({ slug: "index", lang: locale });

  if (!page) {
    return MissingSanityPage({ document: "page", slug: "index" });
  }

  return <Blocks blocks={page?.blocks ?? []} locale={locale} />;
}
