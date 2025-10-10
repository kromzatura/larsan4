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

export async function generateMetadata(props: {
  params: Promise<{ slug: string; lang?: string }>;
}) {
  const params = await props.params;
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
  });
}

export default async function ProductPage(props: {
  params: Promise<{ slug: string; lang?: string }>;
}) {
  const params = await props.params;
  const locale = normalizeLocale(params.lang);
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
    { label: "Products", href: productsPath },
    { label: product.title ?? "Product", href: "#" },
  ];

  const atAGlance: SpecPair[] = [
    { label: "SKU", value: spec?.sku },
    { label: "HS Code", value: spec?.hsCode },
    { label: "Min. order", value: spec?.minOrder },
    { label: "Origin", value: spec?.origin },
    { label: "Botanical name", value: spec?.botanicalName },
    { label: "Best for", value: spec?.bestFor },
  ];

  const quality: SpecPair[] = [
    { label: "Pungency", value: spec?.pungency },
    { label: "Binding capacity", value: spec?.bindingCapacity },
    {
      label: "Fat content",
      value:
        typeof spec?.fatContent === "number"
          ? `${spec.fatContent}%`
          : undefined,
    },
  ];

  const other: SpecPair[] = [
    { label: "Moisture", value: spec?.moisture },
    { label: "Shelf life", value: spec?.shelfLife },
    { label: "Allergen info", value: spec?.allergenInfo },
    { label: "Attributes", value: spec?.productAttributes },
    { label: "Certification", value: spec?.certification },
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
        <Breadcrumbs links={links} />

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
                <PortableTextRenderer value={product.body} />
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
                    Key features
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

            <SpecTable title="At a glance" rows={atAGlance} />
            <SpecTable title="Quality" rows={quality} />
            <SpecTable title="Other" rows={other} />

            {/* Packaging */}
            {Array.isArray(product.packagingOptions) &&
              product.packagingOptions.length > 0 && (
                <div className="rounded-lg border p-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Packaging
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
                    Categories
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
              <p className="text-sm font-medium">Share this product</p>
              <ul className="flex gap-2">
                <li>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      shareUrl
                    )}`}
                    target="_blank"
                    rel="noopener"
                    title="Share on Facebook"
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
                    title="Share on X (Twitter)"
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
                    title="Share on LinkedIn"
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
                Add to Inquiry
              </Button>
            )}
          </div>
        </div>
      </article>
    </section>
  );
}
