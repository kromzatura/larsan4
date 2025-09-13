import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ChevronRight } from "lucide-react";
import PostDate from "@/components/post-date";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type Blog16 = Extract<Block, { _type: "blog-16" }>;

export default function Blog16({ padding, posts }: Blog16) {
  return (
    <SectionContainer padding={padding}>
      {posts && posts?.length > 0 && (
        <div>
          <Separator />
          {posts.map((post) => (
            <Fragment key={post._id}>
              <div className="container grid grid-cols-1 gap-6 py-8 lg:grid-cols-4">
                <div className="hidden items-center gap-3 self-start lg:flex">
                  <Avatar className="size-12">
                    <AvatarImage src={post.author?.image?.asset?.url || ""} />
                    <AvatarFallback>
                      {post.author?.name?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">{post.author?.name}</span>
                    {post.author?.title && (
                      <span className="text-sm text-muted-foreground">
                        {post.author?.title}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-span-2 max-w-xl">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <PostDate date={post._createdAt} />
                    <span className="inline lg:hidden">
                      {" "}
                      - {post.author?.name}
                    </span>
                  </span>
                  <h3 className="text-2xl font-bold hover:underline lg:text-3xl">
                    {post.title && (
                      <Link href={`/blog/${post.slug?.current}`}>
                        {post.title}
                      </Link>
                    )}
                  </h3>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {post.categories &&
                      post.categories.length > 0 &&
                      post.categories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/blog/${post.slug?.current}`}
                          className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
                        >
                          {category.title}
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      ))}
                  </div>
                </div>
                <Link
                  href={`/blog/${post.slug?.current}`}
                  className={cn(
                    "ml-auto hidden lg:flex",
                    buttonVariants({ variant: "outline", size: "icon" })
                  )}
                >
                  <ArrowRight className="h-4 w-4" />
                  <span className="sr-only">Read more</span>
                </Link>
              </div>
              <Separator />
            </Fragment>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
