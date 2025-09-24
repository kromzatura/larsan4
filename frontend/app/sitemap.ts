import { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

type SitemapEntry = MetadataRoute.Sitemap[number];

const LANGUAGES = ["en", "nl"] as const;

async function getPagesSitemap(lang: (typeof LANGUAGES)[number]): Promise<SitemapEntry[]> {
  const pagesQuery = groq`
    *[
      _type == 'page'
      && language == $lang
      && defined(slug.current)
      && coalesce(meta.noindex, false) == false
    ] | order(slug.current) {
      'url': $baseUrl + '/' + $lang + select(slug.current == 'index' => '', '/' + slug.current),
      'lastModified': _updatedAt,
      'changeFrequency': 'daily',
      'priority': select(
        slug.current == 'index' => 1,
        0.5
      )
    }
  `;

  const { data } = await sanityFetch({
    query: pagesQuery,
    params: {
      baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
      lang,
    },
    perspective: "published",
    stega: false,
  });

  return data;
}

async function getPostsSitemapEn(): Promise<SitemapEntry[]> {
  const postsQuery = groq`
    *[
      _type == 'post'
      && language == 'en'
      && defined(slug.current)
      && coalesce(meta.noindex, false) == false
    ] | order(_updatedAt desc) {
      'url': $baseUrl + '/blog/' + slug.current,
      'lastModified': _updatedAt,
      'changeFrequency': 'weekly',
      'priority': 0.7
    }
  `;

  const { data } = await sanityFetch({
    query: postsQuery,
    params: {
      baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
    },
    perspective: "published",
    stega: false,
  });

  return data;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const resultsPerLang = await Promise.all(
    LANGUAGES.map(async (lang) => {
      const [pages, posts, products, productCategories, blogCategories] =
        await Promise.all([
          getPagesSitemap(lang),
          getPostsSitemapEn(),
          (async (): Promise<SitemapEntry[]> => {
            const { data } = await sanityFetch({
              query: groq`*[
                _type == 'product'
                && language == 'en'
                && defined(slug.current)
                && coalesce(meta.noindex, false) == false
              ] | order(_updatedAt desc) {
                'url': $baseUrl + '/products/' + slug.current,
                'lastModified': _updatedAt,
                'changeFrequency': 'weekly',
                'priority': 0.7
              }`,
              params: { baseUrl: process.env.NEXT_PUBLIC_SITE_URL },
              perspective: "published",
              stega: false,
            });
            return data as SitemapEntry[];
          })(),
          (async (): Promise<SitemapEntry[]> => {
            const { data } = await sanityFetch({
              query: groq`*[
                _type == 'productCategory'
                && language == 'en'
                && defined(slug.current)
                && coalesce(meta.noindex, false) == false
              ] | order(orderRank) {
                'url': $baseUrl + '/products/category/' + slug.current,
                'lastModified': _updatedAt,
                'changeFrequency': 'weekly',
                'priority': 0.6
              }`,
              params: { baseUrl: process.env.NEXT_PUBLIC_SITE_URL },
              perspective: "published",
              stega: false,
            });
            return data as SitemapEntry[];
          })(),
          (async (): Promise<SitemapEntry[]> => {
            const { data } = await sanityFetch({
              query: groq`*[
                _type == 'category'
                && language == 'en'
                && defined(slug.current)
                && coalesce(seo.noindex, false) == false
              ] | order(orderRank) {
                'url': $baseUrl + '/blog/category/' + slug.current,
                'lastModified': _updatedAt,
                'changeFrequency': 'weekly',
                'priority': 0.6
              }`,
              params: { baseUrl: process.env.NEXT_PUBLIC_SITE_URL },
              perspective: "published",
              stega: false,
            });
            return data as SitemapEntry[];
          })(),
        ]);

      const blogIndex: SitemapEntry = {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 0.8,
      };

      return [blogIndex, ...pages, ...posts, ...products, ...productCategories, ...blogCategories];
    })
  );

  return resultsPerLang.flat();
}
