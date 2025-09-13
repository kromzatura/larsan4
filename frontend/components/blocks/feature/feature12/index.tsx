"use client";
import { useEffect, useState } from "react";
import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import Icon from "@/components/icon";

import { Card, CardContent } from "@/components/ui/card";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type Feature12 = Extract<Block, { _type: "feature-12" }>;

export default function Feature12({ padding, tagline, columns }: Feature12) {
  const [api, setApi] = useState<CarouselApi>();
  const [progress, setProgress] = useState(
    Math.floor(100 / (columns?.length || 0))
  );

  useEffect(() => {
    if (!api) {
      return;
    }
    api.on("scroll", ({ scrollProgress }) => {
      setProgress(
        Math.max(1 / (columns?.length || 0), Math.min(1, scrollProgress())) *
          100
      );
    });
  }, [api]);

  return (
    <SectionContainer padding={padding}>
      <div className="container max-w-7xl">
        <Carousel className="w-full" setApi={setApi}>
          <div className="mb-4 flex justify-between px-1 md:mb-5">
            {tagline && <p className="font-medium">{tagline}</p>}
            <div className="flex items-center space-x-2">
              <div className="mr-2 hidden items-center gap-3 text-xs text-muted-foreground md:flex">
                <span>01</span>
                <Progress value={progress} className="h-[2px] w-52" />
                <span>
                  {columns?.length && columns.length < 10
                    ? `0${columns.length}`
                    : columns?.length}
                </span>
              </div>
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </div>
          <CarouselContent>
            {columns?.map((column, index) => (
              <CarouselItem
                key={index}
                className="basis-full md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col justify-center p-6">
                      <div className="">
                        <span className="mb-5 flex size-8 items-center justify-center rounded-full bg-accent lg:size-10">
                          <Icon
                            iconVariant={column.iconVariant || "none"}
                            strokeWidth={2}
                          />
                        </span>
                        <p className="text-xl font-semibold md:text-2xl lg:text-2xl">
                          {column.title}
                        </p>
                        <p className="pt-2 text-muted-foreground">
                          {column.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </SectionContainer>
  );
}
