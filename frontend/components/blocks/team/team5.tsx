import { cn } from "@/lib/utils";
import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import { fetchSanityTeam } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

type Team5Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "team-5" }
>;

export default async function Team5({ padding }: Team5Props) {
  const team = await fetchSanityTeam();

  return (
    <SectionContainer padding={padding}>
      {team && team?.length > 0 && (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div key={member._id} className="flex flex-col items-center">
              <div className="mb-4 aspect-square w-full overflow-clip bg-accent md:mb-5">
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
              <p className="w-full text-left font-medium">{member.name}</p>
              <p className="w-full text-left text-muted-foreground">
                {member.title}
              </p>
              {member.description && (
                <p className="w-full py-3 text-sm text-muted-foreground">
                  {member.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
