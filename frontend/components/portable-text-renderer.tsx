import { PortableText, PortableTextProps } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { YouTubeEmbed } from "@next/third-parties/google";
import { Highlight, themes } from "prism-react-renderer";
import { CopyButton } from "@/components/ui/copy-button";
import { Lightbulb } from "lucide-react";
import { ReactNode, createElement } from "react";
import { resolveHref, resolveLinkHref } from "@/lib/resolveHref";
import { DOC_TYPES } from "@/lib/docTypes";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toText } from "@/lib/utils";
import Tag from "@/components/ui/tag";
import { buttonVariants } from "@/components/ui/button";
import Icon from "@/components/icon";

const getTextFromChildren = (children: ReactNode): string => {
  if (Array.isArray(children)) {
    return children
      .map((child) => {
        if (typeof child === "string") return child;
        if (typeof child === "number") return String(child);
        return "";
      })
      .join(" ");
  }
  return "";
};

const makePortableTextComponents = (
  locale: SupportedLocale
): PortableTextProps["components"] => ({
  types: {
    image: ({ value }) => {
      const { url, metadata } = value.asset;
      const { lqip, dimensions } = metadata;
      const alt = toText(value?.alt as unknown) || "Image";
      return (
        <Image
          className="m-auto aspect-video rounded-xl"
          src={url}
          alt={alt}
          width={dimensions.width}
          height={dimensions.height}
          placeholder={lqip ? "blur" : undefined}
          blurDataURL={lqip || undefined}
          quality={100}
        />
      );
    },
    youtube: ({ value }) => {
      const { videoId } = value;
      return (
        <div className="aspect-video max-w-180 rounded-xl overflow-hidden mb-4">
          <YouTubeEmbed videoid={videoId} params="rel=0" />
        </div>
      );
    },
    code: ({ value }) => {
      const filename = toText(value?.filename as unknown) || "";
      return (
        <div className="min-w-full grid my-4 overflow-x-auto rounded-lg border border-border text-xs lg:text-sm bg-primary">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border text-background font-mono">
            <div>{filename}</div>
            <CopyButton code={value.code} />
          </div>
          <Highlight
            theme={themes.vsLight}
            code={value.code}
            language={value.language || "typescript"}
          >
            {({ style, tokens, getLineProps, getTokenProps }) => (
              <pre
                style={{
                  ...style,
                  padding: "1.5rem",
                  margin: 0,
                  overflow: "auto",
                }}
              >
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      );
    },
    alert: ({ value }) => {
      const title = toText(value?.title as unknown);
      const description = toText(value?.description as unknown);
      return (
        <Alert className="my-4">
          <Lightbulb className="h-4 w-4" />
          {title && <AlertTitle>{title}</AlertTitle>}
          {description && <AlertDescription>{description}</AlertDescription>}
        </Alert>
      );
    },
    "section-header": ({ value }) => {
      // Portable Text-friendly rendering of the shared Section Header block
      const stackAlign = (value?.stackAlign as string) || "left";
      const sectionWidth = (value?.sectionWidth as string) || "default";
      const isNarrow = sectionWidth === "narrow";
      const tag = value?.tag as { text?: string; type?: "title" | "badge" };
      const title = value?.title as {
        text?: string;
        element?: string;
        size?: "small" | "default" | "large";
        weight?: "normal" | "medium" | "semibold" | "bold";
      };
      const description = toText(value?.description as unknown);
      const links = (value?.links as any[]) || [];

      const titleSize = title?.size || "default";
      const titleWeight = title?.weight || "bold";
      const ElementTag = (title?.element as string) || "h2";

      const titleSizeClasses = {
        small: "text-2xl md:text-3xl",
        default: "text-3xl md:text-4xl",
        large: "text-4xl md:text-6xl",
      }[titleSize];

      const titleWeightClasses = {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      }[titleWeight];

      return (
        <div
          className={[
            stackAlign === "center" ? "text-center" : undefined,
            isNarrow ? "max-w-3xl mx-auto" : "",
            "my-8 flex flex-col gap-4",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="flex flex-col gap-4">
            {tag && toText(tag.text) && (
              <Tag
                title={toText(tag.text) || ""}
                type={(tag.type as "title" | "badge") || "title"}
                element="p"
              />
            )}
            {title &&
              toText(title.text) &&
              createElement(
                ElementTag,
                { className: [titleSizeClasses, titleWeightClasses].join(" ") },
                toText(title.text)
              )}
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          {links && links.length > 0 && (
            <div
              className={[
                stackAlign === "center" ? "justify-center" : undefined,
                "flex flex-row flex-wrap items-center gap-4",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {links.map((link) => {
                const href = resolveLinkHref(link, locale);
                const target =
                  link?.isExternal && link?.target ? "_blank" : undefined;
                const rel = target ? "noopener noreferrer" : undefined;
                return (
                  <a
                    key={link._key}
                    href={href || "#"}
                    target={target}
                    rel={rel}
                    className={buttonVariants({
                      variant: link.buttonVariant || "default",
                    })}
                  >
                    <span className="flex items-center gap-2">
                      {toText(link.title)}
                      <Icon
                        iconVariant={link.iconVariant || "none"}
                        strokeWidth={1.5}
                      />
                    </span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      );
    },
    "product-callout": ({ value }) => {
      const variant = (value?.variant as string) || "compact";
      const align = (value?.align as string) || "left";
      const showImage = value?.showImage !== false;
      const overrideTitle = toText(value?.title as unknown) || null;
      const blurb = toText(value?.blurb as unknown) || null;
      const ctaLabel = toText(value?.ctaLabel as unknown) || "View product";

      const product = value?.product as any;
      if (!product) {
        return (
          <div className="my-6 rounded border p-4 text-sm text-muted-foreground">
            Missing product (product-callout)
          </div>
        );
      }

      const href =
        resolveHref(DOC_TYPES.PRODUCT, product?.slug?.current, locale) || "#";
      const imageUrl = product?.image?.asset?.url || null;
      const imageMeta = product?.image?.asset?.metadata || null;
      const computedTitle = overrideTitle || toText(product?.title as unknown) || "";
      const computedBlurb = blurb || toText(product?.excerpt as unknown) || "";

      // Build minimal item shape for existing ProductCard component
      const item = {
        _id: product?._id || product?.slug?.current || Math.random().toString(),
        slug: product?.slug?.current || "",
        title: computedTitle,
        sku: product?.sku || null,
        imageUrl: showImage ? imageUrl : null,
        imageMeta,
        features: null,
        productAttributes: null,
        purity: null,
        categories: Array.isArray(product?.categories)
          ? product.categories.map((c: any) => ({
              _id: c?._id || null,
              title: c?.title || null,
              slug: c?.slug?.current || c?.slug || null,
              href:
                c?.slug?.current || c?.slug
                  ? resolveHref(
                      DOC_TYPES.PRODUCT_CATEGORY,
                      c?.slug?.current || c?.slug,
                      locale
                    )
                  : null,
            }))
          : null,
        href,
      } as any;

      // Layout wrappers
      const wrapperClasses = [
        "my-6",
        align === "center" ? "mx-auto max-w-3xl" : undefined,
        variant === "featured" ? "max-w-5xl" : undefined,
      ]
        .filter(Boolean)
        .join(" ");

      if (variant === "featured") {
        // Side-by-side layout with bigger image and content
        return (
          <div
            className={[
              wrapperClasses,
              "rounded-xl border p-4 md:p-6 bg-background",
            ].join(" ")}
         >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              {showImage && imageUrl ? (
                <div className={align === "center" ? "mx-auto" : undefined}>
                  <Image
                    src={imageUrl}
                    alt={computedTitle || "Product image"}
                    width={960}
                    height={720}
                    className="w-full h-auto rounded-lg object-cover"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    placeholder={imageMeta?.lqip ? "blur" : undefined}
                    blurDataURL={imageMeta?.lqip || undefined}
                  />
                </div>
              ) : null}
              <div className={[align === "center" ? "text-center" : undefined].join(" ")}>
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  {computedTitle}
                </h3>
                {computedBlurb && (
                  <p className="mt-3 text-muted-foreground">{computedBlurb}</p>
                )}
                <div
                  className={[
                    "mt-5 flex flex-wrap gap-3",
                    align === "center" ? "justify-center" : undefined,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <a href={href} className={buttonVariants({ variant: "default" })}>
                    <span className="flex items-center gap-2">
                      {ctaLabel}
                      <Icon iconVariant="arrow-right" strokeWidth={1.5} />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // Compact: reuse ProductCard + optional text/CTA below
      return (
        <div className={wrapperClasses}>
          {/* Reuse existing ProductCard for consistent styling */}
          {/* @ts-expect-error: lazy import type shape */}
          <ProductCard item={item} locale={locale} />
          {(blurb || ctaLabel) && (
            <div
              className={[
                "mt-3 flex flex-col gap-3",
                align === "center" ? "items-center text-center" : undefined,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {blurb && (
                <p className="text-sm text-muted-foreground max-w-3xl">
                  {blurb}
                </p>
              )}
              {href && (
                <a href={href} className={buttonVariants({ variant: "default" })}>
                  <span className="flex items-center gap-2">
                    {ctaLabel}
                    <Icon iconVariant="arrow-right" strokeWidth={1.5} />
                  </span>
                </a>
              )}
            </div>
          )}
        </div>
      );
    },
  },
  block: {
    normal: ({ children }) => <p className="mb-4">{children}</p>,
    h1: ({ children }) => {
      const text = getTextFromChildren(children);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return (
        <h1 id={id} className="my-4 font-serif font-semibold scroll-mt-20">
          {children}
        </h1>
      );
    },
    h2: ({ children }) => {
      const text = getTextFromChildren(children);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return (
        <h2 id={id} className="my-4 font-serif font-semibold scroll-mt-20">
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const text = getTextFromChildren(children);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return (
        <h3 id={id} className="my-4 font-semibold scroll-mt-20">
          {children}
        </h3>
      );
    },
    h4: ({ children }) => {
      const text = getTextFromChildren(children);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return (
        <h4 id={id} className="my-4 font-semibold scroll-mt-20">
          {children}
        </h4>
      );
    },
    h5: ({ children }) => {
      const text = getTextFromChildren(children);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return (
        <h5 id={id} className="my-4 font-semibold scroll-mt-20">
          {children}
        </h5>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-4 border-border pl-4 italic font-medium">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const href = resolveLinkHref(
        {
          isExternal: value?.isExternal ?? undefined,
          href: value?.href ?? undefined,
          internalType: value?.internalType ?? undefined,
          internalSlug: value?.internalSlug ?? undefined,
        },
        locale
      );
      const target = value?.isExternal && value?.target ? "_blank" : undefined;
      const rel = target ? "noopener noreferrer" : undefined;
      return (
        <Link
          href={href || "#"}
          target={target}
          rel={rel}
          className="underline"
        >
          {children}
        </Link>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-4 mb-4">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-4 mb-4">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-2">{children}</li>,
    number: ({ children }) => <li className="mb-2">{children}</li>,
  },
});

const PortableTextRenderer = ({
  value,
  locale = FALLBACK_LOCALE,
}: {
  value: PortableTextProps["value"];
  locale?: SupportedLocale;
}) => {
  return (
    <PortableText
      value={value}
      components={makePortableTextComponents(locale)}
    />
  );
};

export default PortableTextRenderer;
