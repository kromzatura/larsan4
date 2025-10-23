"use client";

import { TranslationProvider } from "@/lib/contexts/translation-context";
import { DOC_TYPES } from "@/lib/docTypes";

type Props = {
  children: React.ReactNode;
  allTranslations?: Array<{ lang: string; slug: string }> | null;
  docType: (typeof DOC_TYPES)[keyof typeof DOC_TYPES];
};

export function PageTranslationProvider({
  children,
  allTranslations,
  docType,
}: Props) {
  return (
    <TranslationProvider value={{ allTranslations, currentDocType: docType }}>
      {children}
    </TranslationProvider>
  );
}
