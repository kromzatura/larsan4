import { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

async function getPagesSitemap(): Promise<MetadataRoute.Sitemap[]> {
  const pagesQuery = groq`
    *[_type == 'page' && defined(slug.current) && coalesce(meta.noindex, false) == false] | order(slug.current) {
      'url': $baseUrl + select(slug.current == 'index' => '', '/' + slug.current),
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
    },
    perspective: "published",
    stega: false,
  });

  return data;
}

async function getPostsSitemap(): Promise<MetadataRoute.Sitemap[]> {
  const postsQuery = groq`
    *[_type == 'post' && defined(slug.current) && coalesce(meta.noindex, false) == false] | order(_updatedAt desc) {
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap[]> {
  const [pages, posts, products, productCategories, blogCategories] =
    await Promise.all([
      getPagesSitemap(),
      getPostsSitemap(),
      (async () => {
        const { data } = await sanityFetch({
          query: groq`*[_type == 'product' && defined(slug)] {
          'url': $baseUrl + '/products/' + slug.current,
          'lastModified': _updatedAt,
          'changeFrequency': 'weekly',
          'priority': 0.7
        }`,
          params: { baseUrl: process.env.NEXT_PUBLIC_SITE_URL },
          perspective: "published",
          stega: false,
        });
        return data as MetadataRoute.Sitemap[];
      })(),
      (async () => {
        const { data } = await sanityFetch({
          query: groq`*[_type == 'productCategory' && defined(slug)] | order(orderRank) {
          'url': $baseUrl + '/products/category/' + slug.current,
          'lastModified': _updatedAt,
          'changeFrequency': 'weekly',
          'priority': 0.6
        }`,
          params: { baseUrl: process.env.NEXT_PUBLIC_SITE_URL },
          perspective: "published",
          stega: false,
        });
        return data as MetadataRoute.Sitemap[];
      })(),
      (async () => {
        const { data } = await sanityFetch({
          query: groq`*[_type == 'category' && defined(slug) && coalesce(seo.noindex, false) == false] | order(orderRank) {
          'url': $baseUrl + '/blog/category/' + slug.current,
          'lastModified': _updatedAt,
          'changeFrequency': 'weekly',
          'priority': 0.6
        }`,
          params: { baseUrl: process.env.NEXT_PUBLIC_SITE_URL },
          perspective: "published",
          stega: false,
        });
        return data as MetadataRoute.Sitemap[];
      })(),
    ]);

  return [
    ...pages,
    ...posts,
    ...products,
    ...productCategories,
    ...blogCategories,
  ];
}
