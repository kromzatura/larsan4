import MainLayout from "../(main)/layout";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { normalizeLocale } from "@/lib/i18n/routing";
import type { LangAsyncLayoutProps } from "@/lib/types/next";

export default async function LangLayout({
  children,
  params,
}: LangAsyncLayoutProps) {
  const resolved = params ? await params : undefined;
  const locale = normalizeLocale(resolved?.lang);

  return (
    <LocaleProvider locale={locale}>
      <MainLayout locale={locale}>{children}</MainLayout>
    </LocaleProvider>
  );
}
