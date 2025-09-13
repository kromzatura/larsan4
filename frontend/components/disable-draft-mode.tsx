"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

import { useDraftModeEnvironment } from "next-sanity/hooks";

export function DisableDraftMode() {
  const environment = useDraftModeEnvironment();
  const searchParams = useSearchParams();
  const isIframe = searchParams.get("iframe") === "true";

  // Only show the disable draft mode button when outside of Presentation Tool
  if (environment !== "live" && environment !== "unknown") {
    return null;
  }

  // Don't show the button when in iframe mode
  if (isIframe) {
    return null;
  }

  return (
    <a
      className={cn(
        buttonVariants({
          size: "lg",
        }),
        "fixed bottom-4 right-4"
      )}
      href="/api/draft-mode/disable"
    >
      Disable Draft Mode
    </a>
  );
}
