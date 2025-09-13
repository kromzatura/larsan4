import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import FeatureContent from "./feature-content";
import FeatureImage from "./feature-image";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type Feature1 = Extract<Block, { _type: "feature-1" }>;
type FeatureColumn = NonNullable<NonNullable<Feature1["columns"]>[number]>;

const componentMap: {
  [K in FeatureColumn["_type"]]: React.ComponentType<
    Extract<FeatureColumn, { _type: K }>
  >;
} = {
  "feature-content": FeatureContent,
  "feature-image": FeatureImage,
};

export default function Feature1({ padding, columns }: Feature1) {
  return (
    <SectionContainer padding={padding}>
      {columns && columns?.length > 0 && (
        <div className="grid items-center gap-8 lg:gap-16 lg:grid-cols-2">
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
