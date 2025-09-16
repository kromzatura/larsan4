import { NextResponse } from "next/server";
import { fetchSanitySettings } from "@/sanity/lib/fetch";
import { sanityFetch } from "@/sanity/lib/live";
import { FEED_POSTS_QUERY_NEWEST } from "@/sanity/queries/feed";
import { ptBlocksToHtml, getLanguageFromSettings } from "@/sanity/lib/ptToHtml";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function escape(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const [{ data: posts }, settings] = await Promise.all([
    sanityFetch({ query: FEED_POSTS_QUERY_NEWEST, params: { limit: 50 } }),
    fetchSanitySettings(),
  ]);
  const selfUrl = `${SITE_URL}/blog/rss.xml`;
  const lastBuildDate = new Date().toUTCString();
  const siteName = (settings as any)?.siteName || "Blog";
  const siteDesc = (settings as any)?.description || "Latest posts";
  const language = getLanguageFromSettings(settings);
  const logo = (settings as any)?.logo;
  const logoUrl: string | null = logo?.asset?.url || null;
  const dim = logo?.asset?.metadata?.dimensions;
  const rawW = typeof dim?.width === "number" ? dim.width : undefined;
  const rawH = typeof dim?.height === "number" ? dim.height : undefined;
  const maxW = 144; // RSS 2.0 recommends max width 144
  const width = rawW ? Math.min(rawW, maxW) : undefined;
  const height =
    rawW && rawH && width ? Math.round((rawH / rawW) * width) : rawH;

  type FeedPost = {
    _createdAt?: string;
    title?: string | null;
    slug?: { current?: string } | null;
    excerpt?: string | null;
    body?: any[] | null;
    categories?: Array<{ title?: string | null }> | null;
  };
  const items = ((posts as FeedPost[]) || []).map((p) => {
    const url = `${SITE_URL}/blog/${p.slug?.current ?? ""}`;
    const title = escape(p.title ?? "Untitled");
    const description = escape(p.excerpt ?? "");
    const pubDate = p._createdAt ? new Date(p._createdAt).toUTCString() : "";
    const categories = Array.isArray(p.categories)
      ? p.categories
          .map((c: any) => c?.title)
          .filter(Boolean)
          .map((t: string) => `<category>${escape(t)}</category>`)
          .join("")
      : "";
    const html = ptBlocksToHtml((p as any).body);

    return `
      <item>
        <title>${title}</title>
        <link>${url}</link>
        <guid isPermaLink="true">${url}</guid>
        <pubDate>${pubDate}</pubDate>
        <description><![CDATA[${p.excerpt ?? ""}]]></description>
        <content:encoded><![CDATA[${
          html || p.excerpt || ""
        }]]></content:encoded>
        ${categories}
      </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
    <channel>
      <title>${escape(siteName)} — Blog</title>
      <link>${SITE_URL}/blog</link>
      <description>${escape(siteDesc)}</description>
      <atom:link href="${selfUrl}" rel="self" type="application/rss+xml" />
      <lastBuildDate>${lastBuildDate}</lastBuildDate>
  <language>${language}</language>
      <generator>Next.js + Sanity</generator>
      <docs>https://validator.w3.org/feed/docs/rss2.html</docs>
      <ttl>60</ttl>
      ${
        logoUrl
          ? `<image><url>${logoUrl}</url><title>${escape(
              siteName
            )}</title><link>${SITE_URL}</link>${
              width ? `<width>${width}</width>` : ""
            }${height ? `<height>${height}</height>` : ""}</image>`
          : ""
      }
      ${items.join("")}
    </channel>
  </rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=300, stale-while-revalidate=60",
    },
  });
}
