import { cn } from "@/lib/utils";
import Icon from "@/components/icon";
import SectionContainer from "@/components/ui/section-container";
import { ColorName, getColor } from "@/lib/color";
import { PAGE_QUERYResult } from "@/sanity.types";

type Timeline5Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "timeline-5" }
>;

export default function Timeline5({
  padding,
  title,
  description,
  columns,
}: Timeline5Props) {
  return (
    <SectionContainer padding={padding}>
      <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left Column - Fixed Content */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="max-w-lg">
            {title && (title.title1 || title.title2 || title.title3) && (
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
                {title?.title1}{" "}
                <span className="relative inline-block">
                  {title?.title2 && (
                    <>
                      <span className="text-muted-foreground">
                        {title.title2}
                      </span>
                      <Icon
                        iconVariant={title.iconVariant || "none"}
                        className={cn(
                          "absolute -top-2 -right-4 stroke-none",
                          getColor({
                            color: title.color as ColorName,
                            type: "fill",
                          })
                        )}
                        size={5}
                      />
                    </>
                  )}
                </span>
                <br />
                {title?.title3}
              </h2>
            )}
            {description && (
              <p className="mt-12 text-base text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>

        {columns && columns?.length > 0 && (
          <div className="-mt-8 sm:-mt-12">
            {columns.map((column, index) => (
              <div
                key={column._key}
                className="relative my-12 overflow-hidden rounded-lg bg-muted px-8 py-16 shadow-none sm:px-12 sm:py-24 lg:px-16 lg:py-32"
              >
                <div className="gap-4 sm:gap-6">
                  <div className="block shrink-0">
                    <Icon
                      iconVariant={column.iconVariant || "none"}
                      size={12}
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="absolute top-12 right-12 font-mono text-5xl">
                    0{index + 1}
                  </div>
                  <div className="mt-6">
                    {column.title && (
                      <h4 className="mb-2 text-2xl font-semibold text-primary">
                        {column.title}
                      </h4>
                    )}
                    {column.description && (
                      <p className="mt-6 text-xs text-muted-foreground sm:text-base">
                        {column.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
