"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import Pagination from "@/components/pagination";
import PostDate from "@/components/post-date";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type PostsListItem = {
  _id: string;
  slug: string;
  title: string | null;
  createdAt?: string | null;
  excerpt?: string | null;
  author?: {
    name?: string | null;
    title?: string | null;
    imageUrl?: string | null;
  } | null;
  categories?: Array<{
    _id?: string | null;
    title?: string | null;
    slug?: { current?: string } | null;
  }> | null;
};

export type PostsListProps = {
  items: PostsListItem[];
  page: number;
  pageCount: number;
  baseUrl: string;
  baseSearchParams?: string;
  activeCategorySlug?: string;
  className?: string;
};

export default function PostsList({
  items,
  page,
  pageCount,
  baseUrl,
  baseSearchParams,
  activeCategorySlug,
  className,
}: PostsListProps) {
  const createPageUrl = (pageNum: number) => {
    const qp = new URLSearchParams(baseSearchParams || "");
    if (pageNum > 1) qp.set("page", String(pageNum));
    else qp.delete("page");
    const qs = qp.toString();
    return `${baseUrl}${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className={cn("w-full", className)}>
      {items.map((post) => (
        <div
          key={post._id}
          className="container grid grid-cols-1 gap-6 py-8 lg:grid-cols-4"
        >
          <div className="hidden items-center gap-3 self-start lg:flex">
            <Avatar className="size-12">
              <AvatarImage src={post.author?.imageUrl || ""} />
              <AvatarFallback>
                {(post.author?.name || "").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              {post.author?.name && (
                <span className="font-semibold">{post.author.name}</span>
              )}
              {post.author?.title && (
                <span className="text-sm text-muted-foreground">
                  {post.author.title}
                </span>
              )}
            </div>
          </div>
          <div className="col-span-2 max-w-xl">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              {post.createdAt && <PostDate date={post.createdAt} />}
              {post.author?.name && (
                <span className="inline lg:hidden"> - {post.author.name}</span>
              )}
            </span>
            <h3 className="text-2xl font-bold hover:underline lg:text-3xl">
              {post.title && (
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              )}
            </h3>
            {post.categories && post.categories.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {post.categories.map((category) => {
                  const href = category.slug?.current
                    ? `/blog/category/${category.slug.current}`
                    : undefined;
                  const key = category._id || `${post._id}-${category.title}`;
                  const isActive =
                    Boolean(activeCategorySlug) &&
                    category.slug?.current === activeCategorySlug;
                  const chipBase =
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";
                  return href ? (
                    <Link
                      key={key}
                      href={href}
                      prefetch
                      className={cn(
                        chipBase,
                        isActive
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {category.title}
                    </Link>
                  ) : (
                    <span
                      key={key}
                      className={cn(chipBase, "text-muted-foreground")}
                    >
                      {category.title}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="ml-auto hidden items-center gap-2 text-sm text-muted-foreground hover:text-foreground lg:flex"
          >
            Read more
          </Link>
        </div>
      ))}

      <Pagination
        currentPage={page}
        totalPages={pageCount}
        createPageUrl={createPageUrl}
        className="mt-8"
      />
    </div>
  );
}
