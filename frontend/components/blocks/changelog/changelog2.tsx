import SectionContainer from "@/components/ui/section-container";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PostDate from "@/components/post-date";
import { PAGE_QUERYResult } from "@/sanity.types";
import { fetchSanityChangelogs } from "@/sanity/lib/fetch";
import PortableTextRenderer from "@/components/portable-text-renderer";

type Changelogs2Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "changelog-2" }
>;

export default async function Changelog2({ padding }: Changelogs2Props) {
  const changelogs = await fetchSanityChangelogs();

  return (
    <SectionContainer padding={padding}>
      {changelogs && changelogs?.length > 0 && (
        <div className="mx-auto max-w-xl space-y-10 border-l border-dashed border-border pl-6">
          {changelogs.map((changelog) => (
            <div key={changelog._id}>
              {changelog.date && (
                <div className="relative font-mono text-sm text-muted-foreground">
                  <time className="absolute top-1 -left-6 h-3 w-3 -translate-x-1/2 rounded-full bg-emerald-400"></time>
                  <PostDate date={changelog.date} />
                </div>
              )}
              {changelog.image && changelog.image.asset?._id && (
                <Image
                  src={urlFor(changelog.image).url()}
                  alt={changelog.image.alt || ""}
                  placeholder={
                    changelog.image?.asset?.metadata?.lqip ? "blur" : undefined
                  }
                  blurDataURL={changelog.image?.asset?.metadata?.lqip || ""}
                  className="my-4 aspect-[8/7] rounded-md object-cover"
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
              {changelog.title && (
                <h2 className="mb-2 text-3xl font-semibold">
                  {changelog.title}
                </h2>
              )}
              {changelog.body && (
                <div className="text-primary/80">
                  <PortableTextRenderer value={changelog.body} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
