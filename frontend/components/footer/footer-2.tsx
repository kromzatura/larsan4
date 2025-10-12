"use client";
import type {
  NavigationItem,
  NavGroup,
  NavLink,
} from "@/lib/getNavigationItems";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import PortableTextRenderer from "@/components/portable-text-renderer";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";
import { buildLocalizedPath } from "@/lib/i18n/routing";
import { resolveLinkHref } from "@/lib/resolveHref";
import type { SETTINGS_QUERYResult } from "@/sanity.types";

interface Footer2Props {
  className?: string;
  locale?: SupportedLocale;
  settings: SETTINGS_QUERYResult;
  footerNavItems: NavigationItem[];
  bottomNavItems: NavigationItem[];
}

export default function Footer2({
  className,
  locale = FALLBACK_LOCALE,
  settings,
  footerNavItems,
  bottomNavItems,
}: Footer2Props) {
  const isNavGroup = (item: NavigationItem): item is NavGroup =>
    item._type === "link-group";
  const isNavLink = (item: NavigationItem): item is NavLink =>
    item._type !== "link-group";

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <Link
                href={buildLocalizedPath(locale, "/")}
                className="flex items-center gap-2 lg:justify-start"
              >
                {settings?.logo ? (
                  <Image
                    src={urlFor(settings.logo).url()}
                    alt={settings.logo.alt ?? ""}
                    width={
                      (settings.logo.width as number) ??
                      settings.logo?.asset?.metadata?.dimensions?.width
                    }
                    height={
                      (settings.logo.height as number) ??
                      settings.logo?.asset?.metadata?.dimensions?.height
                    }
                    title={settings.siteName || ""}
                    placeholder={
                      settings.logo.asset?.metadata?.lqip ? "blur" : undefined
                    }
                    blurDataURL={
                      settings.logo.asset?.metadata?.lqip || undefined
                    }
                    quality={100}
                  />
                ) : null}
              </Link>
              <p className="mt-4 font-bold">{settings?.description}</p>
            </div>
            {footerNavItems?.map((section) => {
              if (!isNavGroup(section)) return null;
              return (
                <div key={section._key}>
                  <h3 className="text-base mb-4 font-bold">{section.title}</h3>
                  <ul className="space-y-4 text-muted-foreground">
                    {section.links?.filter(isNavLink).map((link) => {
                      return (
                        <li key={link._key}>
                          <Link
                            href={resolveLinkHref(link, locale) || "#"}
                            target={link.target ? "_blank" : undefined}
                            className={cn(
                              link.buttonVariant === "ghost"
                                ? "font-medium hover:text-primary"
                                : buttonVariants({
                                    variant: link.buttonVariant,
                                    size: "sm",
                                  })
                            )}
                          >
                            {link.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <span>&copy; {new Date().getFullYear()}</span>
              {settings?.copyright && (
                <span className="[&>p]:!m-0">
                  <PortableTextRenderer
                    value={settings.copyright}
                    locale={locale}
                  />
                </span>
              )}
            </div>
            <ul className="flex gap-4">
              {bottomNavItems?.filter(isNavLink).map((link) => {
                if (link._type !== "link") return null;
                return (
                  <li key={link._key}>
                    <Link
                      href={resolveLinkHref(link, locale) || "#"}
                      target={link.target ? "_blank" : undefined}
                      className={cn(
                        link.buttonVariant === "ghost"
                          ? "underline hover:text-primary"
                          : buttonVariants({
                              variant: link.buttonVariant,
                              size: "sm",
                            })
                      )}
                    >
                      {link.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
}
