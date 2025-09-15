"use client";

import Link from "next/link";
import { useInquiry } from "@/components/inquiry/InquiryContext";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";

export default function InquiryBadge({ className = "", size = "sm" as const }) {
  const { count } = useInquiry();
  return (
    <Link href="/inquiry" className={cn(buttonVariants({ variant: "outline", size }), "relative", className)}>
      <List className="mr-2 h-4 w-4" />
      Inquiry
      {count > 0 && (
        <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}
