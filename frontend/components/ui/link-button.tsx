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
  locale = FALLBACK_LOCALE,
}: {
  className?: string;
  link: LinkType;
  title?: string;
  size?: "default" | "sm" | "lg" | "icon";
  locale?: SupportedLocale;
}) {
  // Build a minimal Link-like object for href resolution without unsafe casts.
  const maybe = link as unknown as Record<string, unknown>;
  const internalType =
    typeof maybe["internalType"] === "string"
      ? (maybe["internalType"] as string)
      : undefined;
  const internalSlug =
    typeof maybe["internalSlug"] === "string"
      ? (maybe["internalSlug"] as string)
      : undefined;

  const resolvedHref = resolveLinkHref(
    {
      isExternal: link?.isExternal ?? undefined,
      href: link?.href ?? undefined,
      internalType,
      internalSlug,
    },
    locale
  );

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
      <Link href={resolvedHref} title={title} target={target} rel={rel}>
        {label}
      </Link>
    </Button>
  );
}
