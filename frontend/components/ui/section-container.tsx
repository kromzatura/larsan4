import { cn } from "@/lib/utils";

import { SectionPadding } from "@/sanity.types";

interface SectionContainerProps {
  withContainer?: boolean;
  padding?: SectionPadding | null;
  children: React.ReactNode;
  className?: string;
}

export default function SectionContainer({
  withContainer = true,
  padding,
  children,
  className,
}: SectionContainerProps) {
  return (
    <div
      className={cn(
        withContainer ? "container" : undefined,
        padding?.top ? "pt-16 xl:pt-20" : undefined,
        padding?.bottom ? "pb-16 xl:pb-20" : undefined,
        className
      )}
    >
      {children}
    </div>
  );
}
