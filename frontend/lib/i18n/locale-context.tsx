"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { DEFAULT_LOCALE, SupportedLocale } from "./config";

const LocaleContext = createContext<SupportedLocale>(DEFAULT_LOCALE);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: SupportedLocale;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): SupportedLocale {
  return useContext(LocaleContext);
}
