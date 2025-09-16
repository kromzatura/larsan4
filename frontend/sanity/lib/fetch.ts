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

export type ProductCategoryWithMeta = ProductCategory & {
  description?: string | null;
  meta?: {
    title?: string | null;
    description?: string | null;
    noindex?: boolean | null;
    image?: any;
  } | null;
};

export const fetchSanityNavigation =
  async (): Promise<NAVIGATION_QUERYResult> => {
    const { data } = await sanityFetch({
      query: NAVIGATION_QUERY,
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
}: {
  slug: string;
}): Promise<PAGE_QUERYResult> => {
  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: { slug },
  });

  return data;
};

export const fetchSanityPagesStaticParams =
  async (): Promise<PAGES_SLUGS_QUERYResult> => {
    const { data } = await sanityFetch({
      query: PAGES_SLUGS_QUERY,
      perspective: "published",
      stega: false,
    });

    return data;
  };

export const fetchSanityPosts = async ({
  page,
  limit,
  sort = "newest",
}: {
  page?: number;
  limit: number;
  sort?: "newest" | "az" | "za";
}): Promise<POSTS_QUERYResult> => {
  const offset = page && limit ? (page - 1) * limit : 0;
  const end = offset + limit;
  const query =
    sort === "az"
      ? POSTS_QUERY_AZ
      : sort === "za"
      ? POSTS_QUERY_ZA
      : POSTS_QUERY;
  const { data } = await sanityFetch({
    query,
    params: { offset, end },
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
}: {
  page?: number;
  limit: number;
}): Promise<PRODUCTS_LIST_QUERYResult> => {
  const offset = page && limit ? (page - 1) * limit : 0;
  const end = offset + limit;
  const { data } = await sanityFetch({
    query: PRODUCTS_LIST_QUERY,
    params: { offset, end },
  });
  return data;
};

export const fetchSanityProductsByCategory = async ({
  slug,
  page,
  limit,
  sort = "newest",
}: {
  slug: string;
  page?: number;
  limit: number;
  sort?: "newest" | "az" | "za";
}): Promise<PRODUCTS_LIST_QUERYResult> => {
  const offset = page && limit ? (page - 1) * limit : 0;
  const end = offset + limit;
  const query =
    sort === "az"
      ? PRODUCTS_BY_CATEGORY_QUERY_AZ
      : sort === "za"
      ? PRODUCTS_BY_CATEGORY_QUERY_ZA
      : PRODUCTS_BY_CATEGORY_QUERY_NEWEST;
  const { data } = await sanityFetch({ query, params: { slug, offset, end } });
  return data;
};

export const fetchSanityProductBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<PRODUCT_QUERYResult> => {
  const { data } = await sanityFetch({
    query: PRODUCT_QUERY,
    params: { slug },
  });
  return data;
};

export const fetchSanityProductSlugs =
  async (): Promise<PRODUCTS_SLUGS_QUERYResult> => {
    const { data } = await sanityFetch({
      query: PRODUCTS_SLUGS_QUERY,
      perspective: "published",
      stega: false,
    });
    return data;
  };

export const fetchSanityProductCategories =
  async (): Promise<PRODUCT_CATEGORIES_QUERYResult> => {
    const { data } = await sanityFetch({
      query: PRODUCT_CATEGORIES_QUERY,
    });
    return data;
  };

export const fetchSanityProductCategoriesStaticParams =
  async (): Promise<PRODUCT_CATEGORIES_QUERYResult> => {
    const { data } = await sanityFetch({
      query: PRODUCT_CATEGORIES_QUERY,
      perspective: "published",
      stega: false,
    });
    return data;
  };

export const fetchSanityProductCategoryBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<ProductCategoryWithMeta> => {
  const { data } = await sanityFetch({
    query: PRODUCT_CATEGORY_BY_SLUG_QUERY,
    params: { slug },
  });
  return data as ProductCategoryWithMeta;
};

export const fetchSanityProductsCount = async (): Promise<number> => {
  const { data } = await sanityFetch({
    query: PRODUCTS_COUNT_QUERY,
  });
  return data;
};

export const fetchSanityProductsCountByCategory = async ({
  slug,
}: {
  slug: string;
}): Promise<number> => {
  const { data } = await sanityFetch({
    query: PRODUCTS_COUNT_BY_CATEGORY_QUERY,
    params: { slug },
  });
  return data;
};

export const fetchSanityPostsCount = async (): Promise<number> => {
  const { data } = await sanityFetch({
    query: POSTS_COUNT_QUERY,
  });
  return data;
};

export const fetchSanityBlogCategories = async () => {
  const { data } = await sanityFetch({ query: BLOG_CATEGORIES_QUERY });
  return data as Array<{
    _id: string;
    title: string;
    slug: { current: string };
  }>;
};

export const fetchSanityBlogCategoriesStaticParams = async () => {
  const { data } = await sanityFetch({
    query: BLOG_CATEGORIES_QUERY,
    perspective: "published",
    stega: false,
  });
  return data as Array<{
    _id: string;
    title: string;
    slug: { current: string };
  }>;
};

export const fetchSanityBlogCategoryBySlug = async ({
  slug,
}: {
  slug: string;
}) => {
  const { data } = await sanityFetch({
    query: BLOG_CATEGORY_BY_SLUG_QUERY,
    params: { slug },
  });
  return data as {
    _id: string;
    title?: string | null;
    slug?: { current?: string } | null;
    description?: string | null;
  } | null;
};

export const fetchSanityPostsByBlogCategory = async ({
  slug,
  page,
  limit,
  sort = "newest",
}: {
  slug: string;
  page?: number;
  limit: number;
  sort?: "newest" | "az" | "za";
}) => {
  const offset = page && limit ? (page - 1) * limit : 0;
  const end = offset + limit;
  const query =
    sort === "az"
      ? POSTS_BY_BLOG_CATEGORY_QUERY_AZ
      : sort === "za"
      ? POSTS_BY_BLOG_CATEGORY_QUERY_ZA
      : POSTS_BY_BLOG_CATEGORY_QUERY_NEWEST;
  const { data } = await sanityFetch({
    query,
    params: { slug, offset, end },
  });
  return data as POSTS_QUERYResult;
};

export const fetchSanityPostsCountByBlogCategory = async ({
  slug,
}: {
  slug: string;
}) => {
  const { data } = await sanityFetch({
    query: POSTS_COUNT_BY_BLOG_CATEGORY_QUERY,
    params: { slug },
  });
  return data as number;
};

export const fetchSanityPostBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<POST_QUERYResult> => {
  const { data } = await sanityFetch({
    query: POST_QUERY,
    params: { slug },
  });

  return data;
};

export const fetchSanityPostsStaticParams =
  async (): Promise<POSTS_SLUGS_QUERYResult> => {
    const { data } = await sanityFetch({
      query: POSTS_SLUGS_QUERY,
      perspective: "published",
      stega: false,
    });

    return data;
  };

export const fetchSanitySettings = async (): Promise<SETTINGS_QUERYResult> => {
  const { data } = await sanityFetch({
    query: SETTINGS_QUERY,
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
