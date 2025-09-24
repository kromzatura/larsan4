import Blocks from "@/components/blocks";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import MissingSanityPage from "@/components/ui/missing-sanity-page";

export async function generateMetadata(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  const page = await fetchSanityPageBySlug({ slug: "index", lang });
  return generatePageMetadata({ page, slug: "index", type: "page" });
}

export default async function LangIndexPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  const page = await fetchSanityPageBySlug({ slug: "index", lang });

  if (!page) {
    return MissingSanityPage({ document: "page", slug: "index" });
  }

  return <Blocks blocks={page?.blocks ?? []} />;
}
