import { sanityFetch } from "@/sanity/lib/live";
import { NAVIGATION_QUERY } from "@/sanity/queries/navigation";
import { BANNER_QUERY } from "@/sanity/queries/banner";
import { PAGE_QUERY, PAGES_SLUGS_QUERY } from "@/sanity/queries/page";
import { SETTINGS_QUERY } from "@/sanity/queries/settings";
import { CONTACT_QUERY } from "@/sanity/queries/contact";
import {
  POST_QUERY,
  POSTS_QUERY,
  POSTS_QUERY_AZ,
  POSTS_QUERY_ZA,
  POSTS_SLUGS_QUERY,
  POSTS_COUNT_QUERY,
} from "@/sanity/queries/post";
import { CHANGELOGS_QUERY } from "@/sanity/queries/changelog";
import { TEAM_QUERY } from "@/sanity/queries/team";
import {
  PRODUCT_QUERY,
  PRODUCTS_QUERY as PRODUCTS_LIST_QUERY,
  PRODUCTS_SLUGS_QUERY,
  PRODUCTS_COUNT_QUERY,
  PRODUCT_CATEGORIES_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY_NEWEST,
  PRODUCTS_BY_CATEGORY_QUERY_AZ,
  PRODUCTS_BY_CATEGORY_QUERY_ZA,
  PRODUCTS_COUNT_BY_CATEGORY_QUERY,
  PRODUCT_CATEGORY_BY_SLUG_QUERY,
} from "@/sanity/queries/product";
import {
  PAGE_QUERYResult,
  PAGES_SLUGS_QUERYResult,
  POST_QUERYResult,
  POSTS_QUERYResult,
  POSTS_SLUGS_QUERYResult,
  NAVIGATION_QUERYResult,
  BANNER_QUERYResult,
  SETTINGS_QUERYResult,
  CONTACT_QUERYResult,
  CHANGELOGS_QUERYResult,
  TEAM_QUERYResult,
  // Product
  PRODUCT_QUERYResult,
  PRODUCTS_QUERYResult as PRODUCTS_LIST_QUERYResult,
  PRODUCTS_SLUGS_QUERYResult,
  PRODUCT_CATEGORIES_QUERYResult,
  ProductCategory,
} from "@/sanity.types";
import {
  BLOG_CATEGORIES_QUERY,
  BLOG_CATEGORY_BY_SLUG_QUERY,
  POSTS_BY_BLOG_CATEGORY_QUERY_NEWEST,
  POSTS_BY_BLOG_CATEGORY_QUERY_AZ,
  POSTS_BY_BLOG_CATEGORY_QUERY_ZA,
  POSTS_COUNT_BY_BLOG_CATEGORY_QUERY,
} from "@/sanity/queries/blogCategory";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE, getFallbackLocale } from "@/lib/i18n/config";

function resolveLocaleParams(lang?: SupportedLocale) {
  const resolvedLang = lang ?? FALLBACK_LOCALE;
  return {
    lang: resolvedLang,
    fallbackLang: getFallbackLocale(resolvedLang),
  };
}

export type ProductCategoryWithMeta = ProductCategory & {
  description?: string | null;
  meta?: {
    title?: string | null;
    description?: string | null;
    noindex?: boolean | null;
    image?: {
      asset?: {
        _id?: string;
        url?: string;
        mimeType?: string;
        metadata?: {
          dimensions?: { width?: number; height?: number } | null;
        } | null;
      } | null;
    } | null;
  } | null;
};

export const fetchSanityNavigation = async ({
  lang,
}: {
  lang?: SupportedLocale;
} = {}): Promise<NAVIGATION_QUERYResult> => {
  const { lang: queryLang, fallbackLang } = resolveLocaleParams(lang);
  const { data } = await sanityFetch({
    query: NAVIGATION_QUERY,
    params: { lang: queryLang, fallbackLang },
    perspective: "published",
    stega: false,
  });

  return data;
};

export const fetchSanityBanner = async (): Promise<BANNER_QUERYResult> => {
  const { data } = await sanityFetch({
    query: BANNER_QUERY,
  });
  return data;
};

