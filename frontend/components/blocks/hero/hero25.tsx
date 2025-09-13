import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Icon from "@/components/icon";
import { PAGE_QUERYResult } from "@/sanity.types";

type Hero25Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "hero-25" }
>;

const Hero25 = ({ tagLine, title, image, links, tags }: Hero25Props) => {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-5xl text-center">
          {image && (
            <Image
              src={urlFor(image).url()}
              alt={image.alt || ""}
              width={96}
              height={96}
              className="mx-auto mb-6 h-14 w-14 md:mb-8 md:h-20 md:w-20 lg:mb-10 lg:h-24 lg:w-24"
            />
          )}
          {tagLine && (
            <span className="mb-2 inline-block text-sm font-medium tracking-wider text-muted-foreground uppercase md:text-base">
              {tagLine}
            </span>
          )}
          {title && (
            <h1 className="mt-4 text-4xl leading-tight font-bold text-balance md:text-5xl lg:text-7xl lg:leading-[1.1]">
              {title}
            </h1>
          )}
          {links && (
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              {links.map((link) => (
                <Link
                  key={link._key}
                  href={link.href || "#"}
                  target={link.target ? "_blank" : undefined}
                  rel={link.target ? "noopener" : undefined}
                  className={cn(
                    buttonVariants({
                      variant: link.buttonVariant || "default",
                      size: "lg",
                    }),
                    "px-8 py-6 text-base font-medium"
                  )}
                >
                  {link.title}
                  <Icon
                    iconVariant={link.iconVariant || "none"}
                    strokeWidth={1.5}
                  />
                </Link>
              ))}
            </div>
          )}
          {tags && (
            <div className="mt-10 lg:mt-12">
              <ul className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground lg:text-base">
                {tags.map((tag) => (
                  <li
                    key={tag._key}
                    className="flex items-center gap-2.5 whitespace-nowrap"
                  >
                    <Icon
                      iconVariant={tag.iconVariant || "none"}
                      className="size-5 text-primary"
                      strokeWidth={2}
                    />
                    {tag.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero25;
