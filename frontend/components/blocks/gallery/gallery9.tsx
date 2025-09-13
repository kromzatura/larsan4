"use client";

import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

import Icon from "@/components/icon";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";

type Gallery9Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "gallery-9" }
>;

export default function Gallery9({ padding, columns }: Gallery9Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const scrollToSection = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <SectionContainer padding={padding} className="overflow-hidden">
      {columns && columns.length > 0 && (
        <Carousel setApi={setApi} className="flex flex-col gap-10">
          <CarouselContent>
            {columns.map((column) => (
              <CarouselItem className="h-full w-full" key={column._key}>
                {column.image && column.image.asset?._id && (
                  <Image
                    src={urlFor(column.image).url()}
                    alt={column.image.alt || ""}
                    placeholder={
                      column.image?.asset?.metadata?.lqip ? "blur" : undefined
                    }
                    blurDataURL={column.image?.asset?.metadata?.lqip || ""}
                    className="aspect-square h-full w-full object-cover md:aspect-[2]"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    width={
                      column.image.asset?.metadata?.dimensions?.width || 1000
                    }
                    height={
                      column.image.asset?.metadata?.dimensions?.height || 1000
                    }
                    quality={100}
                  />
                )}
                <div className="mt-8 flex cursor-pointer flex-col gap-2 md:hidden">
                  <Icon
                    iconVariant={column.iconVariant || "none"}
                    strokeWidth={2}
                    size={5}
                  />
                  <div className="text-lg font-medium">{column.title}</div>
                  <div className="text-lg text-muted-foreground">
                    {column.description}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mb-8 hidden justify-between gap-8 md:flex">
            {columns.map((column, index) => (
              <div
                key={column._key}
                onClick={() => scrollToSection(index)}
                className="flex cursor-pointer flex-col gap-2"
              >
                <Icon
                  iconVariant={column.iconVariant || "none"}
                  strokeWidth={2}
                  size={5}
                />
                <div className="text-lg font-medium">{column.title}</div>
                <div
                  className={`text-lg ${index + 1 === current ? "text-muted-foreground" : "text-muted-foreground/50"} hover:text-muted-foreground`}
                >
                  {column.description}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <div className="min-w-9">
              {current} / {count}
            </div>
            <div className="flex items-center justify-start gap-2">
              <CarouselPrevious
                className="static translate-y-0 rounded-full"
                disabled={current === 1}
              />
              <CarouselNext
                className="static translate-y-0 rounded-full"
                disabled={current === count}
              />
            </div>
          </div>
        </Carousel>
      )}
    </SectionContainer>
  );
}
