import { cn } from "@/lib/utils";
import SectionContainer from "@/components/ui/section-container";
import Link from "next/link";
import Image from "next/image";
import { PAGE_QUERYResult } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { buttonVariants } from "@/components/ui/button";

type Compare5Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "compare-5" }
>;

export default function Compare5({ padding, columns }: Compare5Props) {
  return (
    <SectionContainer padding={padding}>
      {columns && columns?.length > 0 && (
        <div className="relative mt-8 grid gap-6 sm:mt-10 md:mt-12 lg:grid-cols-2 lg:gap-10 xl:gap-14">
          {columns.map((column) => (
            <div key={column._key} className="relative h-full">
              <div className="relative aspect-[4/5] min-h-[400px] overflow-hidden rounded-2xl bg-accent sm:aspect-[0.9] sm:min-h-[480px] sm:rounded-3xl md:min-h-[520px]">
                {column.image && column.image.asset?._id && (
                  <Image
                    src={urlFor(column.image).url()}
                    alt={column.image.alt || ""}
                    placeholder={
                      column.image?.asset?.metadata?.lqip ? "blur" : undefined
                    }
                    blurDataURL={column.image?.asset?.metadata?.lqip || ""}
                    className="h-full w-full object-cover"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    width={
                      column.image?.asset?.metadata?.dimensions?.width || 600
                    }
                    height={
                      column.image?.asset?.metadata?.dimensions?.height || 600
                    }
                    quality={100}
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black via-black/50 to-transparent backdrop-blur-[2px] sm:h-[45%] md:h-[50%]" />
                <div className="absolute bottom-0 w-full space-y-4 p-4 sm:p-6 lg:p-8 xl:p-10">
                  {column.title && (
                    <h3 className="text-xl font-semibold text-white sm:text-2xl lg:text-3xl">
                      {column.title}
                    </h3>
                  )}
                  {column.description && (
                    <p className="mt-2 text-sm text-white/80 sm:text-base">
                      {column.description}
                    </p>
                  )}
                  {column.link?.title && (
                    <Link
                      href={column.link?.href || "#"}
                      target={column.link?.target ? "_blank" : undefined}
                      rel={column.link?.target ? "noopener" : undefined}
                      className={cn(
                        buttonVariants({
                          variant: column.link.buttonVariant || "default",
                        })
                      )}
                    >
                      {column.link?.title}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-4 py-2 text-sm font-bold shadow-lg sm:px-6 sm:py-4 sm:text-base lg:px-8 lg:py-6">
            OR
          </span>
        </div>
      )}
    </SectionContainer>
  );
}
