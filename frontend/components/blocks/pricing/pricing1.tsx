import { cn } from "@/lib/utils";
import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Check } from "lucide-react";

type Pricing1Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "pricing-1" }
>;

export default function Pricing1({ padding, columns }: Pricing1Props) {
  return (
    <SectionContainer padding={padding}>
      {columns && columns?.length > 0 && (
        <div
          className={cn(
            "mx-auto grid rounded-md border lg:divide-x",
            columns?.length === 1
              ? "max-w-screen-sm lg:grid-cols-1"
              : "lg:max-w-none",
            columns?.length === 2 && "lg:grid-cols-2",
            columns?.length === 3 && "lg:grid-cols-3",
            columns?.length === 4 && "lg:grid-cols-4"
          )}
        >
          {columns?.map((column) => (
            <div key={column._key} className="h-full">
              <div
                className={cn(
                  "flex h-full flex-col",
                  column.featured && "bg-muted"
                )}
              >
                <div className="h-90 flex-none">
                  <div className="flex h-full flex-col">
                    <div className="px-8 pt-8 pb-3">
                      {column.title && (
                        <h3 className="text-3xl font-semibold">
                          {column.title}
                        </h3>
                      )}
                    </div>
                    <div className="px-8 pb-6">
                      {column.description && (
                        <p className="line-clamp-2 text-balance text-muted-foreground">
                          {column.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-grow flex-col justify-start px-8 pb-6">
                      {column.price && (
                        <div className="mb-4 flex items-start justify-center">
                          <div className="text-center">
                            <div className="flex items-start justify-center">
                              <span className="mt-2 text-lg font-semibold">
                                $
                              </span>
                              <span className="text-6xl font-semibold">
                                {column.price.value}
                              </span>
                            </div>
                            {column.price.note && (
                              <p className="mt-2 text-sm text-muted-foreground">
                                {column.price.note}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {column.link?.title && (
                      <div className="mt-auto px-8 pb-8">
                        <Link
                          href={column.link?.href || "#"}
                          target={column.link?.target ? "_blank" : undefined}
                          rel={column.link?.target ? "noopener" : undefined}
                          className={cn(
                            buttonVariants({
                              variant: column.link.buttonVariant || "default",
                            }),
                            "w-full py-6"
                          )}
                        >
                          {column.link?.title}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-grow border-t p-8 text-left">
                  {column.listTitle && (
                    <p className="mb-4 text-lg font-semibold">
                      {column.listTitle}
                    </p>
                  )}
                  <ul className="space-y-4">
                    {column.list?.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <Check className="size-5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
