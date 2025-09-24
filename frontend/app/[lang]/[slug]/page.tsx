import Blocks from "@/components/blocks";
import { notFound } from "next/navigation";
import { fetchSanityPageBySlug, fetchSanityPagesStaticParams } from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";

export async function generateStaticParams() {
  // Default to 'en' build-time; can expand via generateStaticParams per locale
  const pages = await fetchSanityPagesStaticParams("en");
  return pages.map((page) => ({ slug: page.slug?.current }));
}

export async function generateMetadata(props: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await props.params;
  const page = await fetchSanityPageBySlug({ slug, lang });
  if (!page) notFound();
  return generatePageMetadata({ page, slug, type: "page", lang });
}

export default async function Page(props: {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { lang, slug } = await props.params;
  const page = await fetchSanityPageBySlug({ slug, lang });
  if (!page) notFound();
  const pageParams = Promise.resolve((await props.searchParams) || {});
  return <Blocks blocks={page?.blocks ?? []} searchParams={pageParams} />;
}
