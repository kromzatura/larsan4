import type { PreviewProps } from "sanity";
import { Flex } from "@sanity/ui";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Lightbulb } from "lucide-react";

export function AlertPreview(props: PreviewProps) {
  const title = (props.title || "").toString();
  const subtitle = props.subtitle?.toString();

  return (
    <Flex padding={3}>
      <Alert className="w-full">
        <Lightbulb className="h-4 w-4" />
        {title && <AlertTitle>{title}</AlertTitle>}
        {subtitle && <AlertDescription>{subtitle}</AlertDescription>}
      </Alert>
    </Flex>
  );
}
