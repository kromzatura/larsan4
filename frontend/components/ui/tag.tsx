import { cn, toText } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/icon";

export default function Tag({
  title,
  iconVariant,
  type = "title",
  element = "div",
  className,
  large = false,
}: {
  title: string | unknown;
  iconVariant?: string;
  type?: "title" | "badge";
  element?: "div" | "h1" | "h2" | "h3" | "p";
  className?: string;
  large?: boolean;
}) {
  const TagElement = element;

  return (
    <TagElement
      className={cn(
        "inline-block leading-[0] text-muted-foreground font-normal",
        className,
        large ? "text-lg" : "text-sm"
      )}
    >
      {type === "title" ? (
        <span>{toText(title) || ""}</span>
      ) : (
        <Badge variant="outline">
          {iconVariant && (
            <Icon
              iconVariant={iconVariant || "none"}
              strokeWidth={1.5}
              size={4}
            />
          )}
          {toText(title) || ""}
        </Badge>
      )}
    </TagElement>
  );
}
