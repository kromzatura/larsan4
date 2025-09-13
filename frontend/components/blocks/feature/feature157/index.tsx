import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import Feature157Card from "./feature157-card";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type Feature157 = Extract<Block, { _type: "feature-157" }>;

export default function Feature157({ padding, columns }: Feature157) {
  return (
    <SectionContainer padding={padding}>
      {columns && columns?.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
          {columns?.map((column) => (
            <Feature157Card key={column._key} {...column} />
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
