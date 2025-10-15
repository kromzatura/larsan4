import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { cn, toText } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import PortableTextRenderer from "@/components/portable-text-renderer";
import Icon from "@/components/icon";
import { Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Fragment } from "react";
import { PAGE_QUERYResult } from "@/sanity.types";
import { resolveLinkHref } from "@/lib/resolveHref";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";

type Hero160Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "hero-160" }
> & { locale?: SupportedLocale };

const Hero160 = ({
  tag,
  backgroundImage,
  title,
  body,
  links,
  image,
  locale = FALLBACK_LOCALE,
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
              {toText(tag.title) && (
                <p className="text-sm leading-normal font-light text-white/60">
                  {toText(tag.title)}
                </p>
              )}
            </Badge>
          )}
          {toText(title) && (
            <h1 className="from-muted to-muted/80 bg-gradient-to-tr w-full max-w-[37.5rem] bg-clip-text py-2 text-center text-4xl leading-tight font-normal text-transparent md:max-w-[50rem] md:text-5xl xl:max-w-[62.5rem] xl:text-[3.6rem]">
              {toText(title)}
            </h1>
          )}
          {body && (
            <div className="w-full max-w-[51.875rem] text-center text-xl text-white/60">
              <PortableTextRenderer value={body} locale={locale} />
            </div>
          )}
          {links && links.length > 0 && (
            <div className="mt-4 flex flex-col items-center gap-4 md:flex-row">
              {links.map((link) => {
                const href = resolveLinkHref(link, locale) || "#";
                const target =
                  link?.isExternal && link?.target ? "_blank" : undefined;
                const rel = target ? "noopener noreferrer" : undefined;
                return (
                  <Link
                    key={link._key}
                    href={href}
                    target={target}
                    rel={rel}
                    className={cn(
                      buttonVariants({
                        variant: link.buttonVariant || "default",
                      })
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {toText(link.title)}
                      <Icon
                        iconVariant={link.iconVariant || "none"}
                        strokeWidth={1.5}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          {links && links.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 md:flex-row">
              {links.map((link, index) => (
                <Fragment key={link._key}>
                  {toText(link.description) && (
                    <p key={link._key} className="text-sm text-white/60">
                      {toText(link.description)}
                    </p>
                  )}
                  {index < links.length - 1 && toText(link.description) && (
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
