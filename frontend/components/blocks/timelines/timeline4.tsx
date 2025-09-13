import { cn } from "@/lib/utils";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Icon from "@/components/icon";
import SectionContainer from "@/components/ui/section-container";
import Tag from "@/components/ui/tag";
import { PAGE_QUERYResult } from "@/sanity.types";

type Timeline4Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "timeline-4" }
>;

const DiagonalPattern = ({
  className,
  patternColor = "hsl(var(--foreground))",
  patternOpacity = 0.15,
}: {
  className?: string;
  patternColor?: string;
  patternOpacity?: number;
}) => {
  const svgPattern = `url("data:image/svg+xml,%3Csvg width='7' height='7' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${patternColor}' fill-opacity='${patternOpacity}' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <div
      className={cn("h-full w-full border-2 border-dashed", className)}
      style={{
        backgroundImage: svgPattern,
      }}
    />
  );
};

export default function Timeline4({
  tag,
  padding,
  title,
  description,
  columns,
}: Timeline4Props) {
  return (
    <SectionContainer padding={padding} withContainer={false}>
      <div className="border-y">
        <div className="container flex flex-col gap-6 border-x py-4 max-lg:border-x lg:py-8">
          {tag && tag.text && (
            <Tag
              title={tag.text || ""}
              iconVariant={tag.iconVariant || "none"}
              type={tag.type as "title" | "badge"}
              element="p"
            />
          )}
          {title && (
            <h2 className="text-3xl leading-tight tracking-tight md:text-4xl lg:text-6xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="max-w-[600px] tracking-[-0.32px] text-muted-foreground">
              Take control of your workflow step-by-step with smart tools,
              actionable insights, and seamless collaboration
            </p>
          )}
        </div>
      </div>
      {columns && columns?.length > 0 && (
        <div className="container overflow-hidden border-x pb-40 lg:pt-20 [&>*:last-child]:pb-20 [&>div>div:first-child]:pt-20!">
          {columns.map((column, index) => (
            <div key={column._key} className="relative flex">
              <div
                className={`flex w-full justify-center px-1 py-10 text-end md:gap-6 lg:gap-10 ${index % 2 === 0 ? "lg:flex-row-reverse lg:text-start" : ""} `}
              >
                <div className="flex-1 max-lg:hidden">
                  {column.title && (
                    <h3 className="text-2xl tracking-[-0.96px]">
                      {column.title}
                    </h3>
                  )}
                  {column.description && (
                    <p
                      className={`mt-2.5 max-w-[300px] tracking-[-0.32px] text-balance text-muted-foreground ${index % 2 === 0 ? "" : "ml-auto"}`}
                    >
                      {column.description}
                    </p>
                  )}
                </div>
                <div className="z-[-1] size-fit -translate-y-5 bg-background p-4 max-lg:-translate-x-4">
                  <div className="rounded-[10px] border bg-card p-[5px] shadow-md">
                    <div className="size-fit rounded-md border bg-muted p-1">
                      {column.iconVariant && (
                        <Icon
                          iconVariant={column.iconVariant || "none"}
                          strokeWidth={1.5}
                          size={4}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-1 max-lg:-translate-x-4">
                  <div className="text-start lg:pointer-events-none lg:hidden">
                    {column.title && (
                      <h3 className="text-2xl tracking-[-0.96px]">
                        {column.title}
                      </h3>
                    )}
                    <p className="mt-2.5 mb-10 max-w-[300px] tracking-[-0.32px] text-balance text-muted-foreground">
                      {column.description}
                    </p>
                  </div>
                  <div className="flex items-start justify-start">
                    <div className={` ${index % 2 === 0 ? "lg:ml-auto" : ""}`}>
                      <div className="px-6 lg:px-10">
                        <DiagonalPattern className="h-6 lg:h-10" />
                      </div>
                      <div className="relative grid grid-cols-[auto_1fr_auto] items-stretch">
                        <DiagonalPattern className="h-full w-6 lg:w-10" />
                        {column.image && column.image.asset?._id && (
                          <Image
                            src={urlFor(column.image).url()}
                            alt={column.image.alt || ""}
                            placeholder={
                              column.image?.asset?.metadata?.lqip
                                ? "blur"
                                : undefined
                            }
                            blurDataURL={
                              column.image?.asset?.metadata?.lqip || ""
                            }
                            className="object-contain"
                            sizes="(min-width: 1024px) 33vw, 100vw"
                            width={
                              column.image.asset?.metadata?.dimensions?.width ||
                              500
                            }
                            height={
                              column.image.asset?.metadata?.dimensions
                                ?.height || 500
                            }
                            quality={100}
                          />
                        )}
                        <DiagonalPattern className="w-6 lg:w-10" />
                      </div>
                      <div className="px-6 lg:px-10">
                        <DiagonalPattern className="h-6 lg:h-10" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`absolute z-[-2] h-full w-[3px] translate-x-5 rounded-full lg:left-1/2 lg:-translate-x-1/2 ${index === columns.length - 1 ? "bg-linear-to-b from-foreground/10 via-foreground/10 to-transparent" : "bg-foreground/10"}`}
              >
                {index == 0 && (
                  <div className="h-4 w-[3px] -translate-y-full bg-linear-to-b from-transparent to-foreground/10"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
