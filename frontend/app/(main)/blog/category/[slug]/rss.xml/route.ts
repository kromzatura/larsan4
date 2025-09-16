import { NextResponse } from "next/server";
import {
  fetchSanityBlogCategoryBySlug,
  fetchSanityPostsByBlogCategory,
} from "@/sanity/lib/fetch";

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
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const cat = await fetchSanityBlogCategoryBySlug({ slug });
  if (!cat) return new NextResponse("Not Found", { status: 404 });

  const posts = await fetchSanityPostsByBlogCategory({ slug, limit: 50, sort: "newest" });
  const selfUrl = `${SITE_URL}/blog/category/${slug}/rss.xml`;
  const lastBuildDate = new Date().toUTCString();

  const items = (posts || []).map((p) => {
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

    return `
      <item>
        <title>${title}</title>
        <link>${url}</link>
        <guid>${url}</guid>
        <pubDate>${pubDate}</pubDate>
        <description><![CDATA[${p.excerpt ?? ""}]]></description>
        ${categories}
      </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(cat.title ?? "Blog Category")}</title>
      <link>${SITE_URL}/blog/category/${slug}</link>
      <description>${escape(cat.description ?? "")}</description>
      <atom:link href="${selfUrl}" rel="self" type="application/rss+xml" />
      <lastBuildDate>${lastBuildDate}</lastBuildDate>
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
