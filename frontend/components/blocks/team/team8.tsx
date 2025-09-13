import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import { fetchSanityTeam } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/icon";
import { buttonVariants } from "@/components/ui/button";

type Team8Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "team-8" }
>;

export default async function Team8({ padding }: Team8Props) {
  const team = await fetchSanityTeam();

  return (
    <SectionContainer padding={padding} className="overflow-hidden">
      {team && team?.length > 0 && (
        <Carousel>
          <div className="mt-4 hidden items-center justify-end gap-4 md:flex">
            <CarouselPrevious className="static size-11 translate-x-0 translate-y-0 rounded-full" />
            <CarouselNext className="static size-11 translate-x-0 translate-y-0 rounded-full" />
          </div>
          <div className="mt-16 [&>div[data-slot=carousel-content]]:overflow-visible">
            <CarouselContent className="max-w-[min(calc(100vw-4rem),24rem)] select-none">
              {team.map((member) => (
                <CarouselItem key={member._id} className="max-w-72">
                  <div className="rounded-2xl border border-border bg-background p-7 text-center">
                    {member.image && member.image.asset?._id && (
                      <Image
                        src={urlFor(member.image).url()}
                        alt={member.image.alt || ""}
                        placeholder={
                          member.image?.asset?.metadata?.lqip
                            ? "blur"
                            : undefined
                        }
                        blurDataURL={member.image?.asset?.metadata?.lqip || ""}
                        className="mx-auto size-20 rounded-full border border-border"
                        sizes="(min-width: 1024px) 25vw, 100vw"
                        width={
                          member.image.asset?.metadata?.dimensions?.width || 350
                        }
                        height={
                          member.image.asset?.metadata?.dimensions?.height ||
                          350
                        }
                        quality={100}
                      />
                    )}
                    <div className="mt-6 flex flex-col justify-center">
                      <p className="text-lg font-medium text-primary">
                        {member.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {member.title}
                      </p>
                    </div>
                    <Separator className="my-6 bg-gradient-to-r from-background via-border to-background" />
                    {member.links && member.links?.length > 0 && (
                      <div className="my-2 flex items-start justify-center gap-4">
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
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
        </Carousel>
      )}
    </SectionContainer>
  );
}
