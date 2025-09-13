import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import PortableTextRenderer from "@/components/portable-text-renderer";
import Icon from "@/components/icon";
import { PAGE_QUERYResult } from "@/sanity.types";
import { Fragment } from "react";

type Hero57Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "hero-57" }
>;

const Hero57 = ({ title, body, links, tags }: Hero57Props) => {
  return (
    <section className="py-32">
      <div className="relative container">
        <div className="absolute inset-0 -z-10 mx-auto h-full w-full max-w-3xl bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_100%_at_50%_50%,#000_60%,transparent_100%)]"></div>
        <h1 className="relative mx-auto mb-8 max-w-3xl flex-wrap text-center text-4xl font-semibold md:mb-10 md:text-6xl md:leading-snug">
          {title && <span>{title}</span>}
          {tags && tags[0] && (
            <div className="absolute -top-10 -left-20 hidden w-fit -rotate-12 gap-1 border-b border-dashed border-muted-foreground text-sm font-normal text-muted-foreground underline-offset-3 lg:flex">
              <Icon
                iconVariant={tags[0].iconVariant || "none"}
                strokeWidth={1.5}
              />
              {tags[0].title}
            </div>
          )}
          {tags && tags[1] && (
            <div className="absolute top-14 -left-24 hidden w-fit -rotate-12 gap-1 border-b border-dashed border-muted-foreground text-sm font-normal text-muted-foreground underline-offset-3 lg:flex">
              <Icon
                iconVariant={tags[1].iconVariant || "none"}
                strokeWidth={1.5}
              />
              {tags[1].title}
            </div>
          )}
          {tags && tags[2] && (
            <div className="absolute -top-10 -right-24 hidden w-fit rotate-12 gap-1 border-b border-dashed border-muted-foreground text-sm font-normal text-muted-foreground underline-offset-3 lg:flex">
              <Icon
                iconVariant={tags[2].iconVariant || "none"}
                strokeWidth={1.5}
              />
              {tags[2].title}
            </div>
          )}
          {tags && tags[3] && (
            <div className="absolute top-14 -right-28 hidden w-fit rotate-12 gap-1 border-b border-dashed border-muted-foreground text-sm font-normal text-muted-foreground underline-offset-3 lg:flex">
              <Icon
                iconVariant={tags[3].iconVariant || "none"}
                strokeWidth={1.5}
              />
              {tags[3].title}
            </div>
          )}
        </h1>
        {body && (
          <div className="mx-auto mb-10 max-w-screen-md text-center font-medium text-muted-foreground md:text-xl">
            <PortableTextRenderer value={body} />
          </div>
        )}
        {links && links.length > 0 && (
          <div className="flex flex-col items-center justify-center gap-3 pt-3 pb-12">
            {links.map((link) => (
              <Fragment key={link._key}>
                <Link
                  key={link._key}
                  href={link.href || "#"}
                  target={link.target ? "_blank" : undefined}
                  rel={link.target ? "noopener" : undefined}
                  className={cn(
                    buttonVariants({
                      variant: link.buttonVariant || "default",
                      size: "lg",
                    }),
                    "px-8 py-6 text-base font-medium"
                  )}
                >
                  {link.title}
                  <Icon
                    iconVariant={link.iconVariant || "none"}
                    strokeWidth={1.5}
                  />
                </Link>
                {link.description && (
                  <div className="text-sm text-muted-foreground md:text-balance">
                    {link.description}
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero57;
