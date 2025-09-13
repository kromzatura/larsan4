import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import Feature15Card from "./feature15-card";
import { cn } from "@/lib/utils";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type Feature15 = Extract<Block, { _type: "feature-15" }>;
type FeatureColumn = NonNullable<NonNullable<Feature15["columns"]>[number]>;

const componentMap: {
  [K in FeatureColumn["_type"]]: React.ComponentType<
    Extract<FeatureColumn, { _type: K }>
  >;
} = {
  "feature-15-card": Feature15Card,
};

export default function Feature15({
  padding,
  columns,
  gridColumns,
}: Feature15) {
  return (
    <SectionContainer padding={padding}>
      {columns && columns?.length > 0 && (
        <div
          className={cn(
            "mx-auto mt-20 grid gap-6",
            gridColumns === "grid-cols-2" ? "max-w-5xl" : undefined,
            `lg:${gridColumns}`
          )}
        >
          {columns?.map((column) => {
            const Component = componentMap[column._type];
            if (!Component) {
              // Fallback for development/debugging of new component types
              console.warn(
                `No component implemented for column type: ${column._type}`
              );
              return <div data-type={column._type} key={column._key} />;
            }
            return <Component {...(column as any)} key={column._key} />;
          })}
        </div>
      )}
    </SectionContainer>
  );
}
