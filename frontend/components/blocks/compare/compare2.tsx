import { cn } from "@/lib/utils";
import { Fragment } from "react";
import SectionContainer from "@/components/ui/section-container";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { PAGE_QUERYResult } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { CheckCircle2, CircleMinus } from "lucide-react";

type Compare2Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "compare-2" }
>;

export default function Compare2({ padding, columns }: Compare2Props) {
  return (
    <SectionContainer padding={padding}>
      {columns && columns?.length > 0 && (
        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
          {columns.map((column) => (
            <div
              key={column._key}
              className={cn(
                "rounded-xl p-6",
                column.featured ? "bg-background border shadow" : "bg-border/40"
              )}
            >
              <span className="flex items-center justify-center gap-2 font-medium">
                {column.image && column.image.asset?._id && (
                  <Image
                    src={urlFor(column.image).url()}
                    alt={column.image.alt || ""}
                    placeholder={
                      column.image?.asset?.metadata?.lqip ? "blur" : undefined
                    }
                    blurDataURL={column.image?.asset?.metadata?.lqip || ""}
                    className="w-7"
                    sizes="28px"
                    width={
                      column.image?.asset?.metadata?.dimensions?.width || 28
                    }
                    height={
                      column.image?.asset?.metadata?.dimensions?.height || 28
                    }
                    quality={100}
                  />
                )}
                {column.title}
              </span>
              <Separator className="my-6" />
              {column.list && column.list.length > 0 && (
                <ul className="space-y-2">
                  {column.list.map((item) => (
                    <li
                      key={item._key}
                      className={cn(
                        "flex items-center gap-2",
                        item.isMissing && "text-muted-foreground line-through"
                      )}
                    >
                      {item.isMissing ? (
                        <CircleMinus className="h-5 w-5 shrink-0 opacity-50" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700" />
                      )}
                      {item.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
