import SectionContainer from "@/components/ui/section-container";

import { PAGE_QUERYResult } from "@/sanity.types";
import { fetchSanityChangelogs } from "@/sanity/lib/fetch";
import Changelog5 from "./changelog5";
type Changelogs5Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "changelog-5" }
>;

export default async function Changelog5Main({
  padding,
  title,
  secondaryTitle,
  links,
}: Changelogs5Props) {
  const changelogs = await fetchSanityChangelogs();

  return (
    <SectionContainer padding={padding} withContainer={false}>
      <Changelog5
        title={title}
        secondaryTitle={secondaryTitle}
        links={links}
        changelogs={changelogs}
      />
    </SectionContainer>
  );
}
