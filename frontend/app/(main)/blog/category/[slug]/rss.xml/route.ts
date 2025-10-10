import { NextResponse } from "next/server";
import {
  fetchSanityBlogCategoryBySlug,
  fetchSanitySettings,
} from "@/sanity/lib/fetch";
import { sanityFetch } from "@/sanity/lib/live";
import { FEED_POSTS_BY_CATEGORY_QUERY_NEWEST } from "@/sanity/queries/feed";
import { ptBlocksToHtml, getLanguageFromSettings } from "@/sanity/lib/ptToHtml";
import type { FeedPost } from "@/lib/types/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function escape(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const [cat, settings] = await Promise.all([
    fetchSanityBlogCategoryBySlug({ slug }),
    fetchSanitySettings(),
  ]);
  if (!cat) return new NextResponse("Not Found", { status: 404 });

  const { data: posts } = await sanityFetch({
    query: FEED_POSTS_BY_CATEGORY_QUERY_NEWEST,
    params: { slug, limit: 50 },
    perspective: "published",
    stega: false,
  });
  const selfUrl = `${SITE_URL}/blog/category/${slug}/rss.xml`;
  const lastBuildDate = new Date().toUTCString();
  const siteName = settings?.siteName || "Blog";
  const language = getLanguageFromSettings(settings as {
    language?: string;
    siteLanguage?: string;
    locale?: string;
  });
  const logo = settings?.logo;
  const logoUrl: string | null = logo?.asset?.url || null;
  const dim = logo?.asset?.metadata?.dimensions;
  const rawW = typeof dim?.width === "number" ? dim.width : undefined;
  const rawH = typeof dim?.height === "number" ? dim.height : undefined;
  const maxW = 144;
  const width = rawW ? Math.min(rawW, maxW) : undefined;
  const height =
    rawW && rawH && width ? Math.round((rawH / rawW) * width) : rawH;

  const items = (Array.isArray(posts) ? (posts as FeedPost[]) : []).map((p) => {
    const url = `${SITE_URL}/blog/${p.slug?.current ?? ""}`;
    const title = escape(p.title ?? "Untitled");
    const rawDate = p.publishedAt || p._createdAt;
    const pubDate = rawDate ? new Date(rawDate).toUTCString() : "";
    const categories = Array.isArray(p.categories)
      ? p.categories
          .flatMap((c) => (c?.title ? [c.title] : []))
          .map((t) => `<category>${escape(t)}</category>`)
          .join("")
      : "";
    const html = ptBlocksToHtml(Array.isArray(p.body) ? (p.body as unknown[]) : null);
    const creator = p.author?.name
      ? `<dc:creator>${escape(p.author.name)}</dc:creator>`
      : "";
    const img = p.image?.asset;
    const imgUrl = img?.url ? escape(img.url) : null;
    const imgType = img?.mimeType || null;
    const w = img?.metadata?.dimensions?.width || null;
    const h = img?.metadata?.dimensions?.height || null;
    const media = imgUrl
      ? `<media:content url="${imgUrl}"${imgType ? ` type="${imgType}"` : ""}${
          w ? ` width="${w}"` : ""
        }${h ? ` height="${h}"` : ""} />`
      : "";

    return `
      <item>
        <title>${title}</title>
        <link>${url}</link>
        <guid isPermaLink="true">${url}</guid>
        <pubDate>${pubDate}</pubDate>
        ${creator}
        <description><![CDATA[${p.excerpt ?? ""}]]></description>
        <content:encoded><![CDATA[${
          html || p.excerpt || ""
        }]]></content:encoded>
        ${media}
        ${categories}
      </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
    <channel>
      <title>${escape(siteName)} — ${escape(cat.title ?? "Blog Category")}</title>
      <link>${SITE_URL}/blog/category/${slug}</link>
      <description>${escape(cat.description ?? "")}</description>
      <atom:link href="${selfUrl}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <language>${language}</language>
      <generator>Next.js + Sanity</generator>
      <docs>https://validator.w3.org/feed/docs/rss2.html</docs>
      <ttl>60</ttl>
      <category>${escape(cat.title ?? "")}</category>
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
