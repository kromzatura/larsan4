"use client";

import { useState } from "react";
import { ContactForm } from "@/components/forms/contact-form";
import { submitContactForm } from "@/app/actions/contact-form";
import type { InquiryItem } from "@/lib/inquiry";
import { clearInquiry } from "@/lib/inquiry";
import { useLocale } from "@/lib/i18n/locale-context";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildLocalizedPath } from "@/lib/i18n/routing";
import type { SupportedLocale } from "@/lib/i18n/config";

interface ContactInquiryWrapperProps {
  initialInquiryItems: InquiryItem[]; // parsed on server for hydration correctness
  locale?: SupportedLocale; // optional explicit locale override
}

export default function ContactInquiryWrapper({
  initialInquiryItems,
  locale: localeProp,
}: ContactInquiryWrapperProps) {
  const localeFromContext = useLocale();
  const locale = localeProp ?? localeFromContext;
  const dict = getDictionary(locale);
  const [items] = useState<InquiryItem[]>(initialInquiryItems);
  const hasItems = items.length > 0;

  // If SSR parsed empty but client has items (e.g., direct navigation), we could sync but keep simple per spec.
  // Optionally: const [items,setItems]=useState(initialInquiryItems); useEffect(()=> setItems(getInquiryList()),[]) // skipped for simplicity.

  return (
    <ContactForm
      locale={locale}
      onSubmit={submitContactForm}
      onSuccess={() => {
        if (hasItems) clearInquiry();
      }}
    >
      {hasItems && (
        <>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium">
                {dict.contact.inquiry.itemsLabel} ({items.length})
              </p>
            </div>
            <ul className="max-h-48 overflow-auto divide-y rounded border bg-background">
              {items.map((item) => (
                <li key={item.id} className="p-3 text-sm">
                  <p className="font-medium break-all">
                    {item.slug ? (
                      <a
                        href={buildLocalizedPath(
                          locale,
                          `/products/${item.slug || ""}`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {item.name || item.id}
                      </a>
                    ) : (
                      <>{item.name || item.id}</>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground break-all">
                    {dict.contact.inquiry.sku}: {item.id}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <input
            type="hidden"
            name="inquiryItems"
            value={encodeURIComponent(
              JSON.stringify(
                items.map((i) => ({
                  id: i.id,
                  name: i.name ?? null,
                  productId: i.productId ?? null,
                  slug: i.slug ?? null,
                  imageUrl: i.imageUrl ?? null,
                }))
              )
            )}
          />
        </>
      )}
    </ContactForm>
  );
}
