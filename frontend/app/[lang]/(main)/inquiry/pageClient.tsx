"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInquiry } from "@/components/inquiry/InquiryContext";
import {
  clearInquiry,
  removeFromInquiry,
  getInquiryList,
  INQUIRY_UPDATED_EVENT,
  type InquiryItem,
} from "@/lib/inquiry";
import { Trash2, X, Send, ArrowLeft } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildLocalizedPath } from "@/lib/i18n/routing";

function encodeInquiry(items: InquiryItem[]): string {
  try {
    return encodeURIComponent(
      JSON.stringify(
        items.map((i) => ({
          id: i.id,
          name: i.name ?? null,
          productId: i.productId ?? null,
          slug: i.slug ?? null,
          imageUrl: i.imageUrl ?? null,
        }))
      )
    );
  } catch {
    return "";
  }
}

export default function InquiryPageClient() {
  const { items } = useInquiry();
  const [localItems, setLocalItems] = useState<InquiryItem[]>(items);
  const locale = useLocale();
  const t = getDictionary(locale);

  useEffect(() => {
    // Sync initial items (in case context lag)
    setLocalItems(getInquiryList());
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ items: InquiryItem[] }>;
      setLocalItems(ce.detail.items);
    };
    window.addEventListener(INQUIRY_UPDATED_EVENT, handler as EventListener);
    return () =>
      window.removeEventListener(
        INQUIRY_UPDATED_EVENT,
        handler as EventListener
      );
  }, []);

  const inquiryParam = useMemo(() => encodeInquiry(localItems), [localItems]);

  const hasItems = localItems.length > 0;

  return (
    <div className="container py-10 max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
  <h1 className="text-3xl font-serif font-semibold tracking-tight">{t.inquiry?.label || "Inquiry"}</h1>
        {hasItems && (
          <button
            onClick={() => clearInquiry()}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="mr-1 h-4 w-4" /> {t.inquiry?.clearAll ?? "Clear all"}
          </button>
        )}
      </div>

      {!hasItems && (
        <div className="rounded-md border p-10 text-center">
          <p className="mb-6 text-muted-foreground">
            {t.inquiry?.empty ?? "No items in your inquiry list yet."}
          </p>
          <Link
            href={buildLocalizedPath(locale, "/products")}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            {t.inquiry?.browse || "Browse Products"}
          </Link>
        </div>
      )}

      {hasItems && (
        <div className="space-y-6">
          <ul className="divide-y rounded-md border">
            {localItems.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between p-4 gap-4"
              >
                <div>
                  <p className="font-medium leading-none break-all">
                    {item.name || item.id}
                  </p>
                  {item.name && item.id !== item.name && (
                    <p className="mt-1 text-xs text-muted-foreground break-all">
                      SKU: {item.id}
                    </p>
                  )}
                  {!item.name && (
                    <p className="mt-1 text-xs text-muted-foreground break-all">
                      SKU: {item.id}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeFromInquiry(item.id)}
                  aria-label="Remove"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              href={buildLocalizedPath(locale, "/products")}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "flex-1 inline-flex items-center justify-center"
              )}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> {t.inquiry?.continue ?? "Continue Shopping"}
            </Link>
            <Link
              href={`${buildLocalizedPath(locale, "/contact")}${
                inquiryParam ? `?inquiry=${inquiryParam}` : ""
              }`}
              className={cn(
                buttonVariants({ variant: "default" }),
                "flex-1 inline-flex items-center justify-center"
              )}
            >
              <Send className="mr-2 h-4 w-4" /> {t.inquiry?.send ?? "Send Inquiry"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
