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
import { urlFor } from "@/sanity/lib/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ColorName, getColor } from "@/lib/color";
import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";

type Gallery10Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "gallery-10" }
>;

export default function Gallery4({
  title,
  description,
  padding,
  testimonials,
}: Gallery10Props) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentIndex(carouselApi.selectedScrollSnap());
    };

    updateSelection();
    carouselApi.on("select", updateSelection);

    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  // Calculate the progress bar width and position
  const progressWidth = 240;
  const progressIndicatorWidth = progressWidth / (testimonials?.length || 0);
  const progressOffset = currentIndex * progressIndicatorWidth;

  return (
    <SectionContainer padding={padding} withContainer={false}>
      <div className="flex flex-col items-start justify-between gap-6 px-4 lg:flex-row lg:px-10">
        {/* Left Side: Text Content and Navigation Buttons */}
        <div className="flex flex-col justify-between lg:h-[460px] lg:w-[445px] lg:pr-10">
          <div className="flex flex-col gap-4">
            {title && (
              <h2 className="text-3xl font-semibold lg:text-4xl">{title}</h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground">{description}</p>
            )}
          </div>

          {/* Navigation Buttons Aligned to Bottom */}
          <div className="hidden justify-start gap-4 lg:flex">
            <Button
              size="icon"
              className="rounded-full"
              variant="outline"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
            >
              <ArrowLeft className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
            >
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>

        {/* Right Side: Carousel */}
        {testimonials && testimonials.length > 0 && (
          <>
            <div className="relative w-full overflow-hidden pb-12 lg:flex-1">
              <Carousel
                setApi={setCarouselApi}
                opts={{
                  align: "start",
                  dragFree: true,
                }}
              >
                <CarouselContent>
                  {testimonials.map((testimonial) => (
                    <CarouselItem
                      key={testimonial._id}
                      className="min-w-[800px] flex-1"
                    >
                      <div className="flex gap-2">
                        <div className="h-[460px] w-[400px]">
                          {testimonial.image &&
                            testimonial.image.asset?._id && (
                              <Image
                                src={urlFor(testimonial.image).url()}
                                alt={testimonial.image.alt || ""}
                                placeholder={
                                  testimonial.image?.asset?.metadata?.lqip
                                    ? "blur"
                                    : undefined
                                }
                                blurDataURL={
                                  testimonial.image?.asset?.metadata?.lqip || ""
                                }
                                className="aspect-[1] h-full w-full rounded-2xl object-cover"
                                sizes="(min-width: 1024px) 33vw, 100vw"
                                width={
                                  testimonial.image.asset?.metadata?.dimensions
                                    ?.width || 500
                                }
                                height={
                                  testimonial.image.asset?.metadata?.dimensions
                                    ?.height || 500
                                }
                                quality={100}
                              />
                            )}
                        </div>

                        {/* Quote Section */}
                        <div
                          className={cn(
                            "relative flex h-[460px] w-[400px] flex-col items-start justify-end rounded-2xl p-8",
                            getColor({
                              color: testimonial.color as ColorName,
                              type: "bg",
                            })
                          )}
                        >
                          {testimonial.username && (
                            <Badge className="mb-auto bg-white px-4 py-2 text-black">
                              {testimonial.username}
                            </Badge>
                          )}
                          <span className="-rotate-[4deg] text-7xl leading-none">
                            “
                          </span>
                          <p className="text-xl font-semibold">
                            {testimonial.text}
                          </p>
                          <p className="mt-4 text-lg font-medium">
                            {testimonial.name}
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* Progress Indicator */}
              <div className="absolute bottom-4 left-1/2 h-[2px] w-[240px] -translate-x-1/2 rounded bg-gray-200">
                <div
                  className="h-[2px] rounded bg-primary transition-transform duration-300 ease-out"
                  style={{
                    width: `${progressIndicatorWidth}px`,
                    transform: `translateX(${progressOffset}px)`,
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </SectionContainer>
  );
}
