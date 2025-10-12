import { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { SUPPORTED_LOCALES, SupportedLocale, DEFAULT_LOCALE } from "@/lib/i18n/config";
import { buildLocalizedPath, isSupportedLocale } from "@/lib/i18n/routing";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type SanitySlugData = {
  slug: string;
  lastModified: string;
  language?: string | null;
};

type SitemapEntry = MetadataRoute.Sitemap[number];

// Fetchers: return slug, lastModified, and language when available
async function getPageSlugs(): Promise<SanitySlugData[]> {
  const { data } = await sanityFetch({
    query: groq`*[_type == 'page' && defined(slug.current) && coalesce(meta.noindex, false) == false]{
      "slug": slug.current,
      "lastModified": _updatedAt,
      language
    }`,
    perspective: "published",
    stega: false,
  });
  return (data || []) as SanitySlugData[];
}

async function getPostSlugs(): Promise<SanitySlugData[]> {
  const { data } = await sanityFetch({
    query: groq`*[_type == 'post' && defined(slug.current) && coalesce(meta.noindex, false) == false]{
      "slug": slug.current,
      "lastModified": _updatedAt,
      language
    }`,
    perspective: "published",
    stega: false,
  });
  return (data || []) as SanitySlugData[];
}

async function getProductSlugs(): Promise<SanitySlugData[]> {
  const { data } = await sanityFetch({
    query: groq`*[_type == 'product' && defined(slug.current) && coalesce(meta.noindex, false) == false]{
      "slug": slug.current,
      "lastModified": _updatedAt,
      language
    }`,
    perspective: "published",
    stega: false,
  });
  return (data || []) as SanitySlugData[];
}

async function getProductCategorySlugs(): Promise<SanitySlugData[]> {
  const { data } = await sanityFetch({
    query: groq`*[_type == 'productCategory' && defined(slug.current) && coalesce(meta.noindex, false) == false]{
      "slug": slug.current,
      "lastModified": _updatedAt,
      language
    }`,
    perspective: "published",
    stega: false,
  });
  return (data || []) as SanitySlugData[];
}

async function getBlogCategorySlugs(): Promise<SanitySlugData[]> {
  const { data } = await sanityFetch({
    query: groq`*[_type == 'category' && defined(slug.current) && coalesce(seo.noindex, false) == false]{
      "slug": slug.current,
      "lastModified": _updatedAt,
      language
    }`,
    perspective: "published",
    stega: false,
  });
  return (data || []) as SanitySlugData[];
}

// Convert docs to localized sitemap entries respecting document language
function docsToEntries(
  docs: SanitySlugData[],
  buildPath: (slug: string) => string,
  changeFrequency: SitemapEntry["changeFrequency"],
  priority: number
): SitemapEntry[] {
  return docs.map((doc) => {
    const locale: SupportedLocale = isSupportedLocale(doc.language)
      ? (doc.language as SupportedLocale)
      : DEFAULT_LOCALE;

    return {
      url: `${baseUrl}${buildLocalizedPath(locale, buildPath(doc.slug))}`,
      lastModified: doc.lastModified,
      changeFrequency,
      priority,
    };
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pageSlugs, postSlugs, productSlugs, productCategorySlugs, blogCategorySlugs] =
    await Promise.all([
      getPageSlugs(),
      getPostSlugs(),
      getProductSlugs(),
      getProductCategorySlugs(),
      getBlogCategorySlugs(),
    ]);

  // Static routes present regardless of Sanity docs
  // Only include static routes that have no corresponding Sanity document
  const staticPaths = ["/blog", "/products", "/contact", "/inquiry"] as const;
  const staticEntries: SitemapEntry[] = staticPaths.flatMap((path) =>
    SUPPORTED_LOCALES.map((locale) => ({
      url: `${baseUrl}${buildLocalizedPath(locale, path)}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }))
  );

  // Pages: treat slug 'index' as root path
  const pageEntries = docsToEntries(
    pageSlugs,
    (slug) => (slug === "index" ? "/" : `/${slug}`),
    "daily",
    0.7
  );

  const postEntries = docsToEntries(postSlugs, (slug) => `/blog/${slug}`, "weekly", 0.6);
  const productEntries = docsToEntries(productSlugs, (slug) => `/products/${slug}`, "weekly", 0.6);
  const blogCategoryEntries = docsToEntries(
    blogCategorySlugs,
    (slug) => `/blog/category/${slug}`,
    "weekly",
    0.5
  );
  const productCategoryEntries = docsToEntries(
    productCategorySlugs,
    (slug) => `/products/category/${slug}`,
    "weekly",
    0.5
  );

  return [
    ...staticEntries,
    ...pageEntries,
    ...postEntries,
    ...productEntries,
    ...blogCategoryEntries,
    ...productCategoryEntries,
  ];
}
