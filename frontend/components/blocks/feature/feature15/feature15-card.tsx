import { PAGE_QUERYResult } from "@/sanity.types";
import Icon from "@/components/icon";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type Feature15 = Extract<Block, { _type: "feature-15" }>;
type Feature15CardBase = Extract<
  NonNullable<Feature15["columns"]>[number],
  { _type: "feature-15-card" }
>;

export interface Feature15CardProps extends Feature15CardBase {
  invert?: boolean;
}

export default function Feature15Card({
  iconVariant,
  title,
  description,
  invert,
}: Feature15CardProps) {
  return (
    <div
      className={
        "flex flex-col justify-between rounded-lg bg-card border p-6 md:min-h-[300px] md:p-8 " +
        (invert ? "border-primary-foreground/20" : "")
      }
    >
      <span className="mb-6 flex size-11 items-center justify-center rounded-full bg-accent">
        <Icon iconVariant={iconVariant || "none"} strokeWidth={2} size={6} />
      </span>
      <div>
        <h3 className="text-lg font-semibold md:text-2xl">{title}</h3>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
