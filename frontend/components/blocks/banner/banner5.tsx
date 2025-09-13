"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import { BannerUIProps } from "./index";

export default function Banner5({ data, isVisible, onClose }: BannerUIProps) {
  const { title, description, link } = data;

  if (!isVisible) return null;

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
                <p className="text-sm font-medium">{title}</p>
                <p className="text-muted-foreground text-sm">{description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {link?.href && (
                <Link
                  href={link.href || "#"}
                  target={link.target ? "_blank" : undefined}
                  rel={link.target ? "noopener" : undefined}
                  className={cn(
                    buttonVariants({
                      variant: link.buttonVariant || "default",
                      size: "sm",
                    }),
                    "w-full md:w-auto"
                  )}
                >
                  {link.title}
                </Link>
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
