import { NextResponse } from "next/server";
import { fetchSanitySettings } from "@/sanity/lib/fetch";
import { sanityFetch } from "@/sanity/lib/live";
import { FEED_POSTS_BY_CATEGORY_QUERY_NEWEST } from "@/sanity/queries/feed";
import { ptBlocksToHtml, getLanguageFromSettings } from "@/sanity/lib/ptToHtml";
import type { FeedPost } from "@/lib/types/content";
import { buildLocalizedPath, normalizeLocale } from "@/lib/i18n/routing";

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
  context: { params: Promise<{ slug: string; lang?: string }> }
) {
  const { slug, lang } = await context.params;
  const locale = normalizeLocale(lang);
  const [{ data: posts }, settings] = await Promise.all([
    sanityFetch({
      query: FEED_POSTS_BY_CATEGORY_QUERY_NEWEST,
      params: { limit: 50, slug },
      perspective: "published",
      stega: false,
    }),
    fetchSanitySettings(),
  ]);
  const selfUrl = `${SITE_URL}${buildLocalizedPath(
    locale,
    `/blog/category/${slug}/rss.xml`
  )}`;
  const lastBuildDate = new Date().toUTCString();
  const siteName = settings?.siteName || "Blog";
  const siteDesc = settings?.description || "Latest posts";
  const language = getLanguageFromSettings(
    settings as {
      language?: string;
      siteLanguage?: string;
      locale?: string;
    }
  );

  const items = (Array.isArray(posts) ? (posts as FeedPost[]) : []).map((p) => {
    const url = `${SITE_URL}${buildLocalizedPath(
      locale,
      `/blog/${p.slug?.current ?? ""}`
    )}`;
    const title = escape(p.title ?? "Untitled");
    const rawDate = p.publishedAt || p._createdAt;
    const pubDate = rawDate ? new Date(rawDate).toUTCString() : "";
    const categories = Array.isArray(p.categories)
      ? p.categories
          .flatMap((c) => (c?.title ? [c.title] : []))
          .map((t) => `<category>${escape(t)}</category>`)
          .join("")
      : "";
    const html = ptBlocksToHtml(
      Array.isArray(p.body) ? (p.body as unknown[]) : null
    );
    const creator = p.author?.name
      ? `<dc:creator>${escape(p.author.name)}</dc:creator>`
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
        ${categories}
      </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
    <channel>
  <title>${escape(siteName)} — Blog Category: ${escape(slug)}</title>
  <link>${SITE_URL}${buildLocalizedPath(
    locale,
    `/blog/category/${slug}`
  )}</link>
      <description>${escape(siteDesc)}</description>
      <atom:link href="${selfUrl}" rel="self" type="application/rss+xml" />
      <lastBuildDate>${lastBuildDate}</lastBuildDate>
  <language>${language}</language>
      <generator>Next.js + Sanity</generator>
      <docs>https://validator.w3.org/feed/docs/rss2.html</docs>
      <ttl>60</ttl>
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
