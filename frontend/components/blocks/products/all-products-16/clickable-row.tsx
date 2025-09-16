"use client";

import { useRouter } from "next/navigation";
import { PropsWithChildren, MouseEvent, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

type ClickableRowProps = PropsWithChildren<{
  href: string;
  className?: string;
}>;

export default function ClickableRow({
  href,
  className,
  children,
}: ClickableRowProps) {
  const router = useRouter();

  function isInteractive(el: EventTarget | null) {
    if (!(el instanceof HTMLElement)) return false;
    return Boolean(
      el.closest(
        "a, button, [role=button], input, select, textarea, [contenteditable=true]"
      )
    );
  }

  const onClick = (e: MouseEvent<HTMLTableRowElement>) => {
    if (isInteractive(e.target)) return; // let native interactions happen
    router.push(href);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTableRowElement>) => {
    if (isInteractive(e.target)) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(href);
    }
  };

  return (
    <tr
      role="link"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={cn(
        "cursor-pointer outline-none transition-colors focus-visible:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring",
        // row ambiance
        "odd:bg-muted/20 hover:bg-muted/40",
        // separation and subtle depth
        "border-t last:border-b border-border hover:shadow-sm",
        // subtle left indicator on hover/focus to aid scanning
        "hover:[&>td:first-child]:before:absolute hover:[&>td:first-child]:before:left-0 hover:[&>td:first-child]:before:top-0 hover:[&>td:first-child]:before:h-full hover:[&>td:first-child]:before:w-0.5 hover:[&>td:first-child]:before:bg-ring",
        "focus-visible:[&>td:first-child]:before:absolute focus-visible:[&>td:first-child]:before:left-0 focus-visible:[&>td:first-child]:before:top-0 focus-visible:[&>td:first-child]:before:h-full focus-visible:[&>td:first-child]:before:w-0.5 focus-visible:[&>td:first-child]:before:bg-ring",
        className
      )}
      data-href={href}
    >
      {children}
    </tr>
  );
}
