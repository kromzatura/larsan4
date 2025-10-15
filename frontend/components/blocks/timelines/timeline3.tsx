import { cn, toText } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Icon from "@/components/icon";
import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import { resolveLinkHref } from "@/lib/resolveHref";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";

type Timeline3Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "timeline-3" }
> & { locale?: SupportedLocale };

export default function Timeline3({
  padding,
  title,
  description,
  links,
  columns,
  locale = FALLBACK_LOCALE,
}: Timeline3Props) {
  return (
    <SectionContainer padding={padding}>
      <div className="relative grid gap-16 md:grid-cols-2">
        <div className="top-40 h-fit md:sticky">
          {toText(title) && (
            <h2 className="mt-4 mb-6 text-4xl font-semibold md:text-5xl">
              {toText(title)}
            </h2>
          )}
          {toText(description) && (
            <p className="font-medium text-muted-foreground md:text-xl">
              {toText(description)}
            </p>
          )}
          {links && links.length > 0 && (
            <div className="mt-8 flex flex-col gap-4 lg:flex-row">
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
                        size: "lg",
                      })
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
        </div>
        {columns && columns?.length > 0 && (
          <div className="flex flex-col gap-12 md:gap-20">
            {columns.map((column) => (
              <div key={column._key} className="rounded-xl border p-2">
                {column.image && column.image.asset?._id && (
                  <Image
                    src={urlFor(column.image).url()}
                    alt={column.image.alt || ""}
                    placeholder={
                      column.image?.asset?.metadata?.lqip ? "blur" : undefined
                    }
                    blurDataURL={column.image?.asset?.metadata?.lqip || ""}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    width={
                      column.image.asset?.metadata?.dimensions?.width || 500
                    }
                    height={
                      column.image.asset?.metadata?.dimensions?.height || 500
                    }
                    quality={100}
                    className="aspect-video w-full rounded-xl border border-dashed object-cover"
                  />
                )}
                <div className="p-6">
                  {toText(column.title) && (
                    <h3 className="mb-1 text-2xl font-semibold">
                      {toText(column.title)}
                    </h3>
                  )}
                  {toText(column.description) && (
                    <p className="text-muted-foreground">
                      {toText(column.description)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
