import { LocaleProvider } from "@/lib/i18n/locale-context";
import { normalizeLocale } from "@/lib/i18n/routing";
import type { LangAsyncLayoutProps } from "@/lib/types/next";
import MainLayoutShell from "./(main)/MainLayoutShell";
import { fetchSanitySettings } from "@/sanity/lib/fetch";
import { getNavigationItems } from "@/lib/getNavigationItems";
import { fetchTheme, themeToCssVars } from "@/sanity/lib/theme";

export default async function LangLayout({
  children,
  params,
}: LangAsyncLayoutProps) {
  const resolved = params ? await params : undefined;
  const locale = normalizeLocale(resolved?.lang);

  const [settings, headerNav, headerAction, footerNav, footerBottomNav, theme] =
    await Promise.all([
      fetchSanitySettings({ lang: locale }),
      getNavigationItems("header", locale),
      getNavigationItems("header-action", locale),
      getNavigationItems("footer", locale),
      getNavigationItems("footer-bottom", locale),
      fetchTheme({ lang: locale }),
    ]);

  return (
    <LocaleProvider locale={locale}>
      {theme ? <style suppressHydrationWarning>{themeToCssVars(theme)}</style> : null}
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
