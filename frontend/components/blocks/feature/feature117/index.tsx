import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import Feature117Card from "./feature117-card";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type Feature117 = Extract<Block, { _type: "feature-117" }>;

export default function Feature117({ padding, columns }: Feature117) {
  return (
    <SectionContainer padding={padding}>
      {columns && columns?.length > 0 && (
        <div className="grid gap-5 xl:grid-cols-3">
          {columns?.map((column, index) => (
            <Feature117Card key={column._key} {...column} index={index} />
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
