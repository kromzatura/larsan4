"use client";

import { useState } from "react";

import { cn, toText } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import Link from "next/link";
import Tag from "@/components/ui/tag";
import { buttonVariants } from "@/components/ui/button";
import { CheckCircle2, Zap } from "lucide-react";
import { resolveLinkHref } from "@/lib/resolveHref";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";

type Pricing16Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "pricing-16" }
> & { locale?: SupportedLocale };

export default function Pricing16({
  title,
  tag,
  padding,
  columns,
  locale = FALLBACK_LOCALE,
}: Pricing16Props) {
  const [isMonthly, setIsMonthly] = useState(true);

  const yearlyPrice = (
    value: number | null | undefined,
    discount: number | null | undefined
  ) => {
    if (!value || !discount) return 0;
    return Math.floor(value * (1 - discount / 100));
  };

  return (
    <SectionContainer
      padding={padding}
      className="bg-muted/50"
      withContainer={false}
    >
      {columns && columns?.length > 0 && (
        <div className="container">
          <div className="flex flex-col items-center gap-6">
            {tag && tag.text && (
              <Tag
                title={toText(tag.text) || ""}
                type={tag.type as "title" | "badge"}
                element="p"
              />
            )}
            {toText(title) && (
              <h1 className="text-center text-4xl font-semibold text-balance sm:text-5xl lg:text-7xl">
                {toText(title)}
              </h1>
            )}
            <Tabs
              value={isMonthly ? "monthly" : "yearly"}
              onValueChange={(value) => setIsMonthly(value === "monthly")}
              className="w-80"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Billed Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Billed Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
            {columns && columns?.length > 0 && (
              <div
                className={cn(
                  "mx-auto mt-4 grid w-full gap-6",
                  columns?.length === 2 && "lg:grid-cols-2 max-w-screen-md",
                  columns?.length === 3 && "lg:grid-cols-3 max-w-screen-lg",
                  columns?.length === 4 && "lg:grid-cols-4 max-w-screen-xl"
                )}
              >
                {columns?.map((column) => (
                  <div
                    key={column._key}
                    className="w-full rounded-lg border bg-background p-8 shadow-sm lg:max-w-96 mx-auto"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        {toText(column.title) && (
                          <h3 className="text-xl font-semibold">
                            {toText(column.title)}
                          </h3>
                        )}
                        {column.featured && (
                          <Badge className="flex items-center gap-1">
                            <Zap className="size-3" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      {toText(column.description) && (
                        <p className="text-sm text-muted-foreground">
                          {toText(column.description)}
                        </p>
                      )}
                    </div>
                    <Separator className="my-6" />
                    <div className="flex items-center gap-2">
                      <div className="flex items-start font-semibold">
                        <p className="text-xl">$</p>
                        <p className="text-5xl leading-none">
                          {isMonthly
                            ? column.price?.value
                            : yearlyPrice(
                                column.price?.value,
                                column.price?.discount
                              )}
                        </p>
                      </div>
                      {!isMonthly &&
                        column.price?.discount &&
                        column.price?.discount !== 0 && (
                          <div className="flex flex-col text-sm">
                            {column.price?.discount && (
                              <p className="font-semibold text-destructive">
                                {column.price?.discount}% off
                              </p>
                            )}
                            {column.price?.value && (
                              <p className="text-muted-foreground line-through">
                                ${column.price?.value}
                              </p>
                            )}
                          </div>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      per user/month, billed {isMonthly ? "monthly" : "yearly"}
                    </p>
                    {toText(column.link?.title) && (
                      <Link
                        href={resolveLinkHref(column.link, locale) || "#"}
                        target={column.link?.target ? "_blank" : undefined}
                        rel={column.link?.target ? "noopener" : undefined}
                        className={cn(
                          buttonVariants({
                            variant: column.link?.buttonVariant || "default",
                          }),
                          "mt-4 mb-2 w-full"
                        )}
                      >
                        {toText(column.link?.title)}
                      </Link>
                    )}
                    <p className="text-center text-sm text-muted-foreground">
                      No credit card required
                    </p>
                    <Separator className="my-6" />
                    <div>
                      {toText(column.listTitle) && (
                        <p className="mb-3 text-sm font-semibold">
                          {toText(column.listTitle)}:{" "}
                        </p>
                      )}
                      <ul className="flex flex-col gap-2">
                        {column.list?.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
                            <p>{toText(item) || ""}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </SectionContainer>
  );
}
