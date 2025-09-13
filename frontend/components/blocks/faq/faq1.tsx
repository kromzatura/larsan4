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
  { _type: "faq-1" }
>;

export default function FAQ1({ padding, faqs }: FAQProps) {
  return (
    <SectionContainer padding={padding}>
      {faqs && faqs?.length > 0 && (
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((faq) => (
              <AccordionItem key={faq._id} value={`item-${faq._id}`}>
                <AccordionTrigger className="font-semibold hover:no-underline">
                  {faq.title}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <PortableTextRenderer value={faq.body || []} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </SectionContainer>
  );
}
