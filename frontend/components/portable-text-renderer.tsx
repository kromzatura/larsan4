import { PortableText, PortableTextProps } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { YouTubeEmbed } from "@next/third-parties/google";
import { Highlight, themes } from "prism-react-renderer";
import { CopyButton } from "@/components/ui/copy-button";
import { Lightbulb } from "lucide-react";
import { ReactNode } from "react";
import { resolveHref, resolveLinkHref } from "@/lib/resolveHref";
import { DOC_TYPES } from "@/lib/docTypes";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toText } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Icon from "@/components/icon";

// Minimal types for PT product-callout to avoid `any`
type ProductLike = {
  _id?: string | null;
  title?: unknown;
  excerpt?: unknown;
  slug?: { current?: string | null } | null;
  sku?: string | null;
  image?: {
    asset?: {
      url?: string | null;
      metadata?: {
        lqip?: string | null;
        dimensions?: { width?: number | null; height?: number | null } | null;
      } | null;
    } | null;
  } | null;
};
// ProductCard not used anymore for product-callout (featured-only layout)

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
    "product-callout": ({ value }) => {
      const align = (value?.align as string) || "left";
      const showImage = value?.showImage !== false;
      const overrideTitle = toText(value?.title as unknown) || null;
      const blurb = toText(value?.blurb as unknown) || null;
      const ctaLabel = toText(value?.ctaLabel as unknown) || "View product";

      const product = (value?.product as unknown as ProductLike) || null;
      if (!product) {
        return (
          <div className="my-6 rounded border p-4 text-sm text-muted-foreground">
            Missing product (product-callout)
          </div>
        );
      }

      const slugCurrent = product?.slug?.current || undefined;
      const href = resolveHref(DOC_TYPES.PRODUCT, slugCurrent, locale) || "#";
      const imageUrl = product?.image?.asset?.url || null;
      const imageMeta = product?.image?.asset?.metadata || null;
      const computedTitle =
        overrideTitle || toText(product?.title as unknown) || "";
      const computedBlurb = blurb || toText(product?.excerpt as unknown) || "";

      const wrapperClasses = [
        "my-6",
        align === "center" ? "mx-auto max-w-5xl" : "max-w-5xl",
      ]
        .filter(Boolean)
        .join(" ");

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
            <div
              className={[align === "center" ? "text-center" : undefined].join(
                " "
              )}
            >
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
                <a
                  href={href}
                  className={buttonVariants({ variant: "default" })}
                >
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
