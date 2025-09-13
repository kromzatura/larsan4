import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PAGE_QUERYResult } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type Feature1 = Extract<Block, { _type: "feature-1" }>;
type FeatureImage = Extract<
  NonNullable<Feature1["columns"]>[number],
  { _type: "feature-image" }
>;

export default function FeatureImage({ image }: FeatureImage) {
  return image && image.asset?._id ? (
    <Image
      src={urlFor(image).url()}
      alt={image.alt || ""}
      placeholder={image?.asset?.metadata?.lqip ? "blur" : undefined}
      blurDataURL={image?.asset?.metadata?.lqip || ""}
      className="max-h-96 w-full rounded-md object-cover"
      sizes="(min-width: 640px) 50vw, 100vw"
      width={image.asset?.metadata?.dimensions?.width || 800}
      height={image.asset?.metadata?.dimensions?.height || 800}
      quality={100}
    />
  ) : null;
}
