"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { cn, toText } from "@/lib/utils";
import { resolveLinkHref } from "@/lib/resolveHref";
import { Button, buttonVariants } from "@/components/ui/button";
import { BannerUIProps } from "./index";

export default function Banner5({
  data,
  isVisible,
  onClose,
  locale,
}: BannerUIProps) {
  const { title, description, link } = data;

  if (!isVisible) return null;

  const href = resolveLinkHref(link, locale);
  const buttonLabel = toText(link?.title) ?? "View";
  const buttonVariant = link?.buttonVariant ?? "default";
  const target = link?.isExternal && link?.target ? "_blank" : undefined;
  const rel = target ? "noopener noreferrer" : undefined;

  return (
    <section className="animate-fade-up fixed left-0 right-0 top-19 z-50 mx-auto max-w-2xl">
      <div className="mx-4">
        <div className="bg-background w-full rounded-lg border p-4 shadow-md">
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-8 w-8 md:hidden"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="flex flex-col items-start gap-3 pt-2 md:flex-row md:items-center md:pt-0">
              <div className="flex flex-col gap-1 md:flex-row md:items-center">
                {toText(title) && (
                  <p className="text-sm font-medium">{toText(title)}</p>
                )}
                {toText(description) && (
                  <p className="text-muted-foreground text-sm">
                    {toText(description)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {href && (
                <Link
                  href={href}
                  target={target}
                  rel={rel}
                  className={cn(
                    buttonVariants({ variant: buttonVariant, size: "sm" }),
                    "w-full md:w-auto"
                  )}
                >
                  {buttonLabel}
                </Link>
              )}
              {!href && link && toText(link.title) && (
                <Button
                  variant={buttonVariant}
                  size="sm"
                  disabled
                  className="w-full md:w-auto"
                >
                  {toText(link.title)}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="hidden h-8 w-8 md:inline-flex"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
