import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Link as LinkType } from "@/sanity.types";
import { resolveLinkHref } from "@/lib/resolveHref";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";

export function LinkButton({
  className,
  link,
  title,
  size = "lg",
  asDiv = false,
  locale = FALLBACK_LOCALE,
}: {
  className?: string;
  link: LinkType;
  title?: string;
  size?: "default" | "sm" | "lg" | "icon";
  asDiv?: boolean;
  locale?: SupportedLocale;
}) {
  const resolvedHref = resolveLinkHref(link as LinkType & {
    internalType?: string | null;
    internalSlug?: string | null;
    href?: string | null;
  }, locale);

  const label = link?.title ?? "";
  const target = link?.isExternal && link?.target ? "_blank" : undefined;
  const rel = target ? "noopener noreferrer" : undefined;

  if (!resolvedHref) {
    return (
      <Button
        variant={link?.buttonVariant}
        className={className}
        size={size}
        disabled
        aria-disabled="true"
      >
        {label}
      </Button>
    );
  }

  return (
    <Button
      asChild
      variant={link?.buttonVariant}
      className={className}
      size={size}
    >
      {asDiv ? (
        <Link href={resolvedHref} title={title} target={target} rel={rel}>
          <div>{label}</div>
        </Link>
      ) : (
        <Link href={resolvedHref} title={title} target={target} rel={rel}>
          {label}
        </Link>
      )}
    </Button>
  );
}
