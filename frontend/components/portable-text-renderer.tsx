import { PortableText, PortableTextProps } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { YouTubeEmbed } from "@next/third-parties/google";
import { Highlight, themes } from "prism-react-renderer";
import { CopyButton } from "@/components/ui/copy-button";
import { Lightbulb } from "lucide-react";
import { ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

const portableTextComponents: PortableTextProps["components"] = {
  types: {
    image: ({ value }) => {
      const { url, metadata } = value.asset;
      const { lqip, dimensions } = metadata;
      return (
        <Image
          className="m-auto aspect-video rounded-xl"
          src={url}
          alt={value.alt || "Image"}
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
      return (
        <div className="min-w-full grid my-4 overflow-x-auto rounded-lg border border-border text-xs lg:text-sm bg-primary">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border text-background font-mono">
            <div>{value.filename || ""}</div>
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
      const { title, description } = value;
      return (
        <Alert className="my-4">
          <Lightbulb className="h-4 w-4" />
          {title && <AlertTitle>{title}</AlertTitle>}
          {description && <AlertDescription>{description}</AlertDescription>}
        </Alert>
      );
    },
  },
  block: {
    normal: ({ children }) => <p className="mb-4">{children}</p>,
    h1: ({ children }) => {
      const text = getTextFromChildren(children);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return (
        <h1 id={id} className="my-4 font-semibold scroll-mt-20">
          {children}
        </h1>
      );
    },
    h2: ({ children }) => {
      const text = getTextFromChildren(children);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return (
        <h2 id={id} className="my-4 font-semibold scroll-mt-20">
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
      return (
        <Link
          href={value?.href}
          target={value.target ? "_blank" : undefined}
          rel={value.target ? "noopener" : undefined}
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
};

const PortableTextRenderer = ({
  value,
}: {
  value: PortableTextProps["value"];
}) => {
  return <PortableText value={value} components={portableTextComponents} />;
};

export default PortableTextRenderer;
