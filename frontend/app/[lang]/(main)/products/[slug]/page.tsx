import ExternalLink from "@/components/ui/external-link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PortableTextRenderer from "@/components/portable-text-renderer";
import AddToInquiryButton from "@/components/inquiry/add-to-inquiry-button";
import { Separator } from "@/components/ui/separator";
// Badge intentionally unused for key features; categories still use Badge.
import { Badge } from "@/components/ui/badge";
import { Facebook, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchSanityProductBySlug,
  fetchSanityProductSlugs,
} from "@/sanity/lib/fetch";
import type {
  ProductDocument,
  ProductSpecification,
} from "@/lib/types/content";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { normalizeLocale, buildLocalizedPath } from "@/lib/i18n/routing";
import { SUPPORTED_LOCALES } from "@/lib/i18n/config";
import type { AsyncPageProps } from "@/lib/types/next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildAbsoluteUrl } from "@/lib/url";
import { fetchSanitySettings } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";

type SpecPair = { label: string; value?: string | number | null };

function SpecTable({
  title,
  rows,
  monoValueLabels = [],
}: {
  title: string;
  rows: SpecPair[];
  monoValueLabels?: string[];
}) {
  const filtered = rows.filter(
    (r) => r.value !== undefined && r.value !== null && r.value !== ""
  );
  if (filtered.length === 0) return null;
  return (
    <div className="mb-6 rounded-lg border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">{title}</h2>
      <div className="grid grid-cols-2 gap-y-2">
        {filtered.map((r) => (
          <Fragment key={`${title}-${r.label}`}>
            <div className="text-sm font-medium text-muted-foreground">
              {r.label}
            </div>
            <div
              className={
                "text-right text-sm text-foreground" +
                (monoValueLabels.includes(r.label) ? " font-mono" : "")
              }
            >
              {r.value}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];

  for (const locale of SUPPORTED_LOCALES) {
    const slugs = await fetchSanityProductSlugs({ lang: locale });
    for (const s of slugs) {
      if (s.slug?.current) {
        params.push({ slug: s.slug.current, lang: locale });
      }
    }
  }

  return params;
}

export async function generateMetadata(
  props: AsyncPageProps<{ slug: string; lang?: string }>
) {
  const params = (await props.params)!;
  const locale = normalizeLocale(params.lang);
  const product = await fetchSanityProductBySlug({
    slug: params.slug,
    lang: locale,
  });
  if (!product) notFound();
  return generatePageMetadata({
    page: product,
    slug: `products/${params.slug}`,
    type: "product",
    locale,
  });
}

export default async function ProductPage(
  props: AsyncPageProps<{ slug: string; lang?: string }>
) {
  const params = (await props.params)!;
  const locale = normalizeLocale(params.lang);
  const dictionary = await getDictionary(locale);
  const product = await fetchSanityProductBySlug({
    slug: params.slug,
    lang: locale,
  });
  if (!product) notFound();
  const settings = await fetchSanitySettings({ lang: locale });

  const productDoc = product as ProductDocument;
  const specifications = Array.isArray(productDoc.specifications)
    ? (productDoc.specifications as ProductSpecification[])
    : null;
  const spec = specifications?.[0];

  const productsPath = buildLocalizedPath(locale, "/products");
  const links = [
    { label: dictionary.productPage.breadcrumbs.products, href: productsPath },
    {
      label: product.title ?? dictionary.productPage.breadcrumbs.products,
      href: "#",
    },
  ];

  const atAGlance: SpecPair[] = [
    { label: dictionary.productPage.specLabels.sku, value: spec?.sku },
    { label: dictionary.productPage.specLabels.hsCode, value: spec?.hsCode },
    {
      label: dictionary.productPage.specLabels.minOrder,
      value: spec?.minOrder,
    },
    { label: dictionary.productPage.specLabels.origin, value: spec?.origin },
    {
      label: dictionary.productPage.specLabels.botanicalName,
      value: spec?.botanicalName,
    },
    { label: dictionary.productPage.specLabels.bestFor, value: spec?.bestFor },
  ];

  const quality: SpecPair[] = [
    {
      label: dictionary.productPage.specLabels.pungency,
      value: spec?.pungency,
    },
    {
      label: dictionary.productPage.specLabels.bindingCapacity,
      value: spec?.bindingCapacity,
    },
    {
      label: dictionary.productPage.specLabels.fatContent,
      value:
        typeof spec?.fatContent === "number"
          ? `${spec.fatContent}%`
          : undefined,
    },
  ];

  const other: SpecPair[] = [
    {
      label: dictionary.productPage.specLabels.moisture,
      value: spec?.moisture,
    },
    {
      label: dictionary.productPage.specLabels.shelfLife,
      value: spec?.shelfLife,
    },
    {
      label: dictionary.productPage.specLabels.allergenInfo,
      value: spec?.allergenInfo,
    },
    {
      label: dictionary.productPage.specLabels.attributes,
      value: spec?.productAttributes,
    },
    {
      label: dictionary.productPage.specLabels.certification,
      value: spec?.certification,
    },
  ];

  const productPath = `/products/${product.slug?.current ?? ""}`;
  const shareUrl = buildAbsoluteUrl(locale, productPath);

  interface ProductJsonLd {
    "@context": string;
    "@type": string;
    "@id": string;
    url: string;
    name?: string;
    description?: string;
    sku?: string;
    brand?: { "@type": string; name: string };
    image?: string[];
    category?: string[];
  }

  const jsonLd: ProductJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": shareUrl,
    url: shareUrl,
    name: product.title || undefined,
    description: product.meta?.description || product.excerpt || undefined,
    sku: spec?.sku || undefined,
    brand: settings?.siteName
      ? { "@type": "Organization", name: settings.siteName }
      : undefined,
    image: product.image?.asset?.url ? [product.image.asset.url] : undefined,
    category: Array.isArray(product.categories)
      ? product.categories
          .map((c) => c?.title)
          .filter((t): t is string => typeof t === "string" && t.length > 0)
      : undefined,
  };

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const productsUrl = `${SITE_URL}${buildLocalizedPath(locale, "/products")}`;
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}${buildLocalizedPath(locale, "/")}`,
      },
      { "@type": "ListItem", position: 2, name: "Products", item: productsUrl },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title || "Product",
        item: shareUrl,
      },
    ],
  } as const;

  return (
    <section className="container py-16 xl:py-20">
      <article>
        <script
          type="application/ld+json"
          // JSON-LD improves SEO. Keep minimal fields since pricing/availability are not part of this B2B flow.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <Breadcrumbs links={links} locale={locale} />

        {product.title && (
          <h1 className="mt-7 font-serif text-4xl font-extrabold md:text-5xl lg:text-6xl">
            {product.title}
          </h1>
        )}

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left column */}
          <div className="col-span-12 lg:col-span-8 mb-8">
            {product.image?.asset?._id && (
              <div className="mb-8">
                <Image
                  src={urlFor(product.image)
                    .width(1200)
                    .height(800)
                    .fit("crop")
                    .url()}
                  alt={
                    (typeof product.image?.alt === "string" &&
                      product.image.alt.trim()) ||
                    product.title ||
                    "Product image"
                  }
                  width={1200}
                  height={800}
                  className="aspect-video w-full rounded-lg object-cover shadow-md"
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  placeholder={
                    product.image?.asset?.metadata?.lqip ? "blur" : undefined
                  }
                  blurDataURL={
                    product.image?.asset?.metadata?.lqip || undefined
                  }
                  priority
                  fetchPriority="high"
                />
              </div>
            )}

            {/* Mobile excerpt */}
            {product.excerpt && (
              <p className="text-muted-foreground mb-6 lg:hidden">
                {product.excerpt}
              </p>
            )}

            {/* Body content for desktop */}
            {product.body && (
              <div className="prose dark:prose-invert hidden lg:block">
                <PortableTextRenderer value={product.body} locale={locale} />
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="col-span-12 h-fit lg:col-span-4 md:sticky md:top-20 space-y-6">
            {/* Key features */}
            {Array.isArray(product.keyFeatures) &&
              product.keyFeatures.length > 0 && (
                <div className="mb-6 rounded-lg border bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">
                    {dictionary.productPage.sections.keyFeatures}
                  </h2>
                  <ul className="flex flex-col gap-2 text-sm">
                    {product.keyFeatures
                      .map((kf) => {
                        // Normalize legacy objects or non-strings to strings
                        if (typeof kf === "string") return kf.trim();
                        if (kf && typeof kf === "object") {
                          const obj = kf as Record<string, unknown>;
                          const candidates = [
                            obj.featureText,
                            obj.text,
                            obj.title,
                          ];
                          const str = candidates.find(
                            (v): v is string => typeof v === "string"
                          );
                          return str ? str.trim() : "";
                        }
                        return "";
                      })
                      .filter((t) => t.length > 0)
                      .map((f, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-foreground/70" />
                          <p className="leading-5">{f}</p>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

            <SpecTable
              title={dictionary.productPage.sections.atAGlance}
              rows={atAGlance}
              monoValueLabels={[
                dictionary.productPage.specLabels.sku,
                dictionary.productPage.specLabels.hsCode,
              ]}
            />
            <SpecTable
              title={dictionary.productPage.sections.quality}
              rows={quality}
            />
            <SpecTable
              title={dictionary.productPage.sections.other}
              rows={other}
            />

            {/* Packaging */}
            {Array.isArray(product.packagingOptions) &&
              product.packagingOptions.length > 0 && (
                <div className="mb-6 rounded-lg border bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">
                    {dictionary.productPage.sections.packaging}
                  </h2>
                  <ul className="space-y-2 text-sm">
                    {product.packagingOptions.map((p, i) => {
                      const left = [
                        p.packagingType,
                        [p.sizeValue, p.sizeUnit].filter(Boolean).join(" "),
                      ]
                        .filter(Boolean)
                        .join(" · ");
                      const right = p.weightPerPallet || p.notes || "";
                      return (
                        <li
                          key={i}
                          className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2"
                        >
                          <span className="truncate pr-4">{left}</span>
                          {right && (
                            <span className="text-right text-muted-foreground">
                              {right}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

            {/* Categories */}
            {Array.isArray(product.categories) &&
              product.categories.length > 0 && (
                <div className="mb-6 rounded-lg border bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">
                    {dictionary.productPage.sections.categories}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((c) => (
                      <Link
                        key={c?._id}
                        href={buildLocalizedPath(
                          locale,
                          `/products/category/${c?.slug?.current || ""}`
                        )}
                      >
                        <Badge
                          variant="outline"
                          className="rounded-full bg-muted/50 px-3 py-1"
                        >
                          {c?.title || ""}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            {/* Share */}
            <div className="mb-6 flex items-center justify-between rounded-lg border bg-card p-6">
              <p className="text-sm font-medium">
                {dictionary.productPage.share.title}
              </p>
              <ul className="flex gap-2">
                <li>
                  <ExternalLink
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      shareUrl
                    )}`}
                    title={dictionary.productPage.share.facebook}
                    className="inline-flex rounded-full border p-2 transition-colors hover:bg-muted"
                  >
                    <Facebook className="h-4 w-4" />
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      shareUrl
                    )}`}
                    title={dictionary.productPage.share.twitter}
                    className="inline-flex rounded-full border p-2 transition-colors hover:bg-muted"
                  >
                    <Twitter className="h-4 w-4" />
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                      shareUrl
                    )}`}
                    title={dictionary.productPage.share.linkedin}
                    className="inline-flex rounded-full border p-2 transition-colors hover:bg-muted"
                  >
                    <Linkedin className="h-4 w-4" />
                  </ExternalLink>
                </li>
              </ul>
            </div>

            <Separator className="my-6" />
            {spec?.sku ? (
              <AddToInquiryButton
                item={{
                  id: spec.sku,
                  name: product.title || null,
                  productId: product._id || null,
                  slug: product.slug?.current || null,
                  imageUrl: product.image?.asset?.url || null,
                }}
                className="w-full"
              />
            ) : (
              <Button size="lg" className="w-full" aria-disabled>
                {dictionary.productPage.actions.addToInquiry}
              </Button>
            )}
          </div>
        </div>
      </article>
    </section>
  );
}
