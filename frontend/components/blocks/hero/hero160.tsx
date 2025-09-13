import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import PortableTextRenderer from "@/components/portable-text-renderer";
import Icon from "@/components/icon";
import { Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Fragment } from "react";
import { PAGE_QUERYResult } from "@/sanity.types";

type Hero160Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "hero-160" }
>;

const Hero160 = ({
  tag,
  backgroundImage,
  title,
  body,
  links,
  image,
}: Hero160Props) => {
  return (
    <section className="relative overflow-hidden bg-foreground py-12 md:py-28">
      {backgroundImage && (
        <div className="absolute top-0 flex h-full w-full">
          <Image
            src={urlFor(backgroundImage).url()}
            alt={backgroundImage.alt || ""}
            width={1000}
            height={1000}
            className="absolute top-0 left-0 z-10 aspect-[2/1] w-full"
          />
        </div>
      )}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent to-black" />
      <div className="relative z-20 container">
        <div className="flex flex-col items-center gap-5">
          {tag && (
            <Badge className="mb-2 flex w-fit items-center gap-2 rounded-full border border-white/40 bg-black px-4 py-2">
              <Icon
                iconVariant={tag.iconVariant || "none"}
                strokeWidth={1.5}
                className="text-white/60"
              />
              {tag.title && (
                <p className="text-sm leading-normal font-light text-white/60">
                  {tag.title}
                </p>
              )}
            </Badge>
          )}
          {title && (
            <h1 className="from-muted to-muted/80 bg-gradient-to-tr w-full max-w-[37.5rem] bg-clip-text py-2 text-center text-4xl leading-tight font-normal text-transparent md:max-w-[50rem] md:text-5xl xl:max-w-[62.5rem] xl:text-[3.6rem]">
              {title}
            </h1>
          )}
          {body && (
            <div className="w-full max-w-[51.875rem] text-center text-xl text-white/60">
              <PortableTextRenderer value={body} />
            </div>
          )}
          {links && links.length > 0 && (
            <div className="mt-4 flex flex-col items-center gap-4 md:flex-row">
              {links.map((link) => (
                <Link
                  key={link._key}
                  href={link.href || "#"}
                  target={link.target ? "_blank" : undefined}
                  rel={link.target ? "noopener" : undefined}
                  className={cn(
                    buttonVariants({
                      variant: link.buttonVariant || "default",
                    })
                  )}
                >
                  <div className="flex items-center gap-2">
                    {link.title}
                    <Icon
                      iconVariant={link.iconVariant || "none"}
                      strokeWidth={1.5}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
          {links && links.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 md:flex-row">
              {links.map((link, index) => (
                <Fragment key={link._key}>
                  {link.description && (
                    <p key={link._key} className="text-sm text-white/60">
                      {link.description}
                    </p>
                  )}
                  {index < links.length - 1 && link.description && (
                    <Circle className="h-1 w-1 fill-white/60" />
                  )}
                </Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
      {image && (
        <div className="relative z-20 mx-auto max-w-[86.5rem] px-8 py-20 md:py-32">
          <AspectRatio
            ratio={1.562130178 / 1}
            className="overflow-hidden rounded-2xl border border-white/15"
          >
            <Image
              src={urlFor(image).url()}
              alt={image.alt || ""}
              width={1000}
              height={1000}
              className="h-full w-full object-cover object-center"
            />
          </AspectRatio>
        </div>
      )}
    </section>
  );
};

export default Hero160;
