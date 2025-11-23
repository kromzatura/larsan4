import { useMemo, type ReactNode } from "react";
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextProps,
} from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { YouTubeEmbed } from "@next/third-parties/google";
import { Highlight, themes } from "prism-react-renderer";
import { Lightbulb } from "lucide-react";

import { CopyButton } from "@/components/ui/copy-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import Icon from "@/components/icon";
import { resolveHref, resolveLinkHref } from "@/lib/resolveHref";
import { DOC_TYPES } from "@/lib/docTypes";
import { type SupportedLocale, FALLBACK_LOCALE } from "@/lib/i18n/config";
import { toText } from "@/lib/utils";

// --- Types ---

type PortableTextImage = {
  asset: {
    url: string;
    metadata: {
      lqip?: string | null;
      dimensions: { width: number; height: number };
    };
  };
  alt?: string;
};

type PortableTextCode = {
  code: string;
  language?: string;
  filename?: string;
};

// --- Helpers ---

const extractTextFromNode = (node: ReactNode): string => {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractTextFromNode).join("");
  // Handle React Elements (deep traversal might be needed depending on complexity,
  // but usually PT headings are flat strings/spans)
  if (typeof node === "object" && node && "props" in node) {
    const props = (node as { props?: { children?: ReactNode } }).props;
    if (props && props.children) return extractTextFromNode(props.children);
  }
  return "";
};

const generateId = (children: ReactNode): string => {
  const text = extractTextFromNode(children);
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// --- Sub-Components ---

const CodeBlock = ({ value }: { value: PortableTextCode }) => {
  return (
    <div className="min-w-full grid my-4 overflow-x-auto rounded-lg border border-border text-xs lg:text-sm bg-primary/5">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50 font-mono text-foreground">
        <span>{value.filename || ""}</span>
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
              backgroundColor: "transparent",
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
};

const ProductCallout = ({
  value,
  locale,
}: {
  value: {
    align?: string;
    showImage?: boolean;
    title?: unknown;
    blurb?: unknown;
    ctaLabel?: unknown;
    product?: {
      slug?: { current?: string | null } | null;
      title?: unknown;
      excerpt?: unknown;
      image?: {
        asset?: {
          url?: string | null;
          metadata?: {
            lqip?: string | null;
            dimensions?: {
              width?: number | null;
              height?: number | null;
            } | null;
          } | null;
        } | null;
      } | null;
    } | null;
  };
  locale: SupportedLocale;
}) => {
  const { align = "left", showImage = true, product } = value || {};

  if (!product) {
    return null;
  }

  const slugCurrent = product.slug?.current;
  const href =
    resolveHref(DOC_TYPES.PRODUCT, slugCurrent || undefined, locale) || "#";
  const imageUrl = product.image?.asset?.url;
  const imageMeta = product.image?.asset?.metadata;

  const title = toText(value?.title) || toText(product.title);
  const blurb = toText(value?.blurb) || toText(product.excerpt);
  const ctaLabel = toText(value?.ctaLabel) || "View product";

  const isCentered = align === "center";

  return (
    <div
      className={`my-6 rounded-xl border bg-card p-4 md:p-6 ${
        isCentered ? "mx-auto max-w-5xl" : "max-w-5xl"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
        {showImage !== false && imageUrl && (
          <div className={isCentered ? "mx-auto" : undefined}>
            <Image
              src={imageUrl}
              alt={title || "Product image"}
              width={960}
              height={720}
              className="w-full h-auto rounded-lg object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              placeholder={imageMeta?.lqip ? "blur" : "empty"}
              blurDataURL={imageMeta?.lqip || undefined}
            />
          </div>
        )}
        <div className={isCentered ? "text-center" : undefined}>
          <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {title}
          </h3>
          {blurb && <p className="mt-3 text-muted-foreground">{blurb}</p>}
          <div
            className={`mt-5 flex flex-wrap gap-3 ${
              isCentered ? "justify-center" : ""
            }`}
          >
            <Link
              href={href}
              className={buttonVariants({ variant: "default" })}
            >
              <span className="flex items-center gap-2">
                {ctaLabel}
                <Icon iconVariant="arrow-right" strokeWidth={1.5} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Renderer ---

const PortableTextRenderer = ({
  value,
  locale = FALLBACK_LOCALE,
}: {
  value: PortableTextProps["value"];
  locale?: SupportedLocale;
}) => {
  // MEMOIZATION: Critical to prevent re-mounting components on every parent render
  const components: PortableTextComponents = useMemo(
    () => ({
      types: {
        image: ({ value }: { value: PortableTextImage }) => {
          const { url, metadata } = value.asset;
          return (
            <figure className="my-8">
              <Image
                className="m-auto aspect-video rounded-xl object-cover"
                src={url}
                alt={value.alt || ""}
                width={metadata.dimensions.width}
                height={metadata.dimensions.height}
                placeholder={metadata.lqip ? "blur" : "empty"}
                blurDataURL={metadata.lqip || undefined}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 700px"
              />
              {value.alt && (
                <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                  {value.alt}
                </figcaption>
              )}
            </figure>
          );
        },
        youtube: ({ value }: { value: { videoId?: string } }) => (
          <div className="aspect-video w-full max-w-2xl mx-auto rounded-xl overflow-hidden my-8 bg-muted">
            {value.videoId ? (
              <YouTubeEmbed videoid={value.videoId} params="rel=0" />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Video unavailable
              </div>
            )}
          </div>
        ),
        code: CodeBlock,
        alert: ({
          value,
        }: {
          value: { title?: unknown; description?: unknown };
        }) => (
          <Alert className="my-6">
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>{toText(value.title)}</AlertTitle>
            <AlertDescription>{toText(value.description)}</AlertDescription>
          </Alert>
        ),
        "product-callout": ({ value }) => (
          <ProductCallout value={value} locale={locale} />
        ),
      },
      block: {
        normal: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
        h1: ({ children }) => (
          <h1
            id={generateId(children)}
            className="mt-8 mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl font-serif"
          >
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2
            id={generateId(children)}
            className="mt-10 mb-4 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 font-serif"
          >
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3
            id={generateId(children)}
            className="mt-8 mb-4 scroll-m-20 text-2xl font-semibold tracking-tight"
          >
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4
            id={generateId(children)}
            className="mt-8 mb-4 scroll-m-20 text-xl font-semibold tracking-tight"
          >
            {children}
          </h4>
        ),
        h5: ({ children }) => (
          <h5
            id={generateId(children)}
            className="mt-8 mb-4 text-lg font-semibold tracking-tight"
          >
            {children}
          </h5>
        ),
        blockquote: ({ children }) => (
          <blockquote className="mt-6 border-l-2 pl-6 italic text-muted-foreground">
            {children}
          </blockquote>
        ),
      },
      marks: {
        link: ({ value, children }) => {
          const href = resolveLinkHref(
            {
              isExternal: value?.isExternal,
              href: value?.href,
              internalType: value?.internalType,
              internalSlug: value?.internalSlug,
            },
            locale
          );

          const isExternal = value?.isExternal || href?.startsWith("http");

          return (
            <Link
              href={href || "#"}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="font-medium text-primary underline underline-offset-4 hover:no-underline"
            >
              {children}
            </Link>
          );
        },
      },
      list: {
        bullet: ({ children }) => (
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>
        ),
        number: ({ children }) => (
          <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
        ),
      },
      listItem: {
        bullet: ({ children }) => <li>{children}</li>,
        number: ({ children }) => <li>{children}</li>,
      },
    }),
    [locale]
  );

  return <PortableText value={value} components={components} />;
};

export default PortableTextRenderer;
