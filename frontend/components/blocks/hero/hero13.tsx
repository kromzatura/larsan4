import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import PortableTextRenderer from "@/components/portable-text-renderer";
import Icon from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { PAGE_QUERYResult } from "@/sanity.types";

type Hero13Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "hero-13" }
>;

const Hero13 = ({ tag, title, body, links }: Hero13Props) => {
  return (
    <section className="py-32">
      <div className="container">
        <Badge
          variant="outline"
          className="mb-4 max-w-full text-sm font-normal lg:mb-10 lg:py-2 lg:pr-5 lg:pl-2"
        >
          <span className="mr-2 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent">
            <Icon iconVariant={tag?.iconVariant || "none"} className="size-4" />
          </span>
          {tag?.title && (
            <p className="truncate whitespace-nowrap">{tag?.title}</p>
          )}
        </Badge>
        {title && (
          <h1 className="mb-6 text-4xl leading-none font-bold tracking-tighter md:text-[7vw] lg:text-8xl">
            {title}
          </h1>
        )}
        {body && (
          <div className="max-w-2xl text-muted-foreground md:text-[2vw] lg:text-xl">
            <PortableTextRenderer value={body} />
          </div>
        )}
        {links && links.length > 0 && (
          <div className="mt-6 flex flex-col gap-4 sm:flex-row lg:mt-10">
            {links.map((link) => (
              <Link
                key={link._key}
                href={link.href || ""}
                target={link.target ? "_blank" : undefined}
                rel={link.target ? "noopener " : undefined}
                className={cn(
                  buttonVariants({
                    variant: link.buttonVariant || "default",
                    size: "lg",
                  }),
                  "w-full md:w-auto group"
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
      </div>
    </section>
  );
};

export default Hero13;
