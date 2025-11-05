"use client";

import Script from "next/script";
import type { SupportedLocale } from "@/lib/i18n/config";

export type SiteNavItem = {
  name: string;
  url: string;
};

type Props = {
  locale: SupportedLocale;
  items: SiteNavItem[];
};

/**
 * Renders JSON-LD for primary navigation using SiteNavigationElement entries.
 * Keep the list small (<= 10) and ensure absolute URLs.
 */
export default function SiteNavigationJsonLd({ locale, items }: Props) {
  if (!Array.isArray(items) || items.length === 0) return null;

  const json = items.map((i) => ({
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: i.name,
    url: i.url,
    inLanguage: locale,
  }));

  return (
    <Script
      id="ld-site-navigation"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
