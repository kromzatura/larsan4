import SectionContainer from "@/components/ui/section-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PAGE_QUERYResult } from "@/sanity.types";
import { fetchSanityTeam } from "@/sanity/lib/fetch";

type Team1Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "team-1" }
>;

export default async function Team1({ padding }: Team1Props) {
  const team = await fetchSanityTeam();

  return (
    <SectionContainer padding={padding}>
      {team && team?.length > 0 && (
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div key={member._id} className="flex flex-col items-center">
              <Avatar className="mb-4 size-20 border md:mb-5 lg:size-24">
                <AvatarImage src={member.image?.asset?.url || ""} />
                <AvatarFallback>{member.name}</AvatarFallback>
              </Avatar>
              <p className="text-center font-medium">{member.name}</p>
              <p className="text-center text-muted-foreground">
                {member.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
