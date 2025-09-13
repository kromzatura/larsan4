"use client";

import AutoScroll from "embla-carousel-auto-scroll";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import PortableTextRenderer from "@/components/portable-text-renderer";
import Icon from "@/components/icon";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { PAGE_QUERYResult } from "@/sanity.types";

type Hero85Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "hero-85" }
>;

const Hero85 = ({ tag, title, body, images, links }: Hero85Props) => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="mx-auto">
            <div className="flex w-fit items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs font-medium">
              {tag?.title && <Badge>{tag.title}</Badge>}
              {tag?.description}
            </div>
            {title && (
              <h1 className="mt-10 mb-4 text-3xl font-semibold lg:text-5xl">
                {title}
              </h1>
            )}
            {body && (
              <div className="mx-auto text-muted-foreground lg:text-lg">
                <PortableTextRenderer value={body} />
              </div>
            )}
            {links && (
              <div className="mt-10 flex flex-col gap-2 sm:flex-row">
                {links.map((link) => (
                  <Link
                    key={link._key}
                    href={link.href || "#"}
                    target={link.target ? "_blank" : undefined}
                    rel={link.target ? "noopener" : undefined}
                    className={cn(
                      buttonVariants({
                        variant: link.buttonVariant || "default",
                      }),
                      "w-full gap-2 sm:w-auto"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {link.title}
                      <Icon iconVariant={link.iconVariant || "none"} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {images && images.length > 0 && (
            <>
              <div className="flex flex-col gap-8 lg:hidden">
                <Carousel
                  opts={{
                    loop: true,
                  }}
                  plugins={[
                    AutoScroll({
                      speed: 0.8,
                    }),
                  ]}
                  className="-mx-7"
                >
                  <CarouselContent className="max-h-[350px]">
                    {images
                      .slice(0, Math.ceil(images.length / 2))
                      .map((image) => (
                        <CarouselItem key={image.asset?._id}>
                          <Image
                            src={urlFor(image).url()}
                            alt={image.alt || ""}
                            width={
                              image.asset?.metadata?.dimensions?.width || 400
                            }
                            height={
                              image.asset?.metadata?.dimensions?.height || 400
                            }
                            placeholder={
                              image?.asset?.metadata?.lqip ? "blur" : undefined
                            }
                            blurDataURL={image?.asset?.metadata?.lqip || ""}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="aspect-square w-full object-cover object-center"
                          />
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                </Carousel>
                <Carousel
                  opts={{
                    loop: true,
                  }}
                  plugins={[
                    AutoScroll({
                      speed: 0.8,
                      direction: "backward",
                    }),
                  ]}
                  className="-mx-7"
                >
                  <CarouselContent className="max-h-[350px]">
                    {images.slice(Math.ceil(images.length / 2)).map((image) => (
                      <CarouselItem key={image.asset?._id}>
                        <Image
                          src={urlFor(image).url()}
                          alt={image.alt || ""}
                          width={
                            image.asset?.metadata?.dimensions?.width || 400
                          }
                          height={
                            image.asset?.metadata?.dimensions?.height || 400
                          }
                          placeholder={
                            image?.asset?.metadata?.lqip ? "blur" : undefined
                          }
                          blurDataURL={image?.asset?.metadata?.lqip || ""}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="aspect-square w-full object-cover object-center"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </>
          )}
          {images && images.length > 0 && (
            <>
              <div className="hidden grid-cols-2 gap-8 lg:grid">
                <Carousel
                  opts={{
                    loop: true,
                  }}
                  plugins={[
                    AutoScroll({
                      speed: 0.8,
                    }),
                  ]}
                  orientation="vertical"
                >
                  <CarouselContent className="max-h-[600px]">
                    {images
                      .slice(0, Math.ceil(images.length / 2))
                      .map((image) => (
                        <CarouselItem key={image.asset?._id}>
                          <Image
                            src={urlFor(image).url()}
                            alt={image.alt || ""}
                            width={
                              image.asset?.metadata?.dimensions?.width || 400
                            }
                            height={
                              image.asset?.metadata?.dimensions?.height || 400
                            }
                            placeholder={
                              image?.asset?.metadata?.lqip ? "blur" : undefined
                            }
                            blurDataURL={image?.asset?.metadata?.lqip || ""}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="aspect-square w-full object-cover object-center"
                          />
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                </Carousel>
                <Carousel
                  opts={{
                    loop: true,
                  }}
                  plugins={[
                    AutoScroll({
                      speed: 0.8,
                      direction: "backward",
                    }),
                  ]}
                  orientation="vertical"
                >
                  <CarouselContent className="max-h-[600px]">
                    {images.slice(Math.ceil(images.length / 2)).map((image) => (
                      <CarouselItem key={image.asset?._id}>
                        <Image
                          src={urlFor(image).url()}
                          alt={image.alt || ""}
                          width={
                            image.asset?.metadata?.dimensions?.width || 400
                          }
                          height={
                            image.asset?.metadata?.dimensions?.height || 400
                          }
                          placeholder={
                            image?.asset?.metadata?.lqip ? "blur" : undefined
                          }
                          blurDataURL={image?.asset?.metadata?.lqip || ""}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="aspect-square w-full object-cover object-center"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero85;
