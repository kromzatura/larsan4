"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  addToInquiry,
  isInInquiry,
  INQUIRY_UPDATED_EVENT,
  type InquiryItem,
} from "@/lib/inquiry";
import { useLocale } from "@/lib/i18n/locale-context";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default function AddToInquiryButton({ item, className }: { item: InquiryItem; className?: string }) {
  const [added, setAdded] = useState<boolean>(false);
  const itemKey = useMemo(() => item.id, [item.id]);
  const locale = useLocale();
  const t = getDictionary(locale);

  useEffect(() => {
    setAdded(isInInquiry(itemKey));
    const onUpdated = () => setAdded(isInInquiry(itemKey));
    window.addEventListener(INQUIRY_UPDATED_EVENT, onUpdated as EventListener);
    return () => window.removeEventListener(INQUIRY_UPDATED_EVENT, onUpdated as EventListener);
  }, [itemKey]);

  return (
    <Button
      size="lg"
      className={className}
      aria-disabled={added}
      onClick={() => {
        const res = addToInquiry(item);
        if (res.added) {
          setAdded(true);
          toast.success(t.productPage.toasts.added, { description: item.name || item.id });
        } else {
          toast(t.productPage.toasts.already, { description: item.name || item.id });
        }
      }}
    >
      {added ? `${t.productPage.actions.addedToInquiry} ✓` : t.productPage.actions.addToInquiry}
    </Button>
  );
}
