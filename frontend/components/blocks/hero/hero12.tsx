import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import PortableTextRenderer from "@/components/portable-text-renderer";
import Icon from "@/components/icon";
import { PAGE_QUERYResult } from "@/sanity.types";

type Hero12Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "hero-12" }
>;

const Hero12 = ({
  backgroundImage,
  tagLine,
  title,
  body,
  image,
  links,
  techLogos,
}: Hero12Props) => {
  return (
    <section className="relative overflow-hidden py-32">
      {backgroundImage && (
        <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
          <Image
            src={urlFor(backgroundImage).url()}
            alt={backgroundImage.alt || ""}
            width={1000}
            height={1000}
            className="h-full w-full object-cover opacity-90 [mask-image:radial-gradient(75%_75%_at_center,white,transparent)]"
          />
        </div>
      )}
      <div className="relative z-10 container">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="flex flex-col items-center gap-6 text-center">
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
              <h1 className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl">
                {title}
              </h1>
              {body && (
                <div className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
                  <PortableTextRenderer value={body} />
                </div>
              )}
            </div>
            {links && links.length > 0 && (
              <div className="mt-6 flex justify-center gap-3">
                {links.map((link) => (
                  <Link
                    key={link._key}
                    href={link.href || "#"}
                    target={link.target ? "_blank" : undefined}
                    rel={link.target ? "noopener" : undefined}
                    className={cn(
                      buttonVariants({
                        variant: link.buttonVariant || "default",
                      }),
                      "shadow-sm transition-shadow hover:shadow group"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {link.title}
                      <Icon
                        iconVariant={link.iconVariant || "none"}
                        className="ml-2 h-4 transition-transform group-hover:translate-x-0.5"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {techLogos && techLogos.length > 0 && (
              <div className="mt-20 flex flex-col items-center gap-5">
                {tagLine && (
                  <p className="font-medium text-muted-foreground lg:text-left">
                    {tagLine}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {techLogos.map((logo) => (
                    <Link
                      key={logo._key}
                      href={logo.link?.href || "#"}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "group flex aspect-square h-12 items-center justify-center p-0"
                      )}
                      target={logo.link?.target ? "_blank" : undefined}
                      rel={logo.link?.target ? "noopener" : undefined}
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
                  ))}
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
