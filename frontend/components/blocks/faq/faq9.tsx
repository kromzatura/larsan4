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
  { _type: "faq-9" }
>;

export default function FAQ9({ padding, faqs }: FAQProps) {
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
                {faq.title}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <PortableTextRenderer value={faq.body || []} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </SectionContainer>
  );
}
