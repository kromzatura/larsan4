import { notFound } from "next/navigation";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Tag from "@/components/ui/tag";
import { CheckCircle2, Facebook, Linkedin, Twitter } from "lucide-react";
import {
  fetchSanityProductBySlug,
  fetchSanityProductSlugs,
} from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { urlFor } from "@/sanity/lib/image";
import type { PRODUCT_QUERYResult } from "@/sanity.types";

type SpecPair = { label: string; value?: string | number | null };

function SpecTable({ title, rows }: { title: string; rows: SpecPair[] }) {
  const filtered = rows.filter((r) => r.value !== undefined && r.value !== null && r.value !== "");
  if (filtered.length === 0) return null;
  return (
    <div className="mt-5 rounded-lg border p-4">
      <p className="mb-3 text-sm font-medium">{title}</p>
      <div className="grid grid-cols-2 gap-y-2 text-sm">
        {filtered.map((r) => (
          <Fragment key={`${title}-${r.label}`}>
            <div className="text-muted-foreground">{r.label}</div>
            <div className="text-right">{r.value}</div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = await fetchSanityProductSlugs();
  return slugs
    .filter((s) => s.slug?.current)
    .map((s) => ({ slug: s.slug!.current! }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const product = await fetchSanityProductBySlug({ slug: params.slug });
  if (!product) notFound();
  return generatePageMetadata({ page: product, slug: `products/${params.slug}`, type: "product" });
}

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const product = await fetchSanityProductBySlug({ slug: params.slug });
  if (!product) notFound();

  const links = [
    { label: "Products", href: "/products" },
    { label: product.title ?? "Product", href: "#" },
  ];

  const atAGlance: SpecPair[] = [
    { label: "SKU", value: product.sku || undefined },
    { label: "HS Code", value: product.hsCode || undefined },
    { label: "Min. order", value: product.minOrder || undefined },
    { label: "Origin", value: product.origin || undefined },
    { label: "Botanical name", value: product.botanicalName || undefined },
    { label: "Best for", value: product.bestFor || undefined },
  ];

  const quality: SpecPair[] = [
    { label: "Pungency", value: product.pungency || undefined },
    { label: "Binding capacity", value: product.bindingCapacity || undefined },
    {
      label: "Fat content",
      value: typeof product.fatContent === "number" ? `${product.fatContent}%` : undefined,
    },
  ];

  const other: SpecPair[] = [
    { label: "Moisture", value: product.moisture || undefined },
    { label: "Shelf life", value: product.shelfLife || undefined },
    { label: "Allergen info", value: product.allergenInfo || undefined },
    { label: "Attributes", value: product.productAttributes || undefined },
    { label: "Certification", value: product.certification || undefined },
  ];

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/products/${product.slug?.current}`;

  return (
    <section className="container py-16 xl:py-20">
      <article>
        <Breadcrumbs links={links} />

        {product.title && (
          <h1 className="mt-7 text-3xl font-semibold md:text-5xl">{product.title}</h1>
        )}

        <div className="mt-12 grid grid-cols-12 gap-8">
          {/* Left column */}
          <div className="col-span-12 lg:col-span-6">
            {product.image?.asset?._id && (
              <div className="mb-8">
                <Image
                  src={urlFor(product.image).width(1200).height(800).fit("crop").url()}
                  alt={product.image.alt || product.title || "Product image"}
                  width={1200}
                  height={800}
                  className="aspect-video w-full rounded-lg object-cover"
                />
              </div>
            )}

            {/* Mobile excerpt */}
            {product.excerpt && (
              <p className="text-muted-foreground mb-6 lg:hidden">{product.excerpt}</p>
            )}

            {/* Body content for desktop */}
            {product.body && (
              <div className="prose dark:prose-invert hidden lg:block">
                <PortableTextRenderer value={product.body} />
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="col-span-12 h-fit lg:col-span-6 md:sticky md:top-20">
            {/* Key features */}
            {Array.isArray(product.keyFeatures) && product.keyFeatures.length > 0 && (
              <div>
                <p className="mb-2 text-lg font-semibold">Key features</p>
                <ul className="flex flex-col gap-2 text-sm">
                  {product.keyFeatures.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <p>{f}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <SpecTable title="At a glance" rows={atAGlance} />
            <SpecTable title="Quality" rows={quality} />
            <SpecTable title="Other" rows={other} />

            {/* Packaging */}
            {Array.isArray(product.packagingOptions) && product.packagingOptions.length > 0 && (
              <div className="mt-5">
                <p className="mb-3 text-sm font-medium">Packaging</p>
                <ul className="space-y-2 text-sm">
                  {product.packagingOptions.map((p, i) => {
                    const parts = [
                      p.packagingType,
                      [p.sizeValue, p.sizeUnit].filter(Boolean).join(" "),
                      p.weightPerPallet,
                      p.notes,
                    ].filter(Boolean);
                    const line = parts.join(" • ");
                    return (
                      <li key={i} className="rounded-md border p-3">{line}</li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Categories */}
            {Array.isArray(product.categories) && product.categories.length > 0 && (
              <div className="mt-5">
                <p className="mb-3 text-sm font-medium">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {product.categories.map((c) => (
                    <Link key={c?._id} href={`/products/category/${c?.slug?.current || ""}`}>
                        <Tag title={c?.title || ""} type="badge" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="mt-5 flex items-center justify-between">
              <p className="text-sm font-medium">Share this product</p>
              <ul className="flex gap-2">
                <li>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
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
                    href={`https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
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
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}`}
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
            <Button size="lg" className="w-full" aria-disabled>
              Add to Inquiry
            </Button>
          </div>
        </div>
      </article>
    </section>
  );
}
