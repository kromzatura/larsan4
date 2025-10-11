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
  const post = await fetchSanityPostBySlug({ slug: params.slug, lang: locale });

  if (!post) {
    notFound();
  }

  const blogPath = buildLocalizedPath(locale, "/blog");
  const links: BreadcrumbLink[] = post
    ? [
        {
          label: "Blog",
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
        name: "Home",
        item: `${SITE_URL}${buildLocalizedPath(locale, "/")}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}${blogPath}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title || "Post",
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
              <span>on</span> <PostDate date={post._createdAt} />
            </span>
          </span>

          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {post.estimatedReadingTime} min. read
          </span>
        </div>
        <Separator className="mt-8 mb-16" />
        {post.body && (
          <div className="grid grid-cols-12 gap-6 lg:grid">
            <div className="col-span-12 lg:col-span-8">
              <PortableTextRenderer value={post.body} />
            </div>
            <div className="sticky top-18 col-span-3 col-start-10 hidden h-fit lg:block">
              <span className="text-lg font-medium">On this page</span>
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
                <p className="text-sm font-medium">Share this article</p>
                <ul className="flex gap-2">
                  <li>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug?.current}`}
                      target="_blank"
                      rel="noopener"
                      title="Share on Facebook"
                      className="inline-flex rounded-full border p-2 transition-colors hover:bg-muted"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                  </li>
                  <li>
                    <a
                      href={`https://x.com/intent/tweet?url=${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug?.current}`}
                      target="_blank"
                      rel="noopener"
                      title="Share on X (Twitter)"
                      className="inline-flex rounded-full border p-2 transition-colors hover:bg-muted"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  </li>
                  <li>
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug?.current}`}
                      target="_blank"
                      rel="noopener"
                      title="Share on LinkedIn"
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
