import { fetchSanitySettings } from "@/sanity/lib/fetch";
import { getNavigationItems } from "@/lib/getNavigationItems";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import PortableTextRenderer from "@/components/portable-text-renderer";

interface Footer2Props {
  className?: string;
}

export default async function Footer2({ className }: Footer2Props) {
  const settings = await fetchSanitySettings();
  const footerNavItems = await getNavigationItems("footer");
  const bottomNavItems = await getNavigationItems("footer-bottom");

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <Link
                href="/"
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
                ) : (
                  <span className="text-lg font-semibold tracking-tighter">
                    {settings?.siteName || "Logo"}
                  </span>
                )}
              </Link>
              <p className="mt-4 font-bold">{settings?.description}</p>
            </div>
            {footerNavItems?.map((section) => {
              if (section._type !== "link-group") return null;
              return (
                <div key={section._key}>
                  <h3 className="text-base mb-4 font-bold">{section.title}</h3>
                  <ul className="space-y-4 text-muted-foreground">
                    {section.links?.map((link) => {
                      return (
                        <li key={link._key}>
                          <Link
                            href={link.href || "#"}
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
                  <PortableTextRenderer value={settings.copyright} />
                </span>
              )}
            </div>
            <ul className="flex gap-4">
              {bottomNavItems?.map((link) => {
                if (link._type !== "link") return null;
                return (
                  <li key={link._key}>
                    <Link
                      href={link.href || "#"}
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
