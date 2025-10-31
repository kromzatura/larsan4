import Blocks from "@/components/blocks";
import HomeJsonLd from "@/components/seo/home-json-ld";
import { fetchSanityPageBySlug, fetchSanitySettings } from "@/sanity/lib/fetch";
import { generatePageMetadata as generatePageMetadataUtil } from "@/sanity/lib/metadata";
import { notFound } from "next/navigation";
import { normalizeLocale } from "@/lib/i18n/routing";
import { buildAbsoluteUrl } from "@/lib/url";
import { urlFor } from "@/sanity/lib/image";
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
  const [page, settings] = await Promise.all([
    fetchSanityPageBySlug({ slug: "index", lang: locale }),
    fetchSanitySettings({ lang: locale }),
  ]);

  if (!page) {
    notFound();
  }

  const homepageUrl = buildAbsoluteUrl(locale, "/");
  const siteName = settings?.siteName ?? undefined;
  const logoUrl = settings?.logo
    ? urlFor(settings.logo).width(512).url()
    : undefined;
  const sameAsRaw = (settings as unknown as { socialLinks?: unknown })
    ?.socialLinks;
  const sameAs = Array.isArray(sameAsRaw)
    ? (sameAsRaw as Array<unknown>).filter(
        (v): v is string => typeof v === "string" && v.length > 0
      )
    : undefined;

  return (
    <>
      <HomeJsonLd
        locale={locale}
        homepageUrl={homepageUrl}
        siteName={siteName}
        logoUrl={logoUrl}
        sameAs={sameAs}
      />
      <Blocks blocks={page?.blocks ?? []} locale={locale} />
    </>
  );
}
