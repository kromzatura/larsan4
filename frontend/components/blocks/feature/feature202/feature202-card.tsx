import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image";
import { PAGE_QUERYResult } from "@/sanity.types";
import Icon from "@/components/icon";
import { cn } from "@/lib/utils";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type Feature202 = Extract<Block, { _type: "feature-202" }>;
type Feature202Card = Extract<
  NonNullable<Feature202["columns"]>[number],
  { _type: "feature-202-card" }
>;

interface Feature202CardProps extends Feature202Card {
  index: number;
}

export default function Feature202Card({
  iconVariant,
  title,
  description,
  image,
  link,
  index,
}: Feature202CardProps) {
  return (
    <Link
      href={link?.href || ""}
      className={cn(
        "group relative isolate h-80 overflow-hidden rounded-2xl border border-border transition-transform duration-300 hover:-translate-y-0.5",
        (index % 4 === 0 || index % 4 === 3) && "lg:col-span-2"
      )}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary to-transparent" />
      {image && image.asset?._id && (
        <Image
          src={urlFor(image).url()}
          alt={image.alt || ""}
          placeholder={image?.asset?.metadata?.lqip ? "blur" : undefined}
          blurDataURL={image?.asset?.metadata?.lqip || ""}
          className="absolute inset-0 -z-20 size-full rounded-2xl object-cover grayscale-100 transition-all duration-300 group-hover:grayscale-50"
          sizes="(min-width: 640px) 50vw, 100vw"
          width={image.asset?.metadata?.dimensions?.width || 800}
          height={image.asset?.metadata?.dimensions?.height || 800}
          quality={100}
        />
      )}
      <div className="flex h-full flex-col justify-between p-10">
        <span className="flex size-12 items-center justify-center rounded-xl border border-background/20 bg-background/15 backdrop-blur-sm">
          <Icon
            iconVariant={iconVariant || "none"}
            className="text-background"
          />
        </span>
        <div>
          {title && (
            <h3 className="text-base font-medium text-background">{title}</h3>
          )}
          {description && (
            <p className="mt-2 text-background/70">{description}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
