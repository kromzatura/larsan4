import { cn } from "@/lib/utils";
import Icon from "@/components/icon";
import SectionContainer from "@/components/ui/section-container";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PAGE_QUERYResult } from "@/sanity.types";

type Logos2Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "logos-2" }
>;

const Logos2 = ({
  padding,
  title,
  description,
  links,
  images,
}: Logos2Props) => {
  return (
    <SectionContainer padding={padding}>
      <div className="grid overflow-hidden rounded-xl border border-border md:grid-cols-2">
        <div className="my-auto px-6 py-10 sm:px-10 sm:py-12 lg:p-16">
          <div className="w-full md:max-w-md">
            {title && (
              <h2 className="mb-4 text-2xl font-semibold lg:text-3xl">
                {title}
              </h2>
            )}
            {description && <p className="text-lg">{description}</p>}
            {links && links.length > 0 && (
              <div className="mt-6 flex gap-3">
                {links.map((link) => (
                  <Link
                    key={link._key}
                    href={link.href || "#"}
                    target={link.target ? "_blank" : undefined}
                    rel={link.target ? "noopener" : undefined}
                    className={cn(
                      buttonVariants({
                        variant: link.buttonVariant || "default",
                      }),
                      "w-full md:w-fit"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        iconVariant={link.iconVariant || "none"}
                        className="ml-2 h-4 transition-transform group-hover:translate-x-0.5"
                      />
                      {link.title}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        {images && images.length > 0 && (
          <div className="grid grid-cols-3 border-t border-border md:border-t-0 md:border-l">
            {images.map((image) => (
              <div
                key={image._key}
                className="-mb-px flex items-center justify-center border-r border-b border-border p-5 sm:p-6 [&:nth-child(3n)]:border-r-0"
              >
                <Image
                  key={image._key}
                  src={urlFor(image).url()}
                  alt={image.alt || ""}
                  placeholder={
                    image?.asset?.metadata?.lqip &&
                    image?.asset?.mimeType !== "image/svg+xml"
                      ? "blur"
                      : undefined
                  }
                  blurDataURL={image?.asset?.metadata?.lqip || ""}
                  width={96}
                  height={96}
                  className="size-12 object-cover object-center sm:size-16 lg:size-24"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
};

export default Logos2;
