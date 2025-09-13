import { cn } from "@/lib/utils";
import { Fragment } from "react";
import SectionContainer from "@/components/ui/section-container";
import Image from "next/image";
import { PAGE_QUERYResult } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { CheckCircle2, OctagonX } from "lucide-react";

type Compare1Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "compare-1" }
>;

export default function Compare1({ padding, images, columns }: Compare1Props) {
  return (
    <SectionContainer padding={padding}>
      {columns && columns?.length > 0 && (
        <div className="-mr-4 overflow-x-auto">
          <div className="min-w-168 overflow-hidden">
            <div className="grid grid-cols-3 [&>:last-child_div]:rounded-b-md [&>div:nth-last-child(-n+3)]:rounded-b-md [&>div:nth-last-child(-n+3)]:border-b-0">
              <div className="p-4" />
              {images?.map(
                (image, index) =>
                  image?.asset?._id && (
                    <div
                      key={image._key}
                      className={cn(
                        "flex items-center rounded-t-md p-3 md:p-4",
                        index === 0 ? "bg-green-100" : "bg-red-100"
                      )}
                    >
                      <Image
                        src={urlFor(image).url()}
                        alt={image.alt || ""}
                        placeholder={
                          image?.asset?.metadata?.lqip ? "blur" : undefined
                        }
                        blurDataURL={image?.asset?.metadata?.lqip || ""}
                        className="h-7 md:h-8"
                        sizes="33vw"
                        width={image?.asset?.metadata?.dimensions?.width || 150}
                        height={
                          image?.asset?.metadata?.dimensions?.height || 50
                        }
                        quality={100}
                      />
                    </div>
                  )
              )}
              {columns.map((column) => (
                <Fragment key={column._key}>
                  <div className="flex items-center border-b p-3 text-base font-medium md:p-4 md:text-lg">
                    {column.label}
                  </div>
                  <div className="border-b bg-green-50 p-3 md:p-6">
                    <div className="flex items-center gap-2">
                      {column.hasIcon && (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      )}
                      <span className="text-base md:text-lg">
                        {column.primary}
                      </span>
                    </div>
                  </div>
                  <div className="border-b bg-red-50 p-3 md:p-6">
                    <div className="flex items-center gap-2">
                      {column.hasIcon && (
                        <OctagonX className="h-5 w-5 text-red-600" />
                      )}
                      <span className="text-base md:text-lg">
                        {column.secondary}
                      </span>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </SectionContainer>
  );
}
