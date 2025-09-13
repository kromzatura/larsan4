import { Fragment } from "react";
import { cn } from "@/lib/utils";
import SectionContainer from "@/components/ui/section-container";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PostDate from "@/components/post-date";
import { PAGE_QUERYResult } from "@/sanity.types";
import { fetchSanityChangelogs } from "@/sanity/lib/fetch";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { Separator } from "@/components/ui/separator";
import { ColorName, getColor } from "@/lib/color";

type Changelogs3Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "changelog-3" }
>;

export default async function Changelog3({ padding }: Changelogs3Props) {
  const changelogs = await fetchSanityChangelogs();

  return (
    <SectionContainer padding={padding}>
      {changelogs && changelogs?.length > 0 && (
        <div className="space-y-10">
          {changelogs.map((changelog, index) => (
            <Fragment key={changelog._id}>
              <article className="relative mx-auto flex max-w-3xl flex-col gap-6 md:flex-row md:gap-10">
                {changelog.date && (
                  <time className="h-fit text-sm font-semibold text-muted-foreground md:sticky md:top-16 lg:top-18 shrink-0">
                    <PostDate date={changelog.date} />
                  </time>
                )}
                <div>
                  {changelog.categories && changelog.categories.length > 0 && (
                    <div className="flex flex-wrap gap-4">
                      {changelog.categories.map((category) => (
                        <div
                          key={category._id}
                          className="flex items-center gap-1.5"
                        >
                          <span
                            className={cn(
                              "h-3 w-3 rounded-full",
                              getColor({
                                color: category.color as ColorName,
                                type: "bg",
                              })
                            )}
                          />
                          <p className="text-sm font-semibold text-primary/80">
                            {category.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-6">
                    <h2 className="text-2xl font-semibold">
                      {changelog.title}
                    </h2>
                    {changelog.body && (
                      <PortableTextRenderer value={changelog.body} />
                    )}
                    {changelog.image && changelog.image.asset?._id && (
                      <Image
                        src={urlFor(changelog.image).url()}
                        alt={changelog.image.alt || ""}
                        placeholder={
                          changelog.image?.asset?.metadata?.lqip
                            ? "blur"
                            : undefined
                        }
                        blurDataURL={
                          changelog.image?.asset?.metadata?.lqip || ""
                        }
                        className="my-4 aspect-video rounded-lg border border-border object-cover"
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        width={
                          changelog.image.asset?.metadata?.dimensions?.width ||
                          700
                        }
                        height={
                          changelog.image.asset?.metadata?.dimensions?.height ||
                          400
                        }
                        quality={100}
                      />
                    )}
                  </div>
                </div>
              </article>
              {index < changelogs.length - 1 && <Separator />}
            </Fragment>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
