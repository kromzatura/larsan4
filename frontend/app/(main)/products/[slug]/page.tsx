import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PortableTextRenderer from "@/components/portable-text-renderer";
import {
  fetchSanityProductBySlug,
  fetchSanityProductsStaticParams,
} from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { urlFor } from "@/sanity/lib/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import type { PRODUCT_QUERYResult } from "@/sanity.types";

type BreadcrumbLink = {
  label: string;
  href: string;
};

export async function generateStaticParams() {
  const products = await fetchSanityProductsStaticParams();

  return products.map((p) => ({ slug: p.slug?.current }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const product = await fetchSanityProductBySlug({ slug: params.slug });

  if (!product) {
    notFound();
  }

  return generatePageMetadata({
    page: product,
    slug: `products/${params.slug}`,
    type: "page",
  });
}

function SpecRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between py-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-4 max-w-[60%] text-right">{String(value)}</span>
    </div>
  );
}

function PackagingList({
  packaging,
}: {
  packaging: NonNullable<PRODUCT_QUERYResult>["packagingOptions"];
}) {
  if (!packaging || packaging.length === 0) return null;
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium">Packaging</h3>
      <ul className="space-y-2 text-sm">
        {packaging.map((p) => (
          <li key={p._key} className="rounded border p-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>
                {p.packagingType}
                {p.sizeValue ? ` · ${p.sizeValue}${p.sizeUnit ? ` ${p.sizeUnit}` : ""}` : ""}
              </span>
              {p.weightPerPallet && (
                <span className="text-muted-foreground">{p.weightPerPallet}</span>
              )}
            </div>
            {p.notes && <p className="mt-1 text-muted-foreground">{p.notes}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function ProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const product = await fetchSanityProductBySlug(params);

  if (!product) {
    notFound();
  }

  const links: BreadcrumbLink[] = [
    { label: "Products", href: "/products" },
    { label: product.title || "Product", href: "#" },
  ];

  return (
    <section className="container py-16 xl:py-20">
      <article>
        <Breadcrumbs links={links} />

        {product.title && (
          <h1 className="mt-7 mb-6 max-w-3xl text-3xl font-semibold md:text-5xl">
            {product.title}
          </h1>
        )}

        {/* No author strip here; author card is in the right column. */}

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6">
            {product.image && product.image.asset && (
              <div className="mb-6 overflow-hidden rounded-md border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={urlFor(product.image).url()}
                  alt={product.image.alt || product.title || ""}
                  className="h-auto w-full"
                />
              </div>
            )}

            {/* Mobile: show excerpt instead of full body */}
            {product.excerpt && (
              <p className="md:hidden text-muted-foreground">{product.excerpt}</p>
            )}

            {product.body && (
              <div className="hidden md:block">
                <PortableTextRenderer value={product.body} />
              </div>
            )}
          </div>

          <div className="sticky top-18 col-span-12 lg:col-span-6 h-fit lg:pl-8">
            <div className="space-y-6">
              {/* Key features */}
              {product.keyFeatures && product.keyFeatures.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-medium">Key features</h3>
                  <ul className="list-inside list-disc space-y-1 text-sm">
                    {product.keyFeatures.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Author removed per request */}

              {/* At a glance */}
              <div>
                <h3 className="mb-2 text-sm font-medium">At a glance</h3>
                <div className="divide-y rounded border">
                  <div className="p-3">
                    <SpecRow label="SKU" value={product.sku} />
                    <SpecRow label="HS Code" value={product.hsCode} />
                    <SpecRow label="Min. order" value={product.minOrder} />
                    <SpecRow label="Origin" value={product.origin} />
                    <SpecRow label="Botanical name" value={product.botanicalName} />
                    <SpecRow label="Best for" value={product.bestFor} />
                  </div>
                </div>
              </div>

              {/* Quality */}
              <div>
                <h3 className="mb-2 text-sm font-medium">Quality</h3>
                <div className="divide-y rounded border">
                  <div className="p-3">
                    <SpecRow label="Pungency" value={product.pungency} />
                    <SpecRow label="Binding capacity" value={product.bindingCapacity} />
                    {typeof product.fatContent === "number" && (
                      <SpecRow label="Fat content" value={product.fatContent} />
                    )}
                    <SpecRow label="Purity" value={product.purity} />
                    <SpecRow label="Moisture" value={product.moisture} />
                  </div>
                </div>
              </div>

              {/* Other */}
              <div>
                <h3 className="mb-2 text-sm font-medium">Other</h3>
                <div className="divide-y rounded border">
                  <div className="p-3">
                    <SpecRow label="Shelf life" value={product.shelfLife} />
                    <SpecRow label="Allergen info" value={product.allergenInfo} />
                    <SpecRow label="Attributes" value={product.productAttributes} />
                    <SpecRow label="Certification" value={product.certification} />
                  </div>
                </div>
              </div>

              {/* Packaging */}
              <PackagingList packaging={product.packagingOptions} />
              {/* Categories */}
              {product.categories && product.categories.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-medium">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/products/category/${cat.slug?.current}`}
                        className="inline-flex items-center rounded-full border px-3 py-1 text-xs hover:bg-muted"
                      >
                        {cat.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">Share this product</p>
                <ul className="flex gap-2">
                  <li>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug?.current}`}
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
                      href={`https://x.com/intent/tweet?url=${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug?.current}`}
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
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug?.current}`}
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

              <Separator />

              {/* CTA placeholder */}
              <Button size="lg" className="w-full" variant="default">
                Add to Inquiry
              </Button>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
