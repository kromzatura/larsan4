import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image";
import { PAGE_QUERYResult } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type Feature66 = Extract<Block, { _type: "feature-66" }>;

type Feature66Card = Extract<
  NonNullable<Feature66["columns"]>[number],
  { _type: "feature-66-card" }
>;

export default function Feature66Card({ logo, image, link }: Feature66Card) {
  return (
    <Link href={link?.href || ""} className="h-full">
      <div className="group relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-xl bg-red-100 md:aspect-[5/4] lg:aspect-[16/9]">
        {image && image.asset?._id && (
          <Image
            src={urlFor(image).url()}
            alt={image.alt || ""}
            placeholder={image?.asset?.metadata?.lqip ? "blur" : undefined}
            blurDataURL={image?.asset?.metadata?.lqip || ""}
            className="absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 640px) 50vw, 100vw"
            width={image.asset?.metadata?.dimensions?.width || 800}
            height={image.asset?.metadata?.dimensions?.height || 800}
            quality={100}
          />
        )}
        <div className="absolute inset-x-0 bottom-0 mt-auto max-h-[50%] min-h-[50%] bg-[linear-gradient(transparent,var(--primary)_80%)] mix-blend-multiply" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6 text-primary-foreground md:p-8">
          {logo && logo.asset?._id && (
            <Image
              src={urlFor(logo).url()}
              alt={logo.alt || ""}
              placeholder={logo?.asset?.metadata?.lqip ? "blur" : undefined}
              blurDataURL={logo?.asset?.metadata?.lqip || ""}
              className="mb-3 h-8 w-auto invert"
              sizes="130px"
              width={logo.asset?.metadata?.dimensions?.width || 800}
              height={logo.asset?.metadata?.dimensions?.height || 800}
              quality={100}
            />
          )}
          <p className="text-xl font-semibold text-white">{link?.title}</p>
        </div>
      </div>
    </Link>
  );
}
