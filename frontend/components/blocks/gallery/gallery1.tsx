"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { Badge } from "@/components/ui/badge";
import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";

type Gallery1Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "gallery-1" }
>;

export default function Gallery1({ padding, columns }: Gallery1Props) {
  const [selection, setSelection] = useState(columns?.[0]._key);
  return (
    <SectionContainer padding={padding}>
      {columns && columns?.length > 0 && (
        <div className="flex flex-col gap-5 lg:aspect-[1336/420] lg:flex-row">
          {columns.map((column) => (
            <div
              key={column._key}
              data-state={selection === column._key ? "open" : "closed"}
              className='group max-lg:w-full max-lg:flex-1 max-md:h-[200px] md:max-lg:aspect-[1336/420] lg:transform-gpu lg:transition-all lg:data-[state="closed"]:w-[20%] lg:data-[state="closed"]:duration-500 lg:data-[state="open"]:w-[60%] lg:data-[state="open"]:duration-400'
              onMouseEnter={() => {
                setSelection(column._key);
              }}
            >
              <Link
                href={column.link?.href || "#"}
                target={column.link?.target ? "_blank" : undefined}
                rel={column.link?.target ? "noopener" : undefined}
                className="relative block h-full w-full overflow-hidden rounded-xl bg-primary text-primary-foreground"
              >
                <div className='absolute -inset-[50%] hidden h-[200%] w-[200%] md:block lg:group-data-[state="closed"]:blur-sm'>
                  <div className="absolute top-[calc(25%+40px)] aspect-square h-[calc(50%+40px)] max-lg:right-[calc(50%+40px)] lg:right-[50%]">
                    <div className="h-full w-full overflow-clip rounded-xl">
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
                          className="h-full w-full object-cover object-center"
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          width={
                            column.image.asset?.metadata?.dimensions?.width ||
                            500
                          }
                          height={
                            column.image.asset?.metadata?.dimensions?.height ||
                            500
                          }
                          quality={100}
                        />
                      )}
                    </div>
                  </div>
                  <div className="absolute inset-y-[25%] left-[50%] flex aspect-[389/420] h-[50%] items-center justify-center max-lg:hidden">
                    {column.logo && column.logo.asset?._id && (
                      <Image
                        src={urlFor(column.logo).url()}
                        alt={column.logo.alt || ""}
                        placeholder={
                          column.logo?.asset?.metadata?.lqip
                            ? "blur"
                            : undefined
                        }
                        blurDataURL={column.logo?.asset?.metadata?.lqip || ""}
                        className="h-8 invert"
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        width={
                          column.logo.asset?.metadata?.dimensions?.width || 389
                        }
                        height={
                          column.logo.asset?.metadata?.dimensions?.height || 420
                        }
                        quality={100}
                      />
                    )}
                  </div>
                  <div className="absolute top-[50%] left-[50%] flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent max-lg:hidden">
                    <Plus className="size-8 text-accent-foreground" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 hidden h-[50%] bg-gradient-to-t from-primary from-50% to-transparent lg:block"></div>
                </div>
                <div className="relative flex flex-col justify-between gap-4 md:absolute md:inset-0 md:max-lg:inset-x-[50%] md:max-lg:w-[50%]">
                  <div className='flex h-[80px] items-center gap-2 p-4 transition-opacity delay-200 duration-500 lg:group-data-[state="closed"]:opacity-0'>
                    {column.categories?.map((category) => (
                      <Badge key={category._id} variant="secondary">
                        {category.title}
                      </Badge>
                    ))}
                  </div>
                  <div className='flex flex-col gap-2 p-4 transition-all delay-200 delay-250 duration-500 lg:group-data-[state="closed"]:translate-y-4 lg:group-data-[state="closed"]:opacity-0'>
                    <div className="lg:hidden">
                      {column.logo && column.logo.asset?._id && (
                        <Image
                          src={urlFor(column.logo).url()}
                          alt={column.logo.alt || ""}
                          placeholder={
                            column.logo?.asset?.metadata?.lqip
                              ? "blur"
                              : undefined
                          }
                          blurDataURL={column.logo?.asset?.metadata?.lqip || ""}
                          className="h-5 invert lg:h-6 w-auto"
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          width={
                            column.logo.asset?.metadata?.dimensions?.width ||
                            389
                          }
                          height={
                            column.logo.asset?.metadata?.dimensions?.height ||
                            420
                          }
                          quality={100}
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      {column.title && (
                        <div className="text-base font-medium lg:text-lg">
                          {column.title}
                        </div>
                      )}
                      <div className="flex size-8 items-center justify-center rounded-full bg-background text-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 lg:size-10">
                        <ArrowUpRight className="size-4 lg:size-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
