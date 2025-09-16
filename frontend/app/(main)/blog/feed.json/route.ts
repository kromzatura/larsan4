import { NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/lib/live";
import { FEED_POSTS_QUERY_NEWEST } from "@/sanity/queries/feed";
import { fetchSanitySettings } from "@/sanity/lib/fetch";
import { ptBlocksToHtml } from "@/sanity/lib/ptToHtml";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function GET() {
  const [{ data: posts }, settings] = await Promise.all([
    sanityFetch({ query: FEED_POSTS_QUERY_NEWEST, params: { limit: 50 } }),
    fetchSanitySettings(),
  ]);
  const siteName = (settings as any)?.siteName || "Blog";
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: `${siteName} — Blog`,
    home_page_url: `${SITE_URL}/blog`,
    feed_url: `${SITE_URL}/blog/feed.json`,
    items: (posts || []).map((p: any) => {
      const url = `${SITE_URL}/blog/${p.slug?.current ?? ""}`;
      const content_html = ptBlocksToHtml(p.body) || p.excerpt || "";
      return {
        id: url,
        url,
        title: p.title || "Untitled",
        date_published: p._createdAt || undefined,
        content_html,
        tags: Array.isArray(p.categories)
          ? p.categories.map((c: any) => c?.title).filter(Boolean)
          : undefined,
      };
    }),
  };

  return NextResponse.json(feed, {
    headers: {
      "Cache-Control": "s-maxage=300, stale-while-revalidate=60",
    },
  });
}
