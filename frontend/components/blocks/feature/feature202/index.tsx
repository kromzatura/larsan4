import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import Feature202Card from "./feature202-card";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type Feature202 = Extract<Block, { _type: "feature-202" }>;

export default function Feature202({ padding, columns }: Feature202) {
  return (
    <SectionContainer padding={padding}>
      {columns && columns?.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-3">
          {columns?.map((column, index) => (
            <Feature202Card key={column._key} index={index} {...column} />
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
