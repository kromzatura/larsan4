import SectionContainer from "@/components/ui/section-container";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PostDate from "@/components/post-date";
import { PAGE_QUERYResult } from "@/sanity.types";
import { fetchSanityChangelogs } from "@/sanity/lib/fetch";
import PortableTextRenderer from "@/components/portable-text-renderer";

type Changelogs1Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "changelog-1" }
>;

export default async function Changelog1({ padding }: Changelogs1Props) {
  const changelogs = await fetchSanityChangelogs();

  return (
    <SectionContainer padding={padding}>
      {changelogs && changelogs?.length > 0 && (
        <div className="mx-auto max-w-3xl space-y-16 md:space-y-24">
          {changelogs.map((changelog) => (
            <div
              key={changelog._id}
              className="relative flex flex-col gap-4 md:flex-row md:gap-16"
            >
              <div className="top-28 flex h-min shrink-0 items-center gap-4 md:sticky">
                {changelog.version && (
                  <Badge variant="secondary" className="text-xs">
                    Version {changelog.version}
                  </Badge>
                )}
                {changelog.date && (
                  <span className="text-xs font-medium text-muted-foreground">
                    <PostDate date={changelog.date} />
                  </span>
                )}
              </div>
              <div>
                {changelog.title && (
                  <h2 className="mb-3 text-lg leading-tight font-bold text-foreground/90 md:text-2xl">
                    {changelog.title}
                  </h2>
                )}
                {changelog.body && (
                  <div className="text-sm text-muted-foreground md:text-base">
                    <PortableTextRenderer value={changelog.body} />
                  </div>
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
                    blurDataURL={changelog.image?.asset?.metadata?.lqip || ""}
                    className="w-full object-cover mt-8 rounded-lg"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    width={
                      changelog.image.asset?.metadata?.dimensions?.width || 700
                    }
                    height={
                      changelog.image.asset?.metadata?.dimensions?.height || 400
                    }
                    quality={100}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