export const fetchSanityPageBySlug = async ({
  slug,
  lang,
}: {
  slug: string;
  lang?: SupportedLocale;
}): Promise<PAGE_QUERYResult> => {
  const { lang: queryLang, fallbackLang } = resolveLocaleParams(lang);
  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: { slug, lang: queryLang, fallbackLang },
    perspective: "published",
    stega: false,
  });

  return data;
};

export const fetchSanityPagesStaticParams = async ({
  lang,
}: {
  lang?: SupportedLocale;
} = {}): Promise<PAGES_SLUGS_QUERYResult> => {
  const { lang: queryLang, fallbackLang } = resolveLocaleParams(lang);
  const { data } = await sanityFetch({
    query: PAGES_SLUGS_QUERY,
    params: { lang: queryLang, fallbackLang },
    perspective: "published",
    stega: false,
  });

  return data;
};

export const fetchSanityPosts = async ({
  page,
  limit,
  sort = "newest",
  lang,
}: {
  page?: number;
  limit: number;
  sort?: "newest" | "az" | "za";
  lang?: SupportedLocale;
}): Promise<POSTS_QUERYResult> => {
  const offset = page && limit ? (page - 1) * limit : 0;
  const end = offset + limit;
  const query =
    sort === "az"
      ? POSTS_QUERY_AZ
      : sort === "za"
      ? POSTS_QUERY_ZA
      : POSTS_QUERY;
  const { lang: queryLang, fallbackLang } = resolveLocaleParams(lang);
  const { data } = await sanityFetch({
    query,
    params: { offset, end, lang: queryLang, fallbackLang },
    perspective: "published",
    stega: false,
  });

  return data;
};

export const fetchSanityChangelogs =
  async (): Promise<CHANGELOGS_QUERYResult> => {
    const { data } = await sanityFetch({
      query: CHANGELOGS_QUERY,
    });

    return data;
  };

export const fetchSanityTeam = async (): Promise<TEAM_QUERYResult> => {
  const { data } = await sanityFetch({
    query: TEAM_QUERY,
  });
  return data;
};

export const fetchSanityProducts = async ({
  page,
  limit,
  lang,
}: {
  page?: number;
  limit: number;
  lang?: SupportedLocale;
}): Promise<PRODUCTS_LIST_QUERYResult> => {
  const offset = page && limit ? (page - 1) * limit : 0;
  const end = offset + limit;
  const { lang: queryLang, fallbackLang } = resolveLocaleParams(lang);
  const { data } = await sanityFetch({
    query: PRODUCTS_LIST_QUERY,
    params: { offset, end, lang: queryLang, fallbackLang },
    perspective: "published",
    stega: false,
  });
  return data;
};

export const fetchSanityProductsByCategory = async ({
  slug,
  page,
  limit,
  sort = "newest",
  lang,
}: {
  slug: string;
  page?: number;
  limit: number;
  sort?: "newest" | "az" | "za";
  lang?: SupportedLocale;
}): Promise<PRODUCTS_LIST_QUERYResult> => {
  const offset = page && limit ? (page - 1) * limit : 0;
  const end = offset + limit;
  const query =
    sort === "az"
      ? PRODUCTS_BY_CATEGORY_QUERY_AZ
      : sort === "za"
      ? PRODUCTS_BY_CATEGORY_QUERY_ZA
      : PRODUCTS_BY_CATEGORY_QUERY_NEWEST;
  const { lang: queryLang, fallbackLang } = resolveLocaleParams(lang);
  const { data } = await sanityFetch({
    query,
    params: { slug, offset, end, lang: queryLang, fallbackLang },
    perspective: "published",
    stega: false,
  });
  return data;
};

export const fetchSanityProductBySlug = async ({
  slug,
  lang,
}: {
  slug: string;
  lang?: SupportedLocale;
}): Promise<PRODUCT_QUERYResult> => {
  const { lang: queryLang, fallbackLang } = resolveLocaleParams(lang);
  const { data } = await sanityFetch({
    query: PRODUCT_QUERY,
    params: { slug, lang: queryLang, fallbackLang },
    perspective: "published",
    stega: false,
  });
  return data;
};

