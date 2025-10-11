"use client";

import Link from "next/link";
import { useInquiry } from "@/components/inquiry/InquiryContext";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";
import { buildLocalizedPath } from "@/lib/i18n/routing";

interface Props {
  className?: string;
  size?: "sm" | "default" | "lg";
  locale?: SupportedLocale;
}

export default function InquiryBadge({ className = "", size = "sm", locale = FALLBACK_LOCALE }: Props) {
  const { count } = useInquiry();
  const dict = getDictionary(locale);
  const href = buildLocalizedPath(locale, "/inquiry");
  return (
    <Link href={href} className={cn(buttonVariants({ variant: "outline", size }), "relative", className)}>
      <List className="mr-2 h-4 w-4" />
      {dict.inquiry.label}
      {count > 0 && (
        <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}
