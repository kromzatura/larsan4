import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { PAGE_QUERYResult } from "@/sanity.types";
import Icon from "@/components/icon";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type Feature3 = Extract<Block, { _type: "feature-3" }>;
type Feature3Card = Extract<
  NonNullable<Feature3["columns"]>[number],
  { _type: "feature-3-card" }
>;

export default function Feature3Card({
  iconVariant,
  title,
  description,
  image,
}: Feature3Card) {
  return (
    <Card>
      <CardHeader className="pb-1">
        <Icon iconVariant={iconVariant || "none"} />
      </CardHeader>
      <CardContent className="text-left">
        <h2 className="mb-1 text-lg font-semibold">{title}</h2>
        <p className="leading-snug text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="justify-end pr-0 pb-0">
        {image && image.asset?._id && (
          <Image
            src={urlFor(image).url()}
            alt={image.alt || ""}
            placeholder={image?.asset?.metadata?.lqip ? "blur" : undefined}
            blurDataURL={image?.asset?.metadata?.lqip || ""}
            className="h-40 w-full rounded-tl-md object-cover object-center"
            sizes="(min-width: 640px) 50vw, 100vw"
            width={image.asset?.metadata?.dimensions?.width || 800}
            height={image.asset?.metadata?.dimensions?.height || 800}
            quality={100}
          />
        )}
      </CardFooter>
    </Card>
  );
}
