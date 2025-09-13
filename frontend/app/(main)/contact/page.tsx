import { Mail, MapPin, MessagesSquare, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { LinkButton } from "@/components/ui/link-button";
import { submitContactForm } from "@/app/actions/contact-form";
import { fetchSanityContact } from "@/sanity/lib/fetch";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { Link as LinkType } from "@/sanity.types";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const contact = await fetchSanityContact();

  if (!contact) {
    notFound();
  }

  return generatePageMetadata({
    page: contact,
    slug: "contact",
    type: "page",
  });
}

export default async function ContactPage() {
  const contact = await fetchSanityContact();

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
            <h1 className="mt-1 mb-3 text-3xl font-semibold text-balance md:text-4xl">
              {contact.title}
            </h1>
          )}
          {contact?.description && (
            <p className="text-lg text-muted-foreground">
              {contact.description}
            </p>
          )}
        </div>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="grid gap-10 sm:grid-cols-2">
            {contact?.contactMethods?.map((method, index) => (
              <div key={index}>
                {method.icon && getIcon(method.icon)}
                {method.title && (
                  <p className="mb-2 text-lg font-semibold">{method.title}</p>
                )}
                {method.description && (
                  <p className="mb-3 text-muted-foreground">
                    {method.description}
                  </p>
                )}
                {method.link && (
                  <LinkButton
                    size="sm"
                    link={method.link as LinkType}
                    className={
                      method.link.buttonVariant === "link"
                        ? "font-semibold text-base p-0"
                        : ""
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mx-auto flex w-full flex-col gap-6 rounded-lg bg-muted p-10 lg:max-w-[29rem]">
            <ContactForm onSubmit={submitContactForm} />
          </div>
        </div>
      </div>
    </section>
  );
}
