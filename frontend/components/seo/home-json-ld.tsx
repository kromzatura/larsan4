"use client";

import Script from "next/script";
import type { SupportedLocale } from "@/lib/i18n/config";
import SiteNavigationJsonLd, {
  type SiteNavItem,
} from "./site-navigation-json-ld";

type Props = {
  locale: SupportedLocale;
  homepageUrl: string;
  siteName?: string | null;
  logoUrl?: string | null;
  sameAs?: string[] | null;
  // Optional list of primary navigation items (absolute URLs) to render as SiteNavigationElement
  siteNavigation?: SiteNavItem[];
};

/**
 * Renders JSON-LD for the homepage: Organization, WebSite, and BreadcrumbList.
 * Keep payloads minimal and language-aware.
 */
export default function HomeJsonLd({
  locale,
  homepageUrl,
  siteName,
  logoUrl,
  sameAs,
  siteNavigation,
}: Props) {
  const scripts: Array<{ id: string; json: Record<string, unknown> }> = [];

  if (siteName) {
    const org: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteName,
      url: homepageUrl,
    };
    if (logoUrl) org.logo = logoUrl;
    if (Array.isArray(sameAs) && sameAs.length > 0) org.sameAs = sameAs;
    scripts.push({ id: "ld-org", json: org });

    scripts.push({
      id: "ld-website",
      json: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteName,
        url: homepageUrl,
        inLanguage: locale,
      },
    });
  }

  scripts.push({
    id: "ld-breadcrumbs",
    json: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      inLanguage: locale,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: homepageUrl,
        },
      ],
    },
  });

  return (
    <>
      {scripts.map(({ id, json }) => (
        <Script
          id={id}
          key={id}
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
        />
      ))}
      {/* Option A: only emit SiteNavigationElement on the homepage */}
      {Array.isArray(siteNavigation) && siteNavigation.length > 0 ? (
        <SiteNavigationJsonLd locale={locale} items={siteNavigation} />
      ) : null}
    </>
  );
}
