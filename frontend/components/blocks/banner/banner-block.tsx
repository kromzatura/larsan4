import SectionContainer from "@/components/ui/section-container";
import { buttonVariants } from "@/components/ui/button";
import { resolveLinkHref } from "@/lib/resolveHref";
import PortableTextRenderer from "@/components/portable-text-renderer";
import type { PortableTextProps } from "@portabletext/react";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";
import Link from "next/link";
import { PAGE_QUERYResult } from "@/sanity.types";
import { cn, toText } from "@/lib/utils";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type BannerBlock = Extract<Block, { _type: "banner-block" }>;

export default function BannerBlock({
  padding,
  title,
  description,
  link,
  locale = FALLBACK_LOCALE,
}: BannerBlock & { locale?: SupportedLocale }) {
  const hasTitle = Boolean(toText(title));
  const hasDesc = Array.isArray(description) && description.length > 0;

  const href = link ? resolveLinkHref(link, locale) : null;
  const isExternal = Boolean(link?.isExternal);
  const target = isExternal && link?.target ? "_blank" : undefined;
  const rel = target ? "noopener noreferrer" : undefined;

  return (
    <SectionContainer padding={padding}>
      <div className="rounded-lg border bg-muted/40 p-6 md:p-8">
        {hasTitle && (
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {toText(title)}
          </h2>
        )}
        {hasDesc && (
          <div
            className={cn(
              hasTitle ? "mt-3" : undefined,
              "text-muted-foreground"
            )}
          >
            <PortableTextRenderer
              value={description as PortableTextProps["value"]}
              locale={locale}
            />
          </div>
        )}
        {href && (
          <div className="mt-5">
            <Link
              href={href}
              target={target}
              rel={rel}
              className={buttonVariants()}
            >
              {toText(link?.title) || "Learn more"}
            </Link>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
