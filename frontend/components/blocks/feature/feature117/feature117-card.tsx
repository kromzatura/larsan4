import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image";
import { PAGE_QUERYResult } from "@/sanity.types";
import Icon from "@/components/icon";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type Feature117 = Extract<Block, { _type: "feature-117" }>;
type Feature117Card = Extract<
  NonNullable<Feature117["columns"]>[number],
  { _type: "feature-117-card" }
>;

interface Feature117CardProps extends Feature117Card {
  index: number;
}

export default function Feature117Card({
  tag,
  title,
  image,
  link,
  index,
}: Feature117CardProps) {
  return (
    <Link
      href={link?.href || ""}
      className="group relative overflow-hidden rounded-xl"
    >
      {image && image.asset?._id && (
        <Image
          src={urlFor(image).url()}
          alt={image.alt || ""}
          placeholder={image?.asset?.metadata?.lqip ? "blur" : undefined}
          blurDataURL={image?.asset?.metadata?.lqip || ""}
          className="h-full max-h-[450px] w-full rounded-xl object-cover object-center"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          width={image.asset?.metadata?.dimensions?.width || 800}
          height={image.asset?.metadata?.dimensions?.height || 800}
          quality={100}
        />
      )}
      <div className="absolute top-0 right-0 bottom-0 left-0 translate-y-20 rounded-xl bg-gradient-to-t from-primary to-transparent transition-transform duration-300 group-hover:translate-y-0"></div>
      <div className="absolute top-0 flex h-full w-full flex-col justify-between p-7">
        <span
          className={cn(
            "ml-auto flex w-fit items-center gap-1 rounded-full px-4 py-2.5 text-sm font-semibold text-background",
            index === 0 && "bg-primary",
            index === 1 && "bg-background/30 backdrop-blur-sm text-foreground"
          )}
        >
          <Icon
            iconVariant={tag?.iconVariant || "none"}
            className={cn("text-background", index === 1 && "text-foreground")}
            size={6}
          />
          {tag?.text}
        </span>
        <div className="flex flex-col gap-5 text-background">
          <h4 className="text-2xl font-semibold lg:text-3xl">{title}</h4>
          <p className="flex items-center gap-1 font-medium">
            {link?.title}
            <ChevronRight className="h-auto w-4" />
          </p>
        </div>
      </div>
    </Link>
  );
}
