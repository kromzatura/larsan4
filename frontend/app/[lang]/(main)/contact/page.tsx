import { Mail, MapPin, MessagesSquare, Phone } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { fetchSanityContact } from "@/sanity/lib/fetch";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { normalizeLocale } from "@/lib/i18n/routing";
import { Link as LinkType } from "@/sanity.types";
import type { InquiryItem } from "@/lib/inquiry";
import ContactInquiryWrapper from "@/components/inquiry/contact-inquiry-wrapper";
import type { LangAsyncPageProps } from "@/lib/types/next";

export async function generateMetadata(props: LangAsyncPageProps) {
  const resolved = props.params ? await props.params : undefined;
  const locale = normalizeLocale(resolved?.lang);
  const contact = await fetchSanityContact({ lang: locale });

  if (!contact) {
    notFound();
  }

  return generatePageMetadata({
    page: contact,
    slug: "contact",
    type: "page",
    locale,
  });
}

function parseInquiryParam(searchParams: {
  [key: string]: string | string[] | undefined;
}): InquiryItem[] {
  const raw = searchParams["inquiry"]; // may be string or array
  const encoded = Array.isArray(raw) ? raw[0] : raw;
  if (!encoded) return [];
  try {
    const decoded = decodeURIComponent(encoded);
    const parsed = JSON.parse(decoded);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((x) => x && typeof x.id === "string")
        .map((x) => ({
          id: x.id as string,
          name: typeof x.name === "string" ? x.name : null,
        }));
    }
  } catch {
    return [];
  }
  return [];
}

export default async function ContactPage(props: LangAsyncPageProps) {
  // Resolve locale from params to avoid i18n split-brain
  const resolvedParams = props.params ? await props.params : undefined;
  const locale = normalizeLocale(resolvedParams?.lang);

  const resolvedSearchParams = (await props.searchParams) || {};
  const inquiryItems = parseInquiryParam(resolvedSearchParams || {});

  // Fetch localized content
  const contact = await fetchSanityContact({ lang: locale });

  if (!contact) {
    notFound();
  }

  const getIcon = (icon: string | null) => {
    switch (icon) {
      case "mail":
        return <Mail className="mb-3 h-6 w-auto" />;
      case "messages":
        return <MessagesSquare className="mb-3 h-6 w-auto" />;
      case "mapPin":
        return <MapPin className="mb-3 h-6 w-auto" />;
      case "phone":
        return <Phone className="mb-3 h-6 w-auto" />;
      default:
        return null;
    }
  };

  return (
    <section className="py-16 xl:py-20">
      <div className="container">
        <div className="mb-14">
          {contact?.tagline && (
            <span className="text-sm font-semibold">{contact.tagline}</span>
          )}
          {contact?.title && (
            <h1 className="mt-1 mb-3 text-3xl font-serif font-semibold text-balance md:text-4xl">
              {contact.title}
            </h1>
          )}
          {contact?.description && (
            <p className="text-lg text-muted-foreground">
              {contact.description}
            </p>
          )}
        </div>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="grid gap-10 sm:grid-cols-2">
            {contact?.contactMethods?.map((method, index) => (
              <div
                key={index}
                className="flex flex-col rounded-lg border bg-card p-6 shadow-sm"
              >
                {method.icon && (
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {getIcon(method.icon)}
                  </div>
                )}
                {method.title && (
                  <p className="mb-2 text-base font-semibold tracking-tight">
                    {method.title}
                  </p>
                )}
                {method.description && (
                  <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                    {method.description}
                  </p>
                )}
                {method.link && (
                  <LinkButton
                    size="sm"
                    link={method.link as LinkType}
                    locale={locale}
                    className={
                      method.link.buttonVariant === "link"
                        ? "font-semibold text-sm p-0 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        : ""
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mx-auto flex w-full flex-col gap-6 rounded-lg border bg-card p-8 lg:max-w-[32rem] shadow-sm">
            {/* ContactInquiryWrapper does not currently accept styling override props; we style via inherited classes inside ContactForm */}
            <div className="space-y-6 [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:bg-background [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:shadow-sm [&_input]:transition [&_input]:focus-visible:outline-none [&_input]:focus-visible:ring-2 [&_input]:focus-visible:ring-ring [&_textarea]:w-full [&_textarea]:rounded-md [&_textarea]:border [&_textarea]:bg-background [&_textarea]:px-3 [&_textarea]:py-2 [&_textarea]:text-sm [&_textarea]:shadow-sm [&_textarea]:transition [&_textarea]:focus-visible:outline-none [&_textarea]:focus-visible:ring-2 [&_textarea]:focus-visible:ring-ring [&_button[type=submit]]:w-full">
              <ContactInquiryWrapper initialInquiryItems={inquiryItems} locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
