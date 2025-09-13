import { cn } from "@/lib/utils";
import Icon from "@/components/icon";
import SectionContainer from "@/components/ui/section-container";
import { ColorName, getColor } from "@/lib/color";
import { PAGE_QUERYResult } from "@/sanity.types";

type Timeline6Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "timeline-6" }
>;

export default function Timeline6({
  padding,
  title,
  description,
  columns,
}: Timeline6Props) {
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
            {columns.map((column) => (
              <div
                key={column._key}
                className="relative flex flex-col justify-center overflow-hidden border-b py-8 shadow-none sm:py-12"
              >
                <div className="flex gap-4 sm:gap-6">
                  <div className="shrink-0">
                    <Icon
                      iconVariant={column.iconVariant || "none"}
                      size={12}
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    {column.title && (
                      <h4 className="mb-2 text-2xl font-semibold text-primary sm:text-3xl">
                        {column.title}
                      </h4>
                    )}
                    {column.description && (
                      <p className="mt-6 text-sm text-muted-foreground sm:text-base">
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
