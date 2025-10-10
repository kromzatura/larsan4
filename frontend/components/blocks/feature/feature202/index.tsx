import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";
import Feature202Card from "./feature202-card";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type Feature202 = Extract<Block, { _type: "feature-202" }>;

export default function Feature202({
  padding,
  columns,
  locale = FALLBACK_LOCALE,
}: Feature202 & { locale?: SupportedLocale }) {
  return (
    <SectionContainer padding={padding}>
      {columns && columns?.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-3">
          {columns?.map((column, index) => (
            <Feature202Card
              key={column._key}
              index={index}
              locale={locale}
              {...column}
            />
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
