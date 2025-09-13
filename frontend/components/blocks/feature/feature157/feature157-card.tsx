import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/icon";
import { PAGE_QUERYResult } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type Feature157 = Extract<Block, { _type: "feature-157" }>;

type Feature157Card = Extract<
  NonNullable<Feature157["columns"]>[number],
  { _type: "feature-157-card" }
>;

export default function Feature157Card({ image, link }: Feature157Card) {
  return (
    <Link
      href={link?.href || ""}
      className="relative flex-auto basis-1 transition-opacity delay-150 duration-300 hover:opacity-80"
    >
      {image && image.asset?._id && (
        <Image
          src={urlFor(image).url()}
          alt={image.alt || ""}
          placeholder={image?.asset?.metadata?.lqip ? "blur" : undefined}
          blurDataURL={image?.asset?.metadata?.lqip || ""}
          className="mb-6 aspect-[1.5] w-full rounded-2xl object-cover"
          sizes="(min-width: 640px) 50vw, 100vw"
          width={image.asset?.metadata?.dimensions?.width || 800}
          height={image.asset?.metadata?.dimensions?.height || 800}
          quality={100}
        />
      )}
      <div className="flex items-center gap-2 mb-2">
        <Icon
          iconVariant={link?.iconVariant || "none"}
          strokeWidth={2}
          size={6}
        />
        <div className="text-2xl font-semibold">{link?.title}</div>
      </div>
      <div>{link?.description}</div>
    </Link>
  );
}
