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

type Gallery4Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "gallery-4" }
>;

export default function Gallery4({
  title,
  description,
  padding,
  columns,
}: Gallery4Props) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
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
          <div className="flex flex-col gap-4">
            {title && (
              <h2 className="text-3xl font-medium md:text-4xl lg:text-5xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="max-w-lg text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="hidden shrink-0 gap-2 md:flex">
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
            <CarouselContent className="ml-0 2xl:mr-[max(0rem,calc(50vw-700px))] 2xl:ml-[max(8rem,calc(50vw-700px))]">
              {columns.map((item) => (
                <CarouselItem
                  key={item._key}
                  className="max-w-[320px] pl-[20px] lg:max-w-[360px]"
                >
                  <Link
                    href={item.link?.href || "#"}
                    target={item.link?.target ? "_blank" : undefined}
                    rel={item.link?.target ? "noopener" : undefined}
                    className="group rounded-xl"
                  >
                    <div className="group relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-xl md:aspect-[5/4] lg:aspect-[16/9]">
                      {item.image && item.image.asset?._id && (
                        <Image
                          src={urlFor(item.image).url()}
                          alt={item.image.alt || ""}
                          placeholder={
                            item.image?.asset?.metadata?.lqip
                              ? "blur"
                              : undefined
                          }
                          blurDataURL={item.image?.asset?.metadata?.lqip || ""}
                          className="absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          width={
                            item.image.asset?.metadata?.dimensions?.width || 500
                          }
                          height={
                            item.image.asset?.metadata?.dimensions?.height ||
                            500
                          }
                          quality={100}
                        />
                      )}
                      <div className="absolute inset-0 h-full bg-[linear-gradient(transparent_20%,var(--primary)_100%)] mix-blend-multiply" />
                      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6 text-primary-foreground md:p-8">
                        {item.categories && item.categories.length > 0 && (
                          <Badge className="bg-primary-foreground/30">
                            {item.categories[0].title}
                          </Badge>
                        )}
                        {item.title && (
                          <div className="mb-2 pt-4 text-xl font-semibold md:mb-3 md:pt-4 lg:pt-4">
                            {item.title}
                          </div>
                        )}
                        {item.description && (
                          <div className="mb-8 line-clamp-2 md:mb-12 lg:mb-9">
                            {item.description}
                          </div>
                        )}
                        <div
                          className={cn(
                            buttonVariants({
                              variant: item.link?.buttonVariant || "default",
                              size: "sm",
                            }),
                            item.link?.buttonVariant === "ghost" &&
                              "hover:bg-transparent hover:text-primary-foreground",
                            "flex items-center text-sm !p-0"
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
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="mt-8 flex justify-center gap-2">
            {columns.map((item, index) => (
              <button
                key={item._key}
                className={`h-2 w-2 rounded-full transition-colors ${
                  currentSlide === index ? "bg-primary" : "bg-primary/20"
                }`}
                onClick={() => carouselApi?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </SectionContainer>
  );
}
