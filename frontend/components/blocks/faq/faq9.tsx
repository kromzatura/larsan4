import SectionContainer from "@/components/ui/section-container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { PAGE_QUERYResult } from "@/sanity.types";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";
import { toText } from "@/lib/utils";

type FAQProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "faq-9" }
>;

export default function FAQ9({
  padding,
  faqs,
  locale = FALLBACK_LOCALE,
}: FAQProps & { locale?: SupportedLocale }) {
  return (
    <SectionContainer padding={padding}>
      {faqs && faqs?.length > 0 && (
        <Accordion type="multiple">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq._id}
              value={`item-${faq._id}`}
              className="mb-2 rounded-md border-b-0 bg-muted px-5 py-2 md:mb-4"
            >
              <AccordionTrigger className="text-left">
                {toText(faq.title)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <PortableTextRenderer value={faq.body || []} locale={locale} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </SectionContainer>
  );
}
