import { cn } from "@/lib/utils";
import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import { fetchSanityTeam } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/icon";
import { buttonVariants } from "@/components/ui/button";

type Team6Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "team-6" }
>;

export default async function Team6({ padding }: Team6Props) {
  const team = await fetchSanityTeam();

  return (
    <SectionContainer padding={padding}>
      {team && team?.length > 0 && (
        <div className="grid gap-x-12 gap-y-8 lg:grid-cols-2">
          {team.map((member) => (
            <div key={member._id} className="flex flex-col sm:flex-row">
              <div className="mb-4 aspect-square w-full shrink-0 overflow-clip bg-accent sm:mr-5 sm:mb-0 sm:size-48">
                {member.image && member.image.asset?._id && (
                  <Image
                    src={urlFor(member.image).url()}
                    alt={member.image.alt || ""}
                    placeholder={
                      member.image?.asset?.metadata?.lqip ? "blur" : undefined
                    }
                    blurDataURL={member.image?.asset?.metadata?.lqip || ""}
                    className="aspect-square w-full object-cover"
                    sizes="(min-width: 1024px) 25vw, 100vw"
                    width={
                      member.image.asset?.metadata?.dimensions?.width || 350
                    }
                    height={
                      member.image.asset?.metadata?.dimensions?.height || 350
                    }
                    quality={100}
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col items-start">
                <p className="w-full text-left font-medium">{member.name}</p>
                <p className="w-full text-left text-muted-foreground">
                  {member.title}
                </p>
                {member.description && (
                  <p className="w-full py-2 text-sm text-muted-foreground">
                    {member.description}
                  </p>
                )}
                {member.links && member.links?.length > 0 && (
                  <div className="my-2 flex items-start gap-4">
                    {member.links.map((link) => (
                      <Link
                        key={link._key}
                        href={link.href || "#"}
                        target={link.target ? "_blank" : undefined}
                        rel={link.target ? "noopener" : undefined}
                        className={cn(
                          buttonVariants({
                            variant: link.buttonVariant || "default",
                          }),
                          "!p-0 hover:bg-transparent h-4"
                        )}
                        title={link.title || ""}
                      >
                        <Icon
                          className="text-muted-foreground"
                          iconVariant={link?.iconVariant || "none"}
                          strokeWidth={2}
                          size={4}
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
