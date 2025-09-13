import { cn } from "@/lib/utils";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Tag from "@/components/ui/tag";
import Icon from "@/components/icon";
import { createElement } from "react";
import { PAGE_QUERYResult } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type Feature1 = Extract<Block, { _type: "feature-1" }>;
type FeatureContent = Extract<
  NonNullable<Feature1["columns"]>[number],
  { _type: "feature-content" }
>;

export default function FeatureContent({
  padding,
  iconVariant,
  tag,
  title,
  body,
  links,
}: FeatureContent) {
  return (
    <div
      className={cn(
        padding?.top ? "pt-16 xl:pt-20" : undefined,
        padding?.bottom ? "pb-16 xl:pb-20" : undefined
      )}
    >
      <div className="flex flex-col items-start">
        {iconVariant && iconVariant !== "none" && (
          <span className="flex mb-6 size-8 items-center justify-center rounded-full bg-accent">
            <Icon iconVariant={iconVariant} strokeWidth={2} />
          </span>
        )}
        {tag && tag.text && (
          <Tag
            title={tag.text || ""}
            type={tag.type as "title" | "badge"}
            element="h2"
            className="mb-6"
          />
        )}
        {title &&
          createElement(
            tag?.text ? "h3" : "h2",
            {
              className: cn("mb-6 text-3xl font-bold text-pretty lg:text-4xl"),
            },
            title
          )}
        {body && (
          <div className="max-w-xl text-muted-foreground lg:text-lg">
            <PortableTextRenderer value={body} />
          </div>
        )}
        {links && links.length > 0 && (
          <div className="mt-8 flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
            {links.map((link, index) => (
              <Link
                key={link._key || index}
                className={cn(
                  buttonVariants({
                    variant: link.buttonVariant || "default",
                    size: "lg",
                  })
                )}
                href={link.href || "#"}
                target={link.target ? "_blank" : undefined}
                rel={link.target ? "noopener" : undefined}
              >
                {link.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
