import { fetchSanityBanner, fetchSanitySettings } from "@/sanity/lib/fetch";
import { getNavigationItems } from "@/lib/getNavigationItems";
import { DisableDraftMode } from "@/components/disable-draft-mode";
import { VisualEditing } from "next-sanity";
import { draftMode } from "next/headers";
import { SanityLive } from "@/sanity/lib/live";
import { MainLayoutClientShell } from "./MainLayoutClientShell";
import { normalizeLocale } from "@/lib/i18n/routing";
import { headers } from "next/headers";

export default async function MainLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const hdrs = await headers();
  const paramsHeader = hdrs.get("x-nextjs-params");
  let locale: string | undefined;
  try {
    if (paramsHeader) {
      const parsed = JSON.parse(paramsHeader);
      locale = parsed?.lang;
    }
  } catch {}
  const lang = normalizeLocale(locale);
  // Fetch everything needed for the shell in parallel
  const [
    banner,
    settings,
    headerNav,
    headerAction,
    footerNav,
    footerBottomNav,
  ] = await Promise.all([
    fetchSanityBanner(),
    fetchSanitySettings({ lang }),
    getNavigationItems("header", lang),
    getNavigationItems("header-action", lang),
    getNavigationItems("footer", lang),
    getNavigationItems("footer-bottom", lang),
  ]);
  const { isEnabled: isDraftModeEnabled } = await draftMode();

  return (
    <>
      <MainLayoutClientShell
        banner={banner}
        settings={settings}
        headerNav={headerNav}
        headerAction={headerAction}
        footerNav={footerNav}
        footerBottomNav={footerBottomNav}
      >
        {children}
      </MainLayoutClientShell>
      <SanityLive />
      {isDraftModeEnabled && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}
    </>
  );
}
