"use client";

import { cn } from "@/lib/utils";
import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CheckIcon, Info, MinusIcon } from "lucide-react";
import { Fragment, useState } from "react";

type Pricing9Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "pricing-9" }
>;

type TierName = "free" | "pro" | "premium";

export default function Pricing9({
  padding,
  columns,
  sections,
}: Pricing9Props) {
  const [isAnnual, setIsAnnual] = useState(false);
  return (
    <SectionContainer padding={padding}>
      <div className="mt-10 flex flex-col items-center gap-2 lg:hidden">
        <span className="flex items-center gap-3 text-base font-medium">
          Annual
          <Switch
            checked={isAnnual}
            onCheckedChange={() => setIsAnnual(!isAnnual)}
          />
          Monthly
        </span>
      </div>
      {columns && columns?.length > 0 && (
        <div className="mx-auto mt-12 max-w-md space-y-8 sm:mt-16 lg:hidden">
          {columns?.map((column) => (
            <Card key={column._key} className="p-8">
              <CardHeader className="p-0">
                <div className="flex flex-col gap-2 text-center">
                  {column.title && (
                    <span className="text-xl leading-7 font-bold uppercase">
                      <CardTitle className="text-xl">{column.title}</CardTitle>
                    </span>
                  )}
                  {column.description && (
                    <span className="text-sm font-normal text-muted-foreground">
                      {column.description}
                    </span>
                  )}
                </div>
                <div className="flex flex-col justify-center gap-x-1 pt-8 text-center">
                  <span className="text-4xl font-bold">
                    ${isAnnual ? column.price?.yearly : column.price?.monthly}
                  </span>
                  <span className="text-sm leading-6 text-muted-foreground">
                    /month
                  </span>
                </div>
              </CardHeader>
              {column.link?.title && (
                <Link
                  href={column.link?.href || "#"}
                  target={column.link?.target ? "_blank" : undefined}
                  rel={column.link?.target ? "noopener" : undefined}
                  className={cn(
                    buttonVariants({
                      variant: column.link.buttonVariant || "default",
                    }),
                    "mt-8 w-full"
                  )}
                >
                  {column.link?.title}
                </Link>
              )}
              <CardContent className="p-0">
                {sections && sections?.length > 0 && (
                  <ul className="mt-10 space-y-4 text-sm leading-6">
                    <TooltipProvider>
                      {sections.map((section) => (
                        <li key={section.title}>
                          {section.features && section.features?.length > 0 && (
                            <ul role="list" className="space-y-4">
                              {section.features.map(
                                (feature) =>
                                  feature?.tiers &&
                                  feature?.tiers[column.title as TierName] && (
                                    <li
                                      key={feature.name}
                                      className="flex items-center justify-between"
                                    >
                                      <span className="flex items-center gap-3">
                                        <CheckIcon className="h-5 w-5 flex-none" />
                                        <span>{feature.name}</span>
                                      </span>
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <Info className="ml-1 h-4 w-4 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          {feature.tooltip}
                                        </TooltipContent>
                                      </Tooltip>
                                    </li>
                                  )
                              )}
                            </ul>
                          )}
                        </li>
                      ))}
                    </TooltipProvider>
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {columns && columns?.length > 0 && (
        <div className="isolate mt-20 hidden lg:block">
          <div className="relative -mx-8">
            {columns.map((column, idx) => (
              <div
                className="absolute inset-x-4 inset-y-0 -z-10 flex"
                key={column._key}
              >
                <div
                  className="flex w-1/4 px-4"
                  style={{
                    marginLeft: `${(idx + 1) * 25}%`,
                  }}
                >
                  <div className="w-full border-x" />
                </div>
              </div>
            ))}
            <table className="w-full table-fixed border-separate border-spacing-x-8 text-left">
              <thead>
                <tr>
                  <td />
                  {columns.map((column) => (
                    <th key={column._key} className="px-6 pt-6 xl:px-8 xl:pt-8">
                      <div className="flex flex-col gap-2 text-center">
                        <span className="text-xl leading-7 font-bold uppercase">
                          {column.title}
                        </span>
                        <span className="text-sm font-normal text-muted-foreground">
                          {column.description}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-normal text-muted-foreground">
                        Billings
                      </p>
                      <span className="flex items-center gap-3 text-base font-medium">
                        Annual
                        <Switch
                          checked={isAnnual}
                          onCheckedChange={() => setIsAnnual(!isAnnual)}
                        />
                        Monthly
                      </span>
                    </div>
                  </th>
                  {columns.map((column) => (
                    <td key={column._key} className="px-6 pt-10 xl:px-8">
                      <div className="flex flex-col justify-center gap-x-1 text-center">
                        <span className="text-4xl font-bold">
                          $
                          {isAnnual
                            ? column.price?.yearly
                            : column.price?.monthly}
                        </span>
                        <span className="text-sm leading-6 text-muted-foreground">
                          /month
                        </span>
                      </div>
                      {column.link?.title && (
                        <Link
                          href={column.link?.href || "#"}
                          target={column.link?.target ? "_blank" : undefined}
                          rel={column.link?.target ? "noopener" : undefined}
                          className={cn(
                            buttonVariants({
                              variant: column.link.buttonVariant || "default",
                            }),
                            "mt-8 w-full"
                          )}
                        >
                          {column.link?.title}
                        </Link>
                      )}
                    </td>
                  ))}
                </tr>
                {sections &&
                  sections?.length > 0 &&
                  sections.map((section, sectionIdx) => (
                    <Fragment key={section._key}>
                      <tr>
                        <th
                          className={cn(
                            "pb-4 text-sm leading-6 font-semibold",
                            sectionIdx === 0 ? "pt-8" : "pt-16"
                          )}
                        >
                          {section.title}
                        </th>
                      </tr>
                      <TooltipProvider delayDuration={200}>
                        {section.features &&
                          section.features?.length > 0 &&
                          section.features.map((feature) => (
                            <tr key={feature._key}>
                              <th className="flex items-center justify-between py-4 text-sm leading-6 font-normal">
                                {feature.name}
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="ml-1 h-4 w-4 text-muted-foreground hover:text-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {feature.tooltip}
                                  </TooltipContent>
                                </Tooltip>
                              </th>
                              {columns.map((column) => (
                                <td
                                  key={column._key}
                                  className="px-6 py-4 xl:px-8"
                                >
                                  <>
                                    {feature.tiers &&
                                    feature.tiers[column.title as TierName] ? (
                                      <CheckIcon className="mx-auto h-5 w-5" />
                                    ) : (
                                      <MinusIcon className="mx-auto h-5 w-5 text-muted-foreground" />
                                    )}
                                  </>
                                </td>
                              ))}
                            </tr>
                          ))}
                      </TooltipProvider>
                    </Fragment>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </SectionContainer>
  );
}
