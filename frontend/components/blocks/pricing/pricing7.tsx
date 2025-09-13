"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import Link from "next/link";
import Icon from "@/components/icon";
import { buttonVariants } from "@/components/ui/button";
import { Check } from "lucide-react";

type Pricing7Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "pricing-7" }
>;

export default function Pricing7({ padding, badge, columns }: Pricing7Props) {
  const [isAnnually, setIsAnnually] = useState(false);

  return (
    <SectionContainer padding={padding}>
      {columns && columns?.length > 0 && (
        <div className="flex flex-col items-center gap-2">
          {badge?.title && (
            <span className="text-muted-foreground">{badge?.title}</span>
          )}
          <div className="flex h-12 items-center rounded-md bg-muted p-1 text-lg">
            <RadioGroup
              defaultValue="monthly"
              className="h-full grid-cols-2"
              onValueChange={(value) => {
                setIsAnnually(value === "annually");
              }}
            >
              <div className='h-full rounded-md transition-all has-[button[data-state="checked"]]:bg-white'>
                <RadioGroupItem
                  value="monthly"
                  id="monthly"
                  className="peer sr-only"
                />
                {badge?.badge1 && (
                  <Label
                    htmlFor="monthly"
                    className="flex h-full cursor-pointer items-center justify-center px-7 font-semibold text-muted-foreground peer-data-[state=checked]:text-primary"
                  >
                    {badge?.badge1}
                  </Label>
                )}
              </div>
              <div className='h-full rounded-md transition-all has-[button[data-state="checked"]]:bg-white'>
                <RadioGroupItem
                  value="annually"
                  id="annually"
                  className="peer sr-only"
                />
                {badge?.badge2 && (
                  <Label
                    htmlFor="annually"
                    className="flex h-full cursor-pointer items-center justify-center gap-1 px-7 font-semibold text-muted-foreground peer-data-[state=checked]:text-primary"
                  >
                    {badge?.badge2}
                    {badge?.percentage && (
                      <Badge
                        variant="outline"
                        className="border-green-200 bg-green-100 px-1.5 text-green-600"
                      >
                        {badge?.percentage}
                      </Badge>
                    )}
                  </Label>
                )}
              </div>
            </RadioGroup>
          </div>
          <div
            className={cn(
              "mt-10 grid gap-6",
              columns?.length === 1 && "md:grid-cols-1 max-w-screen-md",
              columns?.length === 2 && "md:grid-cols-2 max-w-screen-md",
              columns?.length === 3 && "md:grid-cols-3 max-w-screen-lg"
            )}
          >
            {columns?.map((column) => {
              return (
                <div key={column._key} className="rounded-lg border p-6">
                  <div className="flex h-full flex-col justify-between gap-5">
                    <div>
                      <h3 className="mb-4 text-xl font-semibold">
                        {column.title}
                      </h3>
                      <span className="text-5xl font-semibold">
                        {isAnnually
                          ? column.price?.yearly
                          : column.price?.monthly}
                      </span>
                      <span className="mb-4 block font-semibold">
                        per month
                      </span>
                      {column.description && (
                        <p className="text-muted-foreground">
                          {column.description}
                        </p>
                      )}
                      {column.listTitle && (
                        <p className="mt-6 mb-3 font-semibold">Includes</p>
                      )}
                      {column.list && (
                        <ul className="flex flex-col gap-3">
                          {column.list.map((item) => (
                            <li key={item} className="flex gap-2">
                              <Check className="mt-1 size-4 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </SectionContainer>
  );
}