export const fetchSanityProductSlugs = async ({
  lang,
}: {
  lang?: SupportedLocale;
} = {}): Promise<PRODUCTS_SLUGS_QUERYResult> => {
  const { lang: queryLang, fallbackLang } = resolveLocaleParams(lang);
  const { data } = await sanityFetch({
    query: PRODUCTS_SLUGS_QUERY,
    params: { lang: queryLang, fallbackLang },
    perspective: "published",
    stega: false,
  });
  return data;
};

export const fetchSanityProductCategories = async ({
  lang,
}: {
  lang?: SupportedLocale;
} = {}): Promise<PRODUCT_CATEGORIES_QUERYResult> => {
  const { lang: queryLang, fallbackLang } = resolveLocaleParams(lang);
  const { data } = await sanityFetch({
    query: PRODUCT_CATEGORIES_QUERY,
    params: { lang: queryLang, fallbackLang },
    perspective: "published",
    stega: false,
  });
  return data;
};

export const fetchSanityProductCategoriesStaticParams = async ({
  lang,
}: {
  lang?: SupportedLocale;
} = {}): Promise<PRODUCT_CATEGORIES_QUERYResult> => {
  const { lang: queryLang, fallbackLang } = resolveLocaleParams(lang);
  const { data } = await sanityFetch({
    query: PRODUCT_CATEGORIES_QUERY,
    params: { lang: queryLang, fallbackLang },
    perspective: "published",
    stega: false,
  });
  return data;
};

export const fetchSanityProductCategoryBySlug = async ({
  slug,
  lang,
}: {
  slug: string;
  lang?: SupportedLocale;
}): Promise<ProductCategoryWithMeta> => {
  const { lang: queryLang, fallbackLang } = resolveLocaleParams(lang);
  const { data } = await sanityFetch({
    query: PRODUCT_CATEGORY_BY_SLUG_QUERY,
    params: { slug, lang: queryLang, fallbackLang },
    perspective: "published",
    stega: false,
  });
  return data as ProductCategoryWithMeta;
};

export const fetchSanityProductsCount = async ({
  lang,
}: {
  lang?: SupportedLocale;
} = {}): Promise<number> => {
  const { lang: queryLang, fallbackLang } = resolveLocaleParams(lang);
  const { data } = await sanityFetch({
    query: PRODUCTS_COUNT_QUERY,
    params: { lang: queryLang, fallbackLang },
    perspective: "published",
    stega: false,
  });
  return data;
};

export const fetchSanityProductsCountByCategory = async ({
  slug,
  lang,
}: {
  slug: string;
  lang?: SupportedLocale;
}): Promise<number> => {
  const { lang: queryLang, fallbackLang } = resolveLocaleParams(lang);
  const { data } = await sanityFetch({
    query: PRODUCTS_COUNT_BY_CATEGORY_QUERY,
    params: { slug, lang: queryLang, fallbackLang },
    perspective: "published",
    stega: false,
  });
  return data;
};

export const fetchSanityPostsCount = async ({
  lang,
}: {
  lang?: SupportedLocale;
} = {}): Promise<number> => {
  const { lang: queryLang, fallbackLang } = resolveLocaleParams(lang);
  const { data } = await sanityFetch({
    query: POSTS_COUNT_QUERY,
    params: { lang: queryLang, fallbackLang },
    perspective: "published",
    stega: false,
  });
  return data;
};

export const fetchSanityBlogCategories = async ({
  lang,
}: {
  lang?: SupportedLocale;
} = {}) => {
  const { lang: queryLang, fallbackLang } = resolveLocaleParams(lang);
  const { data } = await sanityFetch({
    query: BLOG_CATEGORIES_QUERY,
    params: { lang: queryLang, fallbackLang },
    perspective: "published",
    stega: false,
  });
  return data as Array<{
    _id: string;
    title: string;
    slug: { current: string };
    language?: string;
  }>;
};

export const fetchSanityBlogCategoriesStaticParams = async ({
  lang,
}: {
  lang?: SupportedLocale;
} = {}) => {
  const { lang: queryLang, fallbackLang } = resolveLocaleParams(lang);
  const { data } = await sanityFetch({
    query: BLOG_CATEGORIES_QUERY,
    params: { lang: queryLang, fallbackLang },
    perspective: "published",
    stega: false,
  });
  return data as Array<{
    _id: string;
    title: string;
    slug: { current: string };
    language?: string;
  }>;
};

