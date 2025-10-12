import { NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/lib/live";
import { FEED_POSTS_QUERY_NEWEST } from "@/sanity/queries/feed";
import { fetchSanitySettings } from "@/sanity/lib/fetch";
import { ptBlocksToHtml, getLanguageFromSettings } from "@/sanity/lib/ptToHtml";
import type { FeedPost } from "@/lib/types/content";
import { buildLocalizedPath, normalizeLocale } from "@/lib/i18n/routing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function GET(_req: Request, context: { params: Promise<{ lang?: string }> }) {
	const params = await context.params;
	const locale = normalizeLocale(params?.lang);
	const [{ data: posts }, settings] = await Promise.all([
		sanityFetch({
			query: FEED_POSTS_QUERY_NEWEST,
			params: { limit: 50 },
			perspective: "published",
			stega: false,
		}),
		fetchSanitySettings(),
	]);
	const siteName = settings?.siteName || "Blog";
	// Narrow settings shape for language helper without widening generated type
	const language = getLanguageFromSettings(settings as {
		language?: string;
		siteLanguage?: string;
		locale?: string;
	});
	const feed = {
		version: "https://jsonfeed.org/version/1.1",
		title: `${siteName} — Blog`,
		home_page_url: `${SITE_URL}${buildLocalizedPath(locale, "/blog")}`,
		feed_url: `${SITE_URL}${buildLocalizedPath(locale, "/blog/feed.json")}`,
		language,
		items: (Array.isArray(posts) ? (posts as FeedPost[]) : []).map((p) => {
			const url = `${SITE_URL}${buildLocalizedPath(locale, `/blog/${p.slug?.current ?? ""}`)}`;
			const content_html =
				ptBlocksToHtml(Array.isArray(p.body) ? (p.body as unknown[]) : null) ||
				p.excerpt ||
				"";
			return {
				id: url,
				url,
				title: p.title || "Untitled",
				date_published: p.publishedAt || p._createdAt || undefined,
				content_html,
				authors: p.author?.name ? [{ name: p.author.name }] : undefined,
				image: p.image?.asset?.url || undefined,
				tags: Array.isArray(p.categories)
					? p.categories.flatMap((c) => (c?.title ? [c.title] : []))
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

