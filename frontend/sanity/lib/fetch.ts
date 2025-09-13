import { sanityFetch } from "@/sanity/lib/live";
import { NAVIGATION_QUERY } from "@/sanity/queries/navigation";
import { BANNER_QUERY } from "@/sanity/queries/banner";
import { PAGE_QUERY, PAGES_SLUGS_QUERY } from "@/sanity/queries/page";
import { SETTINGS_QUERY } from "@/sanity/queries/settings";
import { CONTACT_QUERY } from "@/sanity/queries/contact";
import {
  POST_QUERY,
  POSTS_QUERY,
  POSTS_SLUGS_QUERY,
  POSTS_COUNT_QUERY,
} from "@/sanity/queries/post";
import { CHANGELOGS_QUERY } from "@/sanity/queries/changelog";
import { TEAM_QUERY } from "@/sanity/queries/team";
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
} from "@/sanity.types";

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
}: {
  page?: number;
  limit: number;
}): Promise<POSTS_QUERYResult> => {
  const offset = page && limit ? (page - 1) * limit : 0;
  const end = offset + limit;
  const { data } = await sanityFetch({
    query: POSTS_QUERY,
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

export const fetchSanityPostsCount = async (): Promise<number> => {
  const { data } = await sanityFetch({
    query: POSTS_COUNT_QUERY,
  });
  return data;
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
  type: "post" | "page";
  slug: string;
}): string => {
  // Clean the slug by removing any path segments before the last slash (e.g. "blog/my-post" becomes "my-post")
  const cleanSlug = slug.split("/").pop() || slug;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${baseUrl}/api/og?type=${type}&slug=${encodeURIComponent(cleanSlug)}`;
};
