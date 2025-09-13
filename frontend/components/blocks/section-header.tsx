import { Fragment } from "react";
import { cn } from "@/lib/utils";
import SectionContainer from "@/components/ui/section-container";
import Tag from "@/components/ui/tag";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Circle } from "lucide-react";
import Icon from "@/components/icon";

import { PAGE_QUERYResult } from "@/sanity.types";

type SectionHeaderProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "section-header" }
>;

export default function SectionHeader({
  padding,
  sectionWidth = "default",
  stackAlign = "left",
  direction = "column",
  tag,
  title,
  description,
  links,
}: SectionHeaderProps) {
  const isNarrow = sectionWidth === "narrow";
  const titleSize = title?.size || "default";
  const titleWeight = title?.weight || "bold";
  const Element = title?.element || "h2";

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
    <SectionContainer padding={padding}>
      <div
        className={cn(
          stackAlign === "center" ? "max-w-4xl text-center mx-auto" : undefined,
          isNarrow ? "max-w-3xl mx-auto" : undefined,
          direction === "row" && !isNarrow
            ? "lg:flex-row lg:justify-between w-full"
            : undefined,
          "flex flex-col gap-4"
        )}
      >
        <div className="flex flex-col gap-4">
          {tag && tag.text && (
            <Tag
              title={tag.text || ""}
              type={tag.type as "title" | "badge"}
              element="p"
            />
          )}
          {title && title.text && (
            <Element className={cn(titleSizeClasses, titleWeightClasses)}>
              {title.text}
            </Element>
          )}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        <div>
          {links && links.length > 0 && (
            <div
              className={cn(
                stackAlign === "center" ? "justify-center" : undefined,
                "flex flex-row flex-wrap items-center gap-4"
              )}
            >
              {links.map((link) => (
                <Link
                  key={link._key}
                  href={link.href || "#"}
                  target={link.target ? "_blank" : undefined}
                  rel={link.target ? "noopener" : undefined}
                  className={cn(
                    buttonVariants({
                      variant: link.buttonVariant || "default",
                    })
                  )}
                >
                  <div className="flex items-center gap-2">
                    {link.title}
                    <Icon
                      iconVariant={link.iconVariant || "none"}
                      strokeWidth={1.5}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
          {links && links.length > 0 && (
            <div
              className={cn(
                stackAlign === "center" ? "justify-center" : undefined,
                "flex flex-wrap items-center gap-3 md:flex-row"
              )}
            >
              {links.map((link, index) => (
                <Fragment key={link._key}>
                  {link.description && (
                    <p key={link._key} className="text-sm">
                      {link.description}
                    </p>
                  )}
                  {index < links.length - 1 && link.description && (
                    <Circle className="h-1 w-1" />
                  )}
                </Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}
