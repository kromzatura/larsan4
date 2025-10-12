import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PortableTextRenderer from "@/components/portable-text-renderer";
import {
  fetchSanityPostBySlug,
  fetchSanityPostsStaticParams,
} from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { urlFor } from "@/sanity/lib/image";
import PostDate from "@/components/post-date";
import { Separator } from "@/components/ui/separator";
import { Clock, Facebook, Twitter, Linkedin } from "lucide-react";
import { POST_QUERYResult } from "@/sanity.types";
import { normalizeLocale, buildLocalizedPath } from "@/lib/i18n/routing";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";
import type { AsyncPageProps } from "@/lib/types/next";
import { getDictionary } from "@/lib/i18n/dictionaries";

type BreadcrumbLink = {
  label: string;
  href: string;
};

type Heading = {
  text: string;
  level: number;
  id: string;
};

type BlockContent = NonNullable<POST_QUERYResult>["body"];
type Block = NonNullable<BlockContent>[number];
type TextBlock = Extract<
  Block,
  {
    _type: "block";
    _key: string;
    style?: "normal" | "blockquote" | "h1" | "h2" | "h3" | "h4";
    children?: Array<{
      _type: "span";
      _key: string;
      text?: string;
      marks?: string[];
    }>;
  }
>;

function extractHeadings(blocks: BlockContent): Heading[] {
  if (!blocks) return [];

  return blocks
    .filter((block): block is TextBlock => {
      return (
        block._type === "block" &&
        typeof block.style === "string" &&
        block.style.startsWith("h") &&
        Array.isArray((block as TextBlock).children)
      );
    })
    .map((block) => {
      const text = (block.children || [])
        .map((child) => child.text || "")
        .filter(Boolean)
        .join(" ");
      return {
        text: text || "",
        level: parseInt(block.style?.charAt(1) || "1"),
        id: text?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "",
      };
    });
}

export async function generateStaticParams() {
  const posts = await fetchSanityPostsStaticParams({ lang: FALLBACK_LOCALE });

  return posts
    .filter((post) => Boolean(post.slug?.current))
    .map((post) => ({ slug: post.slug?.current }));
}

export async function generateMetadata(
  props: AsyncPageProps<{ slug: string; lang?: string }>
) {
  const params = (await props.params)!;
  const locale = normalizeLocale(params.lang);
  const post = await fetchSanityPostBySlug({ slug: params.slug, lang: locale });

  if (!post) {
    notFound();
  }

  return generatePageMetadata({
    page: post,
    slug: `blog/${params.slug}`,
    type: "post",
  });
}

export default async function PostPage(
  props: AsyncPageProps<{ slug: string; lang?: string }>
) {
  const params = (await props.params)!;
  const locale = normalizeLocale(params.lang);
  const dictionary = await getDictionary(locale);
  const post = await fetchSanityPostBySlug({ slug: params.slug, lang: locale });

  if (!post) {
    notFound();
  }

  const blogPath = buildLocalizedPath(locale, "/blog");
  const links: BreadcrumbLink[] = post
    ? [
        {
          label: dictionary.postPage.breadcrumbs.blog,
          href: blogPath,
        },
        {
          label: post.title as string,
          href: "#",
        },
      ]
    : [];

  const headings = extractHeadings(post.body);
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const postPath = buildLocalizedPath(
    locale,
    `/blog/${post.slug?.current ?? ""}`
  );
  const shareUrl = `${SITE_URL}${postPath}`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title || undefined,
    author: post.author?.name
      ? { "@type": "Person", name: post.author.name }
      : undefined,
    image: post.image?.asset?.url ? [post.image.asset.url] : undefined,
    datePublished: post.publishedAt || post._createdAt || undefined,
    dateModified: post._updatedAt || undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${postPath}`,
    },
  } as const;
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dictionary.postPage.breadcrumbs.home,
        item: `${SITE_URL}${buildLocalizedPath(locale, "/")}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dictionary.postPage.breadcrumbs.blog,
        item: `${SITE_URL}${blogPath}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title || dictionary.postPage.breadcrumbs.post,
        item: `${SITE_URL}${postPath}`,
      },
    ],
  } as const;

  return (
    <section className="container py-16 xl:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <article>
        <Breadcrumbs links={links} locale={locale} />

        {post.title && (
          <h1 className="mt-7 mb-6 max-w-3xl text-3xl font-semibold md:text-5xl">
            {post.title}
          </h1>
        )}

        <div className="flex items-center gap-3 text-sm">
          {post.author?.image && post.author.image.asset?._id && (
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={urlFor(post.author.image).url()} />
            </Avatar>
          )}
          <span className="flex items-center gap-1">
            {post.author?.name && (
              <span className="font-medium">{post.author?.name}</span>
            )}
            <span className="ml-1 flex items-center gap-1 text-muted-foreground">
                <span>{dictionary.postPage.authorLine.on}</span> <PostDate date={post._createdAt} />
            </span>
          </span>

          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
              {post.estimatedReadingTime} {dictionary.postPage.readingTime.unit}
          </span>
        </div>
        <Separator className="mt-8 mb-16" />
        {post.body && (
          <div className="grid grid-cols-12 gap-6 lg:grid">
            <div className="col-span-12 lg:col-span-8">
              <PortableTextRenderer value={post.body} locale={locale} />
            </div>
            <div className="sticky top-18 col-span-3 col-start-10 hidden h-fit lg:block">
                <span className="text-lg font-medium">{dictionary.postPage.toc.title}</span>
              <nav className="mt-4 text-sm">
                <ul className="space-y-2">
                  {headings.map((heading) => (
                    <li
                      key={heading.id}
                      style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                    >
                      <a
                        href={`#${heading.id}`}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <Separator className="my-6" />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">{dictionary.postPage.share.title}</p>
                <ul className="flex gap-2">
                  <li>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener"
                      title={dictionary.postPage.share.facebook}
                      className="inline-flex rounded-full border p-2 transition-colors hover:bg-muted"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                  </li>
                  <li>
                    <a
                      href={`https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener"
                      title={dictionary.postPage.share.twitter}
                      className="inline-flex rounded-full border p-2 transition-colors hover:bg-muted"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  </li>
                  <li>
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener"
                      title={dictionary.postPage.share.linkedin}
                      className="inline-flex rounded-full border p-2 transition-colors hover:bg-muted"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </article>
    </section>
  );
}
