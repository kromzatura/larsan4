import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import PortableTextRenderer from "@/components/portable-text-renderer";
import Icon from "@/components/icon";
import { ArrowDown } from "lucide-react";
import { PAGE_QUERYResult } from "@/sanity.types";

type Hero174Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "hero-174" }
>;

const Hero174 = ({
  backgroundImage,
  title,
  body,
  links,
  tag,
}: Hero174Props) => {
  return (
    <section className="h-svh max-h-[1400px] min-h-[600px] w-full -mt-10 relative after:absolute after:inset-0 after:block after:size-full after:bg-zinc-950/50 after:content-['']">
      {backgroundImage && (
        <div className="absolute top-0 flex h-full w-full">
          <Image
            src={urlFor(backgroundImage).url()}
            alt={backgroundImage.alt || ""}
            width={1000}
            height={1000}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="relative z-10 mx-auto flex size-full max-w-[125rem] px-4 py-9">
        <div className="flex w-full flex-col justify-between gap-10">
          <div className="mx-auto flex max-w-[31.25rem] flex-1 flex-col items-center justify-center gap-7 sm:max-w-[37.5rem] md:max-w-[50rem]">
            {title && (
              <h1 className="text-center text-4xl leading-tight font-medium text-white sm:text-5xl md:text-6xl">
                {title}
              </h1>
            )}
            {body && (
              <div className="text-center text-lg text-balance text-white md:text-2xl">
                <PortableTextRenderer value={body} />
              </div>
            )}
            {links && links.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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
                      "h-fit w-fit rounded-sm px-6 py-3.5 text-sm font-semibold tracking-wider text-nowrap"
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
          </div>
          <div className="flex items-center justify-between gap-4 rounded-lg bg-black/20 px-6 py-4 backdrop-blur-sm">
            {tag && (
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-white" />
                <div className="text-sm font-medium">
                  {tag.title && <p className="text-white">{tag.title}</p>}
                  {tag.description && (
                    <p className="text-white/50">{tag.description}</p>
                  )}
                </div>
              </div>
            )}
            <Button
              variant="outline"
              size="icon"
              className="flex size-10 rounded-full border-2 border-primary bg-primary/20 transition-colors hover:bg-white/10"
            >
              <ArrowDown className="m-auto size-5 stroke-white" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero174;
