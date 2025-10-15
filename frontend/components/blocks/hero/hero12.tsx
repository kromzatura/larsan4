import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { cn, toText } from "@/lib/utils";
import { resolveLinkHref } from "@/lib/resolveHref";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import PortableTextRenderer from "@/components/portable-text-renderer";
import Icon from "@/components/icon";
import { PAGE_QUERYResult } from "@/sanity.types";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";
import { getOverlayClass } from "@/lib/getOverlayClass";

type Hero12Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "hero-12" }
> & {
  locale?: SupportedLocale;
  imageTreatment?: {
    treatment?: "none" | "dark-30" | "dark-50" | "brand-gradient" | null;
    grayscale?: "on" | "off" | null;
  } | null;
};

const Hero12 = ({
  imageTreatment,
  backgroundImage,
  tagLine,
  title,
  body,
  image,
  links,
  techLogos,
  locale = FALLBACK_LOCALE,
}: Hero12Props) => {
  const overlayClass = getOverlayClass(imageTreatment?.treatment);
  const gray = imageTreatment?.grayscale === "on";
  return (
    <section
      className={cn(
        "relative overflow-hidden py-32 overlay-base",
        overlayClass
      )}
    >
      {backgroundImage && (
        <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
          <Image
            src={urlFor(backgroundImage).url()}
            alt={backgroundImage.alt || ""}
            width={1000}
            height={1000}
            className={cn("h-full w-full object-cover", gray && "grayscale")}
          />
        </div>
      )}
      <div className="relative z-10 container">
        <div className="mx-auto flex max-w-5xl flex-col items-start">
          <div className="flex flex-col items-start gap-6 text-left">
            {image && (
              <div className="rounded-xl bg-background/30 p-4 shadow-sm backdrop-blur-sm">
                <Image
                  src={urlFor(image).url()}
                  alt={image.alt || ""}
                  width={64}
                  height={64}
                  className="h-16"
                />
              </div>
            )}
            <div>
              {toText(title) && (
                <h1 className="mb-6 text-2xl font-serif font-bold tracking-tight text-pretty lg:text-5xl">
                  {toText(title)}
                </h1>
              )}
              {body && (
                <div className="max-w-3xl text-muted-foreground lg:text-xl">
                  <PortableTextRenderer value={body} locale={locale} />
                </div>
              )}
            </div>
            {links && links.length > 0 && (
              <div className="mt-6 flex justify-center gap-3">
                {links.map((link) => {
                  const href = resolveLinkHref(link, locale);
                  const target =
                    link?.isExternal && link?.target ? "_blank" : undefined;
                  const rel = target ? "noopener noreferrer" : undefined;
                  return (
                    <Link
                      key={link._key}
                      href={href || "#"}
                      target={target}
                      rel={rel}
                      className={cn(
                        buttonVariants({
                          variant: link.buttonVariant || "default",
                        }),
                        "shadow-sm transition-shadow hover:shadow group"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {toText(link.title)}
                        <Icon
                          iconVariant={link.iconVariant || "none"}
                          className="ml-2 h-4 transition-transform group-hover:translate-x-0.5"
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
            {techLogos && techLogos.length > 0 && (
              <div className="mt-20 flex flex-col items-center gap-5">
                {toText(tagLine) && (
                  <p className="font-medium text-muted-foreground lg:text-left">
                    {toText(tagLine)}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {techLogos.map((logo) => {
                    const logoLink = resolveLinkHref(
                      logo.link ?? undefined,
                      locale
                    );
                    const target =
                      logo.link?.isExternal && logo.link?.target
                        ? "_blank"
                        : undefined;
                    const rel = target ? "noopener noreferrer" : undefined;
                    return (
                      <Link
                        key={logo._key}
                        href={logoLink || "#"}
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "group flex aspect-square h-12 items-center justify-center p-0"
                        )}
                        target={target}
                        rel={rel}
                      >
                        {logo?.image && logo?.image?.asset?._id && (
                          <Image
                            src={urlFor(logo?.image).url()}
                            alt={logo.image?.alt || ""}
                            width={24}
                            height={24}
                            className="h-6 saturate-0 transition-all group-hover:saturate-100"
                            quality={100}
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero12;
