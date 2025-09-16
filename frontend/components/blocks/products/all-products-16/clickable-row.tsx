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
        "cursor-pointer outline-none focus-visible:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      data-href={href}
    >
      {children}
    </tr>
  );
}
