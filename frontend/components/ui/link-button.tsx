import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Link as LinkType } from "@/sanity.types";

export function LinkButton({
  className,
  link,
  title,
  size = "lg",
  asDiv = false,
}: {
  className?: string;
  link: LinkType;
  title?: string;
  size?: "default" | "sm" | "lg" | "icon";
  asDiv?: boolean;
}) {
  return (
    <Button
      asChild
      variant={link?.buttonVariant}
      className={className}
      size={size}
    >
      {asDiv ? (
        <div>{link.title}</div>
      ) : (
        <Link
          href={link.href || "#"}
          title={title}
          target={link.target ? "_blank" : undefined}
          rel={link.target ? "noopener" : undefined}
        >
          {link.title}
        </Link>
      )}
    </Button>
  );
}
