import Blocks from "@/components/blocks";
import HomeJsonLd from "@/components/seo/home-json-ld";
import { fetchSanityPageBySlug, fetchSanitySettings } from "@/sanity/lib/fetch";
import { generatePageMetadata as generatePageMetadataUtil } from "@/sanity/lib/metadata";
import { notFound } from "next/navigation";
import { normalizeLocale } from "@/lib/i18n/routing";
import { buildAbsoluteUrl } from "@/lib/url";
import { urlFor } from "@/sanity/lib/image";
import {
  getNavigationItems,
  type NavigationItem,
  type NavGroup,
} from "@/lib/getNavigationItems";
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
  const [page, settings, headerNav] = await Promise.all([
    fetchSanityPageBySlug({ slug: "index", lang: locale }),
    fetchSanitySettings({ lang: locale }),
    getNavigationItems("header", locale),
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

  // Build SiteNavigationElement items from the header navigation (limited to 10)
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const isGroup = (i: NavigationItem): i is NavGroup => i._type === "link-group";
  const flatten = (items: NavigationItem[]): Array<{ name: string; url: string }> => {
    const out: Array<{ name: string; url: string }> = [];
    for (const item of items) {
      if (isGroup(item) && Array.isArray(item.links)) {
        out.push(...flatten(item.links.filter(Boolean)));
      } else {
        const title = item.title as string | undefined;
        const href = item.href as string | null | undefined;
        if (title && href) {
          const abs = href.startsWith("http") ? href : `${SITE_URL}${href}`;
          out.push({ name: title, url: abs });
        }
      }
    }
    return out;
  };
  const siteNavigation = flatten(headerNav).slice(0, 10);

  return (
    <>
      <HomeJsonLd
        locale={locale}
        homepageUrl={homepageUrl}
        siteName={siteName}
        logoUrl={logoUrl}
        sameAs={sameAs}
        siteNavigation={siteNavigation}
      />
      <Blocks blocks={page?.blocks ?? []} locale={locale} />
    </>
  );
}
