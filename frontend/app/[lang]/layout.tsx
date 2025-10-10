import type { ReactNode } from "react";
import MainLayout from "../(main)/layout";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { normalizeLocale } from "@/lib/i18n/routing";

interface LangLayoutProps {
  children: ReactNode;
  params: {
    lang: string;
  };
}

export default function LangLayout({ children, params }: LangLayoutProps) {
  const locale = normalizeLocale(params.lang);

  return (
    <LocaleProvider locale={locale}>
      <MainLayout>{children}</MainLayout>
    </LocaleProvider>
  );
}
