import { notFound } from "next/navigation";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PortableTextRenderer from "@/components/portable-text-renderer";
import AddToInquiryButton from "@/components/inquiry/add-to-inquiry-button";
import { Separator } from "@/components/ui/separator";
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
import { urlFor } from "@/sanity/lib/image";
import { normalizeLocale, buildLocalizedPath } from "@/lib/i18n/routing";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";
import type { AsyncPageProps } from "@/lib/types/next";
import { getDictionary } from "@/lib/i18n/dictionaries";

type SpecPair = { label: string; value?: string | number | null };

function SpecTable({ title, rows }: { title: string; rows: SpecPair[] }) {
  const filtered = rows.filter(
    (r) => r.value !== undefined && r.value !== null && r.value !== ""
  );
  if (filtered.length === 0) return null;
  return (
    <div className="rounded-lg border p-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="grid grid-cols-2 gap-y-2 text-sm">
        {filtered.map((r) => (
          <Fragment key={`${title}-${r.label}`}>
            <div className="text-muted-foreground">{r.label}</div>
            <div className="text-right font-medium">{r.value}</div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = await fetchSanityProductSlugs({ lang: FALLBACK_LOCALE });
  return slugs
    .filter((s) => s.slug?.current)
    .map((s) => ({ slug: s.slug!.current! }));
}

export async function generateMetadata(
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
  return generatePageMetadata({
    page: product,
    slug: `products/${params.slug}`,
    type: "product",
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

  const productDoc = product as ProductDocument;
  const specifications = Array.isArray(productDoc.specifications)
    ? (productDoc.specifications as ProductSpecification[])
    : null;
  const spec = specifications?.[0];

  const productsPath = buildLocalizedPath(locale, "/products");
  const links = [
    { label: dictionary.productPage.breadcrumbs.products, href: productsPath },
    { label: product.title ?? dictionary.productPage.breadcrumbs.products, href: "#" },
  ];

  const atAGlance: SpecPair[] = [
    { label: dictionary.productPage.specLabels.sku, value: spec?.sku },
    { label: dictionary.productPage.specLabels.hsCode, value: spec?.hsCode },
    { label: dictionary.productPage.specLabels.minOrder, value: spec?.minOrder },
    { label: dictionary.productPage.specLabels.origin, value: spec?.origin },
    { label: dictionary.productPage.specLabels.botanicalName, value: spec?.botanicalName },
    { label: dictionary.productPage.specLabels.bestFor, value: spec?.bestFor },
  ];

  const quality: SpecPair[] = [
    { label: dictionary.productPage.specLabels.pungency, value: spec?.pungency },
    { label: dictionary.productPage.specLabels.bindingCapacity, value: spec?.bindingCapacity },
    {
      label: dictionary.productPage.specLabels.fatContent,
      value:
        typeof spec?.fatContent === "number"
          ? `${spec.fatContent}%`
          : undefined,
    },
  ];

  const other: SpecPair[] = [
    { label: dictionary.productPage.specLabels.moisture, value: spec?.moisture },
    { label: dictionary.productPage.specLabels.shelfLife, value: spec?.shelfLife },
    { label: dictionary.productPage.specLabels.allergenInfo, value: spec?.allergenInfo },
    { label: dictionary.productPage.specLabels.attributes, value: spec?.productAttributes },
    { label: dictionary.productPage.specLabels.certification, value: spec?.certification },
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const sharePath = buildLocalizedPath(
    locale,
    `/products/${product.slug?.current ?? ""}`
  );
  const shareUrl = `${siteUrl}${sharePath}`;

  return (
    <section className="container py-16 xl:py-20">
      <article>
        <Breadcrumbs links={links} locale={locale} />

        {product.title && (
          <h1 className="mt-7 text-3xl font-semibold md:text-5xl">
            {product.title}
          </h1>
        )}

        <div className="mt-12 grid grid-cols-12 gap-8">
          {/* Left column */}
          <div className="col-span-12 lg:col-span-6">
            {product.image?.asset?._id && (
              <div className="mb-8">
                <Image
                  src={urlFor(product.image)
                    .width(1200)
                    .height(800)
                    .fit("crop")
                    .url()}
                  alt={product.image.alt || product.title || "Product image"}
                  width={1200}
                  height={800}
                  className="aspect-video w-full rounded-lg object-cover"
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
          <div className="col-span-12 h-fit lg:col-span-6 md:sticky md:top-20 space-y-5">
            {/* Key features */}
            {Array.isArray(product.keyFeatures) &&
              product.keyFeatures.length > 0 && (
                <div className="rounded-lg border p-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {dictionary.productPage.sections.keyFeatures}
                  </p>
                  <ul className="flex flex-col gap-2 text-sm">
                    {product.keyFeatures.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-foreground/70" />
                        <p className="leading-5">{f}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            <SpecTable title={dictionary.productPage.sections.atAGlance} rows={atAGlance} />
            <SpecTable title={dictionary.productPage.sections.quality} rows={quality} />
            <SpecTable title={dictionary.productPage.sections.other} rows={other} />

            {/* Packaging */}
            {Array.isArray(product.packagingOptions) &&
              product.packagingOptions.length > 0 && (
                <div className="rounded-lg border p-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {dictionary.productPage.sections.packaging}
                  </p>
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
                          className="flex items-center justify-between rounded-md border px-3 py-2 bg-muted/30"
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
                <div className="rounded-lg border p-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {dictionary.productPage.sections.categories}
                  </p>
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
                          className="rounded-full px-3 py-1 bg-muted/50"
                        >
                          {c?.title || ""}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            {/* Share */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <p className="text-sm font-medium">{dictionary.productPage.share.title}</p>
              <ul className="flex gap-2">
                <li>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      shareUrl
                    )}`}
                    target="_blank"
                    rel="noopener"
                    title={dictionary.productPage.share.facebook}
                    className="inline-flex rounded-full border p-2 transition-colors hover:bg-muted"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a
                    href={`https://x.com/intent/tweet?url=${encodeURIComponent(
                      shareUrl
                    )}`}
                    target="_blank"
                    rel="noopener"
                    title={dictionary.productPage.share.twitter}
                    className="inline-flex rounded-full border p-2 transition-colors hover:bg-muted"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                      shareUrl
                    )}`}
                    target="_blank"
                    rel="noopener"
                    title={dictionary.productPage.share.linkedin}
                    className="inline-flex rounded-full border p-2 transition-colors hover:bg-muted"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
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
