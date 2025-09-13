"use client";

import { Fragment } from "react";
import { MoveRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";

type Gallery8Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "gallery-8" }
>;

export default function Gallery8({ padding, link, columns }: Gallery8Props) {
  return (
    <SectionContainer padding={padding} className="overflow-hidden">
      {columns && columns.length > 0 && (
        <Carousel>
          <div className="mt-6 grid gap-x-14 gap-y-10 lg:mt-16 lg:grid-cols-3">
            <div className="order-3 flex flex-col gap-6 lg:order-none">
              {columns.slice(0, 3).map((column, idx) => (
                <Fragment key={idx}>
                  <div className="flex flex-col gap-1">
                    {column.categories && column.categories.length > 0 && (
                      <div className="font-mono text-sm text-muted-foreground uppercase">
                        {column.categories[0].title}
                      </div>
                    )}
                    <Link
                      href={column.link?.href || "#"}
                      target={column.link?.target ? "_blank" : undefined}
                      rel={column.link?.target ? "noopener" : undefined}
                      className="group flex items-center gap-2 font-semibold"
                    >
                      {column.link?.title}
                      <MoveRight className="mt-0.5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                  <Separator />
                </Fragment>
              ))}
              {link?.title && (
                <Link
                  href={link?.href || "#"}
                  target={link?.target ? "_blank" : undefined}
                  rel={link?.target ? "noopener" : undefined}
                  className="group flex items-center gap-2 font-semibold"
                >
                  {link.title}
                  <MoveRight className="mt-0.5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              )}
            </div>
            <div className="order-1 lg:order-none lg:col-span-2 [&>div[data-slot=carousel-content]]:overflow-visible [&>div[data-slot=carousel-content]]:[clip-path:inset(-100vw_-100vw_-100vw_0)]">
              <CarouselContent className="ml-0 max-w-[min(calc(100vw-4rem),24rem)] select-none sm:max-w-96">
                {columns.map((column, idx) => (
                  <CarouselItem
                    className={cn(
                      "w-fit border-y border-l border-border pl-0 transition-colors duration-300 hover:bg-muted/50",
                      idx === columns.length - 1 && "border-r"
                    )}
                    key={column._key}
                  >
                    <Link
                      href={column.link?.href || "#"}
                      target={column.link?.target ? "_blank" : undefined}
                      rel={column.link?.target ? "noopener" : undefined}
                      className="block h-full"
                    >
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
                          className="aspect-video object-cover"
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
                      <div className="px-6 py-8">
                        {column.categories && column.categories.length > 0 && (
                          <div className="text-sm text-muted-foreground uppercase">
                            {column.categories[0].title}
                          </div>
                        )}
                        {column.link?.title && (
                          <h3 className="mt-2 text-xl font-semibold lg:text-2xl">
                            {column.link.title}
                          </h3>
                        )}
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </div>
            <div className="order-2 flex items-center gap-4 lg:order-none lg:col-start-2">
              <CarouselPrevious className="static size-12 translate-x-0 translate-y-0 rounded-full" />
              <CarouselNext className="static size-12 translate-x-0 translate-y-0 rounded-full" />
            </div>
          </div>
        </Carousel>
      )}
    </SectionContainer>
  );
}
