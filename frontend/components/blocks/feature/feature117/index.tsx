import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import Feature117Card from "./feature117-card";
import type { SupportedLocale } from "@/lib/i18n/config";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type Feature117 = Extract<Block, { _type: "feature-117" }>;

export default function Feature117({
  padding,
  columns,
  locale,
}: Feature117 & { locale?: SupportedLocale }) {
  return (
    <SectionContainer padding={padding}>
      {columns && columns?.length > 0 && (
        <div className="grid gap-5 xl:grid-cols-3">
          {columns?.map((column, index) => (
            <Feature117Card
              key={column._key}
              {...column}
              index={index}
              locale={locale}
            />
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
