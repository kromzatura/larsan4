"use client";

import { useLocale } from "@/lib/i18n/locale-context";
import type { SupportedLocale } from "@/lib/i18n/config";

export default function LocaleBridge({
  children,
}: {
  children: (locale: SupportedLocale) => React.ReactNode;
}) {
  const locale = useLocale();
  return <>{children(locale)}</>;
}
