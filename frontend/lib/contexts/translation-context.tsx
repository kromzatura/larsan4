"use client";

import { createContext, useContext } from "react";

type TranslationContextValue = {
  allTranslations?: Array<{ lang: string; slug: string }> | null;
  currentDocType?: string;
};

const TranslationContext = createContext<TranslationContextValue>({
  allTranslations: null,
  currentDocType: undefined,
});

export function TranslationProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: TranslationContextValue;
}) {
  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations() {
  return useContext(TranslationContext);
}
