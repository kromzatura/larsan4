import { cn } from "@/lib/utils";
import SectionContainer from "@/components/ui/section-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Icon from "@/components/icon";
import { buttonVariants } from "@/components/ui/button";
import { PAGE_QUERYResult } from "@/sanity.types";
import { fetchSanityTeam } from "@/sanity/lib/fetch";

type Team2Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "team-2" }
>;

export default async function Team2({ padding }: Team2Props) {
  const team = await fetchSanityTeam();

  return (
    <SectionContainer padding={padding}>
      {team && team?.length > 0 && (
        <div className="grid gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div key={member._id} className="flex flex-col items-start">
              <Avatar className="mb-4 size-20 md:mb-5 lg:size-24">
                <AvatarImage src={member.image?.asset?.url || ""} />
                <AvatarFallback>{member.name}</AvatarFallback>
              </Avatar>
              <p className="font-medium">{member.name}</p>
              <p className="text-muted-foreground">{member.title}</p>
              {member.description && (
                <p className="py-3 text-sm text-muted-foreground">
                  {member.description}
                </p>
              )}
              {member.links && member.links?.length > 0 && (
                <div className="mt-2 flex gap-4">
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
                        "!p-0 hover:bg-transparent h-5"
                      )}
                      title={link.title || ""}
                    >
                      <Icon
                        className="text-muted-foreground"
                        iconVariant={link?.iconVariant || "none"}
                        strokeWidth={2}
                        size={5}
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
