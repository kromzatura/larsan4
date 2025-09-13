"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Icon from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";

type Gallery3Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "gallery-3" }
>;

export default function Gallery3({ title, padding, columns }: Gallery3Props) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <SectionContainer padding={padding} withContainer={false}>
      <div className="container">
        <div className="mb-8 flex items-end justify-between md:mb-14 lg:mb-16">
          {title && (
            <h2 className="text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
              {title}
            </h2>
          )}
          <div className="shrink-0 gap-2 md:flex">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollPrev();
              }}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollNext();
              }}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>
      {columns && columns?.length > 0 && (
        <div className="w-full">
          <Carousel
            setApi={setCarouselApi}
            opts={{
              breakpoints: {
                "(max-width: 768px)": {
                  dragFree: true,
                },
              },
            }}
          >
            <CarouselContent className="mr-[20px] ml-[20px] xl:mr-[calc(50vw-700px+20px)]">
              {columns.map((item) => (
                <CarouselItem
                  key={item._key}
                  className="max-w-[320px] pl-[20px] lg:max-w-[360px]"
                >
                  <Link
                    href={item.link?.href || "#"}
                    target={item.link?.target ? "_blank" : undefined}
                    rel={item.link?.target ? "noopener" : undefined}
                    className="group flex flex-col justify-between rounded-xl bg-muted p-6"
                  >
                    <div>
                      <div className="flex aspect-[3/2] overflow-clip rounded-xl">
                        <div className="flex-1">
                          <div className="relative h-full w-full origin-bottom transition duration-300 group-hover:scale-105">
                            {item.image && item.image.asset?._id && (
                              <Image
                                src={urlFor(item.image).url()}
                                alt={item.image.alt || ""}
                                placeholder={
                                  item.image?.asset?.metadata?.lqip
                                    ? "blur"
                                    : undefined
                                }
                                blurDataURL={
                                  item.image?.asset?.metadata?.lqip || ""
                                }
                                className="h-full w-full object-cover object-center"
                                sizes="(min-width: 1024px) 33vw, 100vw"
                                width={
                                  item.image.asset?.metadata?.dimensions
                                    ?.width || 500
                                }
                                height={
                                  item.image.asset?.metadata?.dimensions
                                    ?.height || 500
                                }
                                quality={100}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      {item.categories && item.categories.length > 0 && (
                        <Badge>{item.categories[0].title}</Badge>
                      )}
                    </div>
                    {item.title && (
                      <div className="mb-2 line-clamp-3 pt-4 text-lg font-medium break-words md:mb-3 md:pt-4 md:text-xl lg:pt-4 lg:text-2xl">
                        {item.title}
                      </div>
                    )}
                    {item.description && (
                      <div className="mb-8 line-clamp-2 text-sm text-muted-foreground md:mb-12 md:text-base lg:mb-9">
                        {item.description}
                      </div>
                    )}
                    <div
                      className={cn(
                        buttonVariants({
                          variant: item.link?.buttonVariant || "default",
                          size: "sm",
                        }),
                        "w-fit"
                      )}
                    >
                      {item.link?.title}
                      <Icon
                        iconVariant={item.link?.iconVariant || "none"}
                        className="ml-2 transition-transform group-hover:translate-x-1"
                        strokeWidth={2}
                        size={5}
                      />
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </SectionContainer>
  );
}