export const fetchSanityBlogCategoryBySlug = async ({
  slug,
  lang,
}: {
  slug: string;
  lang?: SupportedLocale;
}) => {
  const { lang: queryLang, fallbackLang } = resolveLocaleParams(lang);
  const { data } = await sanityFetch({
    query: BLOG_CATEGORY_BY_SLUG_QUERY,
    params: { slug, lang: queryLang, fallbackLang },
    perspective: "published",
    stega: false,
  });
  return data as {
    _id: string;
    title?: string | null;
    slug?: { current?: string } | null;
    description?: string | null;
    language?: string | null;
  } | null;
};

export const fetchSanityPostsByBlogCategory = async ({
  slug,
  page,
  limit,
  sort = "newest",
  lang,
}: {
  slug: string;
  page?: number;
  limit: number;
  sort?: "newest" | "az" | "za";
  lang?: SupportedLocale;
}) => {
  const offset = page && limit ? (page - 1) * limit : 0;
  const end = offset + limit;
  const query =
    sort === "az"
      ? POSTS_BY_BLOG_CATEGORY_QUERY_AZ
      : sort === "za"
      ? POSTS_BY_BLOG_CATEGORY_QUERY_ZA
      : POSTS_BY_BLOG_CATEGORY_QUERY_NEWEST;
  const { lang: queryLang, fallbackLang } = resolveLocaleParams(lang);
  const { data } = await sanityFetch({
    query,
    params: { slug, offset, end, lang: queryLang, fallbackLang },
    perspective: "published",
    stega: false,
  });
  return data as POSTS_QUERYResult;
};

export const fetchSanityPostsCountByBlogCategory = async ({
  slug,
  lang,
}: {
  slug: string;
  lang?: SupportedLocale;
}) => {
  const { lang: queryLang, fallbackLang } = resolveLocaleParams(lang);
  const { data } = await sanityFetch({
    query: POSTS_COUNT_BY_BLOG_CATEGORY_QUERY,
    params: { slug, lang: queryLang, fallbackLang },
    perspective: "published",
    stega: false,
  });
  return data as number;
};

export const fetchSanityPostBySlug = async ({
  slug,
  lang,
}: {
  slug: string;
  lang?: SupportedLocale;
}): Promise<POST_QUERYResult> => {
  const { lang: queryLang, fallbackLang } = resolveLocaleParams(lang);
  const { data } = await sanityFetch({
    query: POST_QUERY,
    params: { slug, lang: queryLang, fallbackLang },
    perspective: "published",
    stega: false,
  });

  return data;
};

export const fetchSanityPostsStaticParams = async ({
  lang,
}: {
  lang?: SupportedLocale;
} = {}): Promise<POSTS_SLUGS_QUERYResult> => {
  const { lang: queryLang, fallbackLang } = resolveLocaleParams(lang);
  const { data } = await sanityFetch({
    query: POSTS_SLUGS_QUERY,
    params: { lang: queryLang, fallbackLang },
    perspective: "published",
    stega: false,
  });

  return data;
};

export const fetchSanitySettings = async ({
  lang,
}: {
  lang?: SupportedLocale;
} = {}): Promise<SETTINGS_QUERYResult> => {
  const { lang: queryLang, fallbackLang } = resolveLocaleParams(lang);
  const { data } = await sanityFetch({
    query: SETTINGS_QUERY,
    params: { lang: queryLang, fallbackLang },
    perspective: "published",
    stega: false,
  });

  return data;
};

export const fetchSanityContact = async (): Promise<CONTACT_QUERYResult> => {
  const { data } = await sanityFetch({
    query: CONTACT_QUERY,
  });

  return data;
};

export const getOgImageUrl = ({
  type,
  slug,
}: {
  type: "post" | "page" | "product" | "productCategory";
  slug: string;
}): string => {
  // Clean the slug by removing any path segments before the last slash (e.g. "blog/my-post" becomes "my-post")
  const cleanSlug = slug.split("/").pop() || slug;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${baseUrl}/api/og?type=${type}&slug=${encodeURIComponent(cleanSlug)}`;
};
