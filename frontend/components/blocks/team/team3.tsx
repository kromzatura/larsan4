import { cn } from "@/lib/utils";
import SectionContainer from "@/components/ui/section-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Icon from "@/components/icon";
import { buttonVariants } from "@/components/ui/button";
import { PAGE_QUERYResult } from "@/sanity.types";
import { fetchSanityTeam } from "@/sanity/lib/fetch";

type Team3Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "team-3" }
>;

export default async function Team3({ padding }: Team3Props) {
  const team = await fetchSanityTeam();

  return (
    <SectionContainer padding={padding}>
      {team && team?.length > 0 && (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div
              key={member._id}
              className="flex flex-col items-center bg-accent p-8"
            >
              <Avatar className="mb-4 size-20 md:mb-5 lg:size-24">
                <AvatarImage src={member.image?.asset?.url || ""} />
                <AvatarFallback>{member.name}</AvatarFallback>
              </Avatar>
              <p className="text-center font-medium">{member.name}</p>
              <p className="text-center text-muted-foreground">
                {member.title}
              </p>
              {member.description && (
                <p className="py-3 text-center text-sm text-muted-foreground">
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
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
