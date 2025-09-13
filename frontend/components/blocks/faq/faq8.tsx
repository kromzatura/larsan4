import SectionContainer from "@/components/ui/section-container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { PAGE_QUERYResult } from "@/sanity.types";

type FAQProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "faq-8" }
>;

export default function FAQ8({ padding, sections }: FAQProps) {
  return (
    <SectionContainer padding={padding}>
      {sections && sections?.length > 0 && (
        <div>
          {sections.map((section, index) => (
            <div
              key={section._key}
              className="grid gap-4 border-t pt-4 md:grid-cols-3 md:gap-10"
            >
              <h3 className="text-xl font-medium">{section.title}</h3>
              <Accordion type="multiple" className="md:col-span-2">
                {section.faqs?.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <PortableTextRenderer value={faq.body || []} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
