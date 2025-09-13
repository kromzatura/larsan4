import { getNavigationItems } from "@/lib/getNavigationItems";
import { fetchSanitySettings } from "@/sanity/lib/fetch";
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

type NavigationItem = (SanityLink | SanityLinkGroup | SanityLinkIcon) & {
  _key: string;
};

interface Navbar1Props {
  className?: string;
}

const isLinkGroup = (
  item: NavigationItem
): item is SanityLinkGroup & { _key: string } => {
  return item._type === "link-group";
};

export default async function Navbar1({ className }: Navbar1Props) {
  const settings = await fetchSanitySettings();
  const navigationItems = await getNavigationItems("header");
  const actionItems = await getNavigationItems("header-action");

  const renderMenuItem = (item: NavigationItem) => {
    if (isLinkGroup(item)) {
      return (
        <NavigationMenuItem key={item._key}>
          <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-popover text-popover-foreground min-w-[320px]">
            {item.links?.map((subItem) => (
              <NavigationMenuLink asChild key={subItem._key}>
                <SubMenuLink item={subItem} />
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
          <Link href={item.href || "#"}>{item.title}</Link>
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
                  <SubMenuLink item={subItem} />
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
        href={item.href || "#"}
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
      className={`sticky top-0 w-full z-50 py-4 bg-background ${className}`}
    >
      <div className="container">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex items-center">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
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
              ) : (
                <span className="text-lg font-semibold tracking-tighter">
                  {settings?.siteName || "Logo"}
                </span>
              )}
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
          <div className="flex gap-2">
            {actionItems?.map((item) => (
              <LinkButton key={item._key} size="sm" link={item as SanityLink} />
            ))}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
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
              ) : (
                <span className="text-lg font-semibold tracking-tighter">
                  {settings?.siteName || "Logo"}
                </span>
              )}
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
                    <a href="/" className="flex items-center gap-2">
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
                      ) : (
                        <span className="text-lg font-semibold tracking-tighter">
                          {settings?.siteName || "Logo"}
                        </span>
                      )}
                    </a>
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
                      <LinkButton key={item._key} link={item as SanityLink} />
                    ))}
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

const SubMenuLink = ({ item }: { item: SanityLink | SanityLinkIcon }) => {
  return (
    <Link
      href={item.href || "#"}
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
