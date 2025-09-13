"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import Link from "next/link";
import Icon from "@/components/icon";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { CircleCheck } from "lucide-react";

type Pricing2Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "pricing-2" }
>;

const formatPrice = (price: number | null | undefined): string => {
  if (!price) return "$0";
  return `$${price}`;
};

const calculateAnnualPrice = (price: number | null | undefined): string => {
  if (!price) return "$0";
  return `$${price * 12}`;
};

export default function Pricing2({ padding, columns }: Pricing2Props) {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <SectionContainer padding={padding}>
      {columns && columns?.length > 0 && (
        <div className="mx-auto flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-3 text-lg max-w-5xl">
            Monthly
            <Switch
              checked={isYearly}
              onCheckedChange={() => setIsYearly(!isYearly)}
            />
            Yearly
          </div>
          <div
            className={cn(
              "grid gap-6",
              columns?.length === 1 && "md:grid-cols-1 max-w-screen-md",
              columns?.length === 2 && "md:grid-cols-2 max-w-screen-md",
              columns?.length === 3 && "md:grid-cols-3 max-w-screen-lg"
            )}
          >
            {columns?.map((column) => {
              const currentPrice = isYearly
                ? column.price?.yearly
                : column.price?.monthly;
              const annualPrice = calculateAnnualPrice(currentPrice);

              return (
                <Card
                  key={column._key}
                  className="flex w-80 flex-col justify-between text-left"
                >
                  <CardHeader>
                    <CardTitle>
                      <p>{column.title}</p>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {column.description}
                    </p>
                    <span className="text-4xl font-bold">
                      {formatPrice(currentPrice)}
                    </span>
                    <p className="text-muted-foreground">
                      Billed {annualPrice} annually
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Separator className="mb-6" />
                    {column.listTitle && (
                      <p className="mb-3 font-semibold">{column.listTitle}</p>
                    )}
                    <ul className="space-y-4">
                      {column.list?.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CircleCheck className="size-4" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    {column.link?.title && (
                      <Link
                        href={column.link?.href || "#"}
                        target={column.link?.target ? "_blank" : undefined}
                        rel={column.link?.target ? "noopener" : undefined}
                        className={cn(
                          buttonVariants({
                            variant: column.link.buttonVariant || "default",
                          }),
                          "w-full"
                        )}
                      >
                        {column.link?.title}
                        <Icon
                          className="ml-2"
                          iconVariant={column.link?.iconVariant || "none"}
                          strokeWidth={2}
                          size={4}
                        />
                      </Link>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </SectionContainer>
  );
}
