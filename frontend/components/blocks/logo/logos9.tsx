"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import SectionContainer from "@/components/ui/section-container";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PAGE_QUERYResult } from "@/sanity.types";

type Logos9Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "logos-9" }
>;

const Logos9 = ({ padding, title, images, testimonials }: Logos9Props) => {
  return (
    <SectionContainer padding={padding}>
      <div className="flex flex-col items-center text-center">
        {title && (
          <h1 className="my-6 text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h1>
        )}
      </div>

      {images && images.length > 0 && (
        <div className="relative mx-auto flex items-center justify-center pt-8 lg:max-w-5xl">
          <Carousel
            opts={{ loop: true }}
            plugins={[AutoScroll({ playOnInit: true })]}
          >
            <CarouselContent className="ml-0">
              {images.map((image) => (
                <CarouselItem
                  key={image._key}
                  className="flex basis-1/3 justify-center pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                >
                  <div className="flex shrink-0 items-center justify-center lg:mx-10">
                    <div>
                      <Image
                        key={image._key}
                        src={urlFor(image).url()}
                        alt={image.alt || ""}
                        placeholder={
                          image?.asset?.metadata?.lqip &&
                          image?.asset?.mimeType !== "image/svg+xml"
                            ? "blur"
                            : undefined
                        }
                        blurDataURL={image?.asset?.metadata?.lqip || ""}
                        width={120}
                        height={28}
                        className="h-7 w-auto"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent"></div>
        </div>
      )}
      <Separator className="mx-auto my-15 max-w-5xl" />

      {testimonials && testimonials.length > 0 && (
        <Carousel opts={{ loop: true }} className="mx-auto w-full max-w-6xl">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={testimonial._id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <div
                  className={cn(
                    "relativ w-full border-r border-border px-12 text-center md:px-8 md:text-left",
                    index == 0 && "lg:border-l"
                  )}
                  key={index}
                >
                  <h5 className="mt-5 mb-14 line-clamp-3 text-lg tracking-tight text-muted-foreground md:mb-28">
                    {testimonial.text}
                  </h5>
                  <div className="mt-auto">
                    <p className="text-lg font-semibold tracking-tight text-foreground">
                      {testimonial.name}
                    </p>
                    {testimonial.image && (
                      <Image
                        key={testimonial.image.asset?._id}
                        src={urlFor(testimonial.image).url()}
                        alt={testimonial.image.alt || ""}
                        placeholder={
                          testimonial.image?.asset?.metadata?.lqip &&
                          testimonial.image?.asset?.mimeType !== "image/svg+xml"
                            ? "blur"
                            : undefined
                        }
                        blurDataURL={
                          testimonial.image?.asset?.metadata?.lqip || ""
                        }
                        width={160}
                        height={30}
                        className="mx-auto my-5 w-40 md:mx-0"
                      />
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </SectionContainer>
  );
};

export default Logos9;
