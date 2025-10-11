import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import Feature66Card from "./feature66-card";
import type { SupportedLocale } from "@/lib/i18n/config";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type Feature66 = Extract<Block, { _type: "feature-66" }>;

export default function Feature66({ padding, columns, locale }: Feature66 & { locale?: SupportedLocale }) {
  return (
    <SectionContainer padding={padding}>
      {columns && columns?.length > 0 && (
        <div className="grid w-full grid-cols-1 gap-4 max-md:grid-rows-[1fr_1fr] md:grid-cols-2 lg:gap-6">
          {columns?.map((column) => (
            <Feature66Card key={column._key} {...column} locale={locale} />
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
