import { LocaleProvider } from "@/lib/i18n/locale-context";
import { normalizeLocale } from "@/lib/i18n/routing";
import type { LangAsyncLayoutProps } from "@/lib/types/next";
import MainLayoutShell from "./(main)/MainLayoutShell";
import { fetchSanitySettings } from "@/sanity/lib/fetch";
import { getNavigationItems } from "@/lib/getNavigationItems";

export default async function LangLayout({
  children,
  params,
}: LangAsyncLayoutProps) {
  const resolved = params ? await params : undefined;
  const locale = normalizeLocale(resolved?.lang);

  const [settings, headerNav, headerAction, footerNav, footerBottomNav] =
    await Promise.all([
      fetchSanitySettings({ lang: locale }),
      getNavigationItems("header", locale),
      getNavigationItems("header-action", locale),
      getNavigationItems("footer", locale),
      getNavigationItems("footer-bottom", locale),
    ]);

  return (
    <LocaleProvider locale={locale}>
      <MainLayoutShell
        settings={settings}
        headerNav={headerNav}
        headerAction={headerAction}
        footerNav={footerNav}
        footerBottomNav={footerBottomNav}
      >
        {children}
      </MainLayoutShell>
    </LocaleProvider>
  );
}
