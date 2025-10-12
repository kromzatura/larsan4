import SectionContainer from "@/components/ui/section-container";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { PAGE_QUERYResult } from "@/sanity.types";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";

type FAQProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "faq-5" }
>;

export default function FAQ5({
  padding,
  faqs,
  locale = FALLBACK_LOCALE,
}: FAQProps & { locale?: SupportedLocale }) {
  return (
    <SectionContainer padding={padding}>
      {faqs && faqs?.length > 0 && (
        <div className="max-w-2xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={faq._id} className="mb-8 flex gap-4">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-secondary font-mono text-xs text-primary">
                {index + 1}
              </span>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium text-base">{faq.title}</h3>
                </div>
                <div className="text-sm text-muted-foreground">
                  <PortableTextRenderer
                    value={faq.body || []}
                    locale={locale}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
