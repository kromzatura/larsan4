import Blocks from "@/components/blocks";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import type { Metadata } from "next";
import { buildLocalizedPath, normalizeLocale } from "@/lib/i18n/routing";
import type { LangAsyncPageProps } from "@/lib/types/next";
import { buildAbsoluteUrl } from "@/lib/url";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const revalidate = 60;

export async function generateMetadata(
  props: LangAsyncPageProps
): Promise<Metadata | Record<string, unknown>> {
  const resolvedParams = props.params ? await props.params : undefined;
  const locale = normalizeLocale(resolvedParams?.lang);
  const page = await fetchSanityPageBySlug({ slug: "products", lang: locale });
  if (!page) notFound();
  const sp = (props.searchParams ? await props.searchParams : undefined) as
    | { page?: string }
    | undefined;
  const pageNum = sp?.page ? Number(sp.page) : 1;
  const base = generatePageMetadata({
    page,
    slug: "products",
    type: "page",
    locale,
  });
  if (pageNum && pageNum > 1) {
    if (
      process.env.LOG_HREFLANG === "1" ||
      process.env.NEXT_PUBLIC_LOG_HREFLANG === "1"
    ) {
      // eslint-disable-next-line no-console
      console.info(
        JSON.stringify(
          {
            tag: "hreflang",
            note: "pagination page returning canonical-only alternates",
            page: "products",
            locale,
            pageNum,
            canonical: buildLocalizedPath(locale, "/products"),
          },
          null,
          2
        )
      );
    }
    return {
      ...base,
      robots: {
        index: false,
        follow: true,
      },
    };
  }
  return base;
}

export default async function ProductsPage(props: LangAsyncPageProps) {
  const resolvedParams = props.params ? await props.params : undefined;
  const locale = normalizeLocale(resolvedParams?.lang);
  const page = await fetchSanityPageBySlug({ slug: "products", lang: locale });
  if (!page) {
    notFound();
  }
  const dictionary = await getDictionary(locale);

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const homeUrl = buildAbsoluteUrl(locale, "/");
  const productsUrl = `${SITE_URL}${buildLocalizedPath(locale, "/products")}`;
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    inLanguage: locale,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: homeUrl },
      { "@type": "ListItem", position: 2, name: "Products", item: productsUrl },
    ],
  } as const;

  return (
    <>
      <section className="container py-16 xl:py-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <Breadcrumbs
          links={[
            {
              label: dictionary.products.categoryPage.breadcrumbProducts,
              href: buildLocalizedPath(locale, "/products"),
            },
          ]}
          locale={locale}
        />
      </section>
      <Blocks
        blocks={page?.blocks ?? []}
        searchParams={
          // Only allow pagination on All Products; ignore any category param to avoid duplicate content
          (((await props.searchParams) as { page?: string } | undefined) && {
            page: (await props.searchParams)?.page as string | undefined,
          }) ||
          {}
        }
        locale={locale}
      />
    </>
  );
}
