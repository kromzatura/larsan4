import { NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/lib/live";
import { FEED_POSTS_BY_CATEGORY_QUERY_NEWEST } from "@/sanity/queries/feed";
import {
  fetchSanityBlogCategoryBySlug,
  fetchSanitySettings,
} from "@/sanity/lib/fetch";
import { ptBlocksToHtml, getLanguageFromSettings } from "@/sanity/lib/ptToHtml";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const [cat, { data: posts }, settings] = await Promise.all([
    fetchSanityBlogCategoryBySlug({ slug }),
    sanityFetch({
      query: FEED_POSTS_BY_CATEGORY_QUERY_NEWEST,
      params: { slug, limit: 50 },
    }),
    fetchSanitySettings(),
  ]);
  if (!cat) return new NextResponse("Not Found", { status: 404 });

  const siteName = (settings as any)?.siteName || "Blog";
  const language = getLanguageFromSettings(settings);
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: `${siteName} — ${cat.title || "Blog Category"}`,
    home_page_url: `${SITE_URL}/blog/category/${slug}`,
    feed_url: `${SITE_URL}/blog/category/${slug}/feed.json`,
    language,
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
