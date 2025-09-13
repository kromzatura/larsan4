import { cn } from "@/lib/utils";
import { SVGProps, useId } from "react";

import SectionContainer from "@/components/ui/section-container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { PAGE_QUERYResult } from "@/sanity.types";

interface PlusSignsProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const PlusSigns = ({ className, ...props }: PlusSignsProps) => {
  const GAP = 16;
  const STROKE_WIDTH = 1;
  const PLUS_SIZE = 6;
  const id = useId();
  const patternId = `plus-pattern-${id}`;

  return (
    <svg width={GAP * 2} height={GAP * 2} className={className} {...props}>
      <defs>
        <pattern
          id={patternId}
          x="0"
          y="0"
          width={GAP}
          height={GAP}
          patternUnits="userSpaceOnUse"
        >
          <line
            x1={GAP / 2}
            y1={(GAP - PLUS_SIZE) / 2}
            x2={GAP / 2}
            y2={(GAP + PLUS_SIZE) / 2}
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
          />
          <line
            x1={(GAP - PLUS_SIZE) / 2}
            y1={GAP / 2}
            x2={(GAP + PLUS_SIZE) / 2}
            y2={GAP / 2}
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};

type FAQProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "faq-14" }
>;

export default function FAQ14({
  padding,
  title,
  description,
  sections,
}: FAQProps) {
  const titleSize = title?.size || "default";
  const titleWeight = title?.weight || "bold";
  const Element = title?.element || "h2";

  const titleSizeClasses = {
    small: "text-2xl md:text-3xl",
    default: "text-3xl md:text-4xl",
    large: "text-4xl md:text-6xl tracking-tight",
  }[titleSize];

  const titleWeightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  }[titleWeight];

  return (
    <SectionContainer padding={padding} className="relative overflow-hidden">
      <div className="text-center">
        {title && title.text && (
          <Element className={cn(titleSizeClasses, titleWeightClasses)}>
            {title.text}
          </Element>
        )}
        {description && (
          <p className="mt-4 text-2xl text-muted-foreground md:text-3xl">
            {description}
          </p>
        )}
      </div>
      {sections && sections?.length > 0 && (
        <div className="mx-auto mt-8 max-w-2xl space-y-12 md:mt-12 lg:mt-20">
          {sections.map((section) => (
            <Card key={section.title} className="border-hidden bg-muted">
              <CardHeader className="pb-0">
                <h3 className="border-b pb-4 font-mono text-sm font-medium tracking-widest text-accent-foreground uppercase">
                  {section.title}
                </h3>
              </CardHeader>
              <CardContent>
                {section.faqs && section.faqs?.length > 0 && (
                  <Accordion type="single" collapsible className="w-full">
                    {section.faqs.map((faq, i) => (
                      <AccordionItem
                        key={faq._id}
                        value={`item-${faq._id}`}
                        className="border-b border-muted last:border-0"
                      >
                        <AccordionTrigger className="text-start text-base font-medium hover:no-underline">
                          {faq.title}
                        </AccordionTrigger>
                        <AccordionContent className="text-base font-medium text-muted-foreground">
                          <PortableTextRenderer value={faq.body || []} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <div className="absolute -inset-40 z-[-1] [mask-image:radial-gradient(circle_at_center,black_0%,black_20%,transparent_75%)]">
        <PlusSigns className="h-full w-full text-foreground/[0.05]" />
      </div>
    </SectionContainer>
  );
}
