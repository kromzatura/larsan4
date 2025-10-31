import { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import {
  SUPPORTED_LOCALES,
  SupportedLocale,
  DEFAULT_LOCALE,
} from "@/lib/i18n/config";
import { buildLocalizedPath, isSupportedLocale } from "@/lib/i18n/routing";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!baseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SITE_URL environment variable");
}

type SanitySlugData = {
  slug: string;
  lastModified: string;
  language?: string | null;
  docType: string;
  allTranslations?: Array<{ lang: string; slug: string }> | null;
};

type SitemapEntry = MetadataRoute.Sitemap[number];

async function getAllDocumentsForSitemap(): Promise<SanitySlugData[]> {
  const { data } = await sanityFetch({
    query: groq`*[_type in ['page', 'post', 'product', 'productCategory', 'category'] && defined(slug.current) && !(_id in path("drafts.**"))]{
      "slug": slug.current,
      "docType": _type,
      "lastModified": _updatedAt,
      language,
      "allTranslations": *[_type == "translation.metadata" && ^._id in translations[].value._ref][0].translations[defined(value->slug.current) && defined(_key)]{
        "lang": _key,
        "slug": value->slug.current
      }
    }`,
    perspective: "published",
    stega: false,
  });
  return (data || []) as SanitySlugData[];
}

function docsToEntries(
  docs: SanitySlugData[],
  buildPath: (slug: string) => string,
  changeFrequency: SitemapEntry["changeFrequency"],
  priority: number
): SitemapEntry[] {
  return docs
    .map((doc) => {
      if (!doc.slug || !doc.lastModified) {
        console.warn(
          "Skipping sitemap entry due to missing slug or lastModified date:",
          doc
        );
        return null;
      }

      const locale: SupportedLocale = isSupportedLocale(doc.language)
        ? (doc.language as SupportedLocale)
        : DEFAULT_LOCALE;

      const languages: Record<string, string> = {};
      const translations = Array.isArray(doc.allTranslations)
        ? doc.allTranslations
        : [];
      for (const t of translations) {
        if (!isSupportedLocale(t.lang as SupportedLocale)) continue;
        const path = buildPath(t.slug === "index" ? "" : t.slug);
        languages[t.lang] = `${baseUrl}${buildLocalizedPath(
          t.lang as SupportedLocale,
          path
        )}`;
      }

      return {
        url: `${baseUrl}${buildLocalizedPath(locale, buildPath(doc.slug))}`,
        lastModified: new Date(doc.lastModified).toISOString(),
        changeFrequency,
        priority,
        alternates:
          Object.keys(languages).length > 0 ? { languages } : undefined,
      };
    })
    .filter(Boolean) as SitemapEntry[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allDocs = await getAllDocumentsForSitemap();

  const docTypeDefs = {
    page: {
      buildPath: (slug: string) => (slug === "index" ? "/" : `/${slug}`),
      changeFrequency: "daily",
      priority: 0.7,
    },
    post: {
      buildPath: (slug: string) => `/blog/${slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    product: {
      buildPath: (slug: string) => `/products/${slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    productCategory: {
      buildPath: (slug: string) => `/products/category/${slug}`,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    category: {
      buildPath: (slug: string) => `/blog/category/${slug}`,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  };

  const dynamicEntries = Object.entries(docTypeDefs).flatMap(
    ([type, { buildPath, changeFrequency, priority }]) => {
      const docs = allDocs.filter((doc) => doc.docType === type);
      return docsToEntries(
        docs,
        buildPath,
        changeFrequency as SitemapEntry["changeFrequency"],
        priority
      );
    }
  );

  const staticPaths = ["/blog", "/products", "/contact", "/inquiry"] as const;
  const staticEntries: SitemapEntry[] = staticPaths.flatMap((path) => {
    // Build a full languages map for alternates across supported locales
    const languages: Record<string, string> = {};
    for (const loc of SUPPORTED_LOCALES) {
      languages[loc] = `${baseUrl}${buildLocalizedPath(loc, path)}`;
    }

    // Emit an entry per locale with the shared alternates map
    return SUPPORTED_LOCALES.map((locale) => ({
      url: languages[locale],
      lastModified: new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: 0.8,
      alternates: { languages },
    }));
  });

  return [...staticEntries, ...dynamicEntries];
}
