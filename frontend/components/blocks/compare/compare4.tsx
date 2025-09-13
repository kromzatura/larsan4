import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Fragment } from "react";
import Icon from "@/components/icon";
import PortableTextRenderer from "@/components/portable-text-renderer";
import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";

type Compare4Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "compare-4" }
>;

export default function Compare4({
  padding,
  title,
  titles,
  columns,
  body,
  links,
}: Compare4Props) {
  return (
    <SectionContainer
      padding={padding}
      className="bg-muted/30"
      withContainer={false}
    >
      <div className="container grid grid-cols-4 gap-x-4 gap-y-8 md:grid-cols-8 lg:grid-cols-12">
        {title && (
          <div className="col-span-4 mb-8 max-w-4xl md:col-span-8 md:mb-12 lg:col-span-10 lg:col-start-2 lg:mb-16">
            <h2 className="mb-4 text-center text-3xl font-bold sm:text-left md:text-4xl lg:text-6xl">
              {title}
            </h2>
          </div>
        )}

        <div className="col-span-4 px-4 md:col-span-8 lg:col-span-10 lg:col-start-2">
          <div className="grid grid-cols-4 items-center gap-4 md:grid-cols-8">
            <div className="col-span-4 md:col-span-2" />
            <div className="col-span-2 ml-0 md:col-span-3 md:ml-32 lg:ml-40 xl:ml-48 2xl:ml-56">
              <h4 className="text-xs font-bold tracking-wider text-muted-foreground uppercase md:text-sm">
                {titles?.primary}
              </h4>
            </div>
            <div className="col-span-2 ml-0 md:col-span-3 md:ml-32 lg:ml-40 xl:ml-48 2xl:ml-56">
              <h4 className="text-xs font-bold tracking-wider uppercase md:text-sm">
                {titles?.secondary}
              </h4>
            </div>
          </div>
        </div>

        {columns && columns?.length > 0 && (
          <div className="col-span-4 rounded-xl bg-background shadow-sm md:col-span-8 lg:col-span-10 lg:col-start-2">
            {columns.map((column) => (
              <div
                key={column._key}
                className="group border-t px-4 transition-colors first:rounded-t-xl first:border-t-0 last:rounded-b-xl hover:bg-muted/50"
              >
                <div className="grid grid-cols-4 items-start gap-4 py-6 md:grid-cols-8 md:py-8">
                  {column.title && (
                    <h3 className="col-span-4 mt-2 text-base font-bold md:col-span-2 md:text-lg">
                      {column.title}
                    </h3>
                  )}

                  {column.primary && (
                    <div className="col-span-2 flex flex-col md:col-span-3">
                      <div className="ml-0 transition-colors group-hover:text-foreground md:ml-32 lg:ml-40 xl:ml-48 2xl:ml-56">
                        <p className="mb-1 flex items-baseline text-2xl font-bold text-foreground md:mb-2 md:text-5xl">
                          {column.primary.value}
                          {column.primary.unit && (
                            <sup className="ml-0.5 text-xs text-foreground md:text-sm">
                              {column.primary.unit}
                            </sup>
                          )}
                        </p>
                        {column.primary.description && (
                          <p className="text-xs leading-tight text-muted-foreground md:text-sm md:leading-normal">
                            {column.primary.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {column.secondary && (
                    <div className="col-span-2 flex flex-col md:col-span-3">
                      <div className="ml-0 transition-colors group-hover:text-accent-foreground md:ml-32 lg:ml-40 xl:ml-48 2xl:ml-56">
                        <p className="mb-1 flex items-baseline text-2xl font-bold text-foreground md:mb-2 md:text-5xl">
                          {column.secondary.value}
                          {column.secondary.unit && (
                            <sup className="ml-0.5 text-xs text-foreground md:text-sm">
                              {column.secondary.unit}
                            </sup>
                          )}
                        </p>
                        {column.secondary.description && (
                          <p className="text-xs leading-tight text-muted-foreground md:text-sm md:leading-normal">
                            {column.secondary.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="col-span-4 md:col-span-8 lg:col-span-10 lg:col-start-2">
          {body && (
            <div className="text-xs text-muted-foreground md:text-sm">
              <PortableTextRenderer value={body} />
            </div>
          )}
          {links && links.length > 0 && (
            <div className="flex justify-end">
              {links.map((link) => (
                <Link
                  key={link._key}
                  href={link.href || "#"}
                  target={link.target ? "_blank" : undefined}
                  rel={link.target ? "noopener" : undefined}
                  className={cn(
                    buttonVariants({
                      variant: link.buttonVariant || "default",
                    }),
                    "rounded-full px-8 transition-transform hover:scale-105"
                  )}
                >
                  {link.title}
                  <Icon
                    iconVariant={link.iconVariant || "none"}
                    strokeWidth={1.5}
                    className="ml-2 h-4 w-4"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}
