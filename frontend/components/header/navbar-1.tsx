"use client";
import type { NavigationItem as NavItemType } from "@/lib/getNavigationItems";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/link-button";
import Icon from "@/components/icon";
import type {
  Link as SanityLink,
  LinkGroup as SanityLinkGroup,
  LinkIcon as SanityLinkIcon,
} from "@/sanity.types";
import { cn } from "@/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";
import { buildLocalizedPath } from "@/lib/i18n/routing";
import { resolveLinkHref } from "@/lib/resolveHref";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import InquiryBadge from "@/components/inquiry/inquiry-badge";
import LocaleSwitcher from "@/components/header/locale-switcher";
import { Suspense } from "react";
import type { SETTINGS_QUERYResult } from "@/sanity.types";

type NavigationItem = (SanityLink | SanityLinkGroup | SanityLinkIcon) & {
  _key: string;
};

interface Navbar1Props {
  className?: string;
  locale?: SupportedLocale;
  settings: SETTINGS_QUERYResult;
  navigationItems: NavItemType[];
  actionItems: NavItemType[];
}

const isLinkGroup = (
  item: NavigationItem
): item is SanityLinkGroup & { _key: string } => {
  return item._type === "link-group";
};

export default function Navbar1({
  className,
  locale = FALLBACK_LOCALE,
  settings,
  navigationItems,
  actionItems,
}: Navbar1Props) {
  // All data is provided by the server shell for performance and correctness

  const renderMenuItem = (item: NavigationItem) => {
    if (isLinkGroup(item)) {
      return (
        <NavigationMenuItem key={item._key}>
          <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-popover text-popover-foreground min-w-[320px]">
            {item.links?.map((subItem) => (
              <NavigationMenuLink asChild key={subItem._key}>
                <SubMenuLink item={subItem} locale={locale} />
              </NavigationMenuLink>
            ))}
          </NavigationMenuContent>
        </NavigationMenuItem>
      );
    }

    return (
      <NavigationMenuItem key={item._key}>
        <NavigationMenuLink
          asChild
          target={item.target ? "_blank" : undefined}
          className={cn(
            item.buttonVariant === "ghost"
              ? "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              : buttonVariants({ variant: item.buttonVariant, size: "default" })
          )}
        >
          <Link href={resolveLinkHref(item, locale) || "#"}>{item.title}</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  };

  const renderMobileMenuItem = (item: NavigationItem) => {
    if (isLinkGroup(item)) {
      return (
        <AccordionItem
          key={item._key}
          value={item.title || ""}
          className="border-b-0"
        >
          <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
            {item.title}
          </AccordionTrigger>
          <AccordionContent className="mt-2">
            <div className="flex flex-col gap-4">
              {item.links?.map((subItem) => (
                <DialogClose asChild key={subItem._key}>
                  <SubMenuLink item={subItem} locale={locale} />
                </DialogClose>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      );
    }

    return (
      <Link
        key={item._key}
        href={resolveLinkHref(item, locale) || "#"}
        target={item.target ? "_blank" : undefined}
        className={cn(
          item.buttonVariant === "ghost"
            ? "text-md font-semibold hover:text-accent-foreground"
            : buttonVariants({ variant: item.buttonVariant, size: "default" })
        )}
      >
        {item.title}
      </Link>
    );
  };

  return (
    <header
      className={cn("sticky top-0 z-50 w-full py-4 bg-background", className)}
    >
      <div className="container">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex items-center">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link
              href={buildLocalizedPath(locale, "/")}
              className="flex items-center gap-2"
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
                  blurDataURL={settings.logo.asset?.metadata?.lqip || undefined}
                  quality={100}
                />
              ) : null}
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {navigationItems?.map((item) =>
                    renderMenuItem(item as NavigationItem)
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {actionItems?.map((item) => (
              <LinkButton
                key={item._key}
                size="sm"
                link={item as SanityLink}
                locale={locale}
              />
            ))}
            <InquiryBadge locale={locale} />
            <Suspense fallback={null}>
              <LocaleSwitcher locale={locale} className="ml-2" />
            </Suspense>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href={buildLocalizedPath(locale, "/")}
              className="flex items-center gap-2"
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
                  blurDataURL={settings.logo.asset?.metadata?.lqip || undefined}
                  quality={100}
                />
              ) : null}
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link
                      href={buildLocalizedPath(locale, "/")}
                      className="flex items-center gap-2"
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
                            settings.logo.asset?.metadata?.lqip
                              ? "blur"
                              : undefined
                          }
                          blurDataURL={
                            settings.logo.asset?.metadata?.lqip || undefined
                          }
                          quality={100}
                        />
                      ) : null}
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {navigationItems?.map((item) =>
                      renderMobileMenuItem(item as NavigationItem)
                    )}
                  </Accordion>
                  <div className="flex flex-col gap-3">
                    {actionItems?.map((item) => (
                      <LinkButton
                        key={item._key}
                        link={item as SanityLink}
                        locale={locale}
                      />
                    ))}
                    <InquiryBadge
                      className="w-full justify-center"
                      locale={locale}
                    />
                    <Suspense fallback={null}>
                      <LocaleSwitcher locale={locale} variant="menu" />
                    </Suspense>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

const SubMenuLink = ({
  item,
  locale = FALLBACK_LOCALE,
}: {
  item: SanityLink | SanityLinkIcon;
  locale?: SupportedLocale;
}) => {
  return (
    <Link
      href={resolveLinkHref(item, locale) || "#"}
      className="flex w-full flex-row gap-4 rounded-md p-3 text-sm font-medium no-underline transition-colors hover:bg-accent hover:text-accent-foreground"
      target={item.target ? "_blank" : undefined}
    >
      <div className="text-foreground">
        <Icon
          iconVariant={(item as SanityLinkIcon).iconVariant || "none"}
          size={5}
          strokeWidth={2}
          className="shrink-0"
        />
      </div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {(item as SanityLinkIcon).description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {(item as SanityLinkIcon).description}
          </p>
        )}
      </div>
    </Link>
  );
};
