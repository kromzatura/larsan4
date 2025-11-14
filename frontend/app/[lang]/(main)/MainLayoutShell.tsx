import { fetchSanityBanner } from "@/sanity/lib/fetch";
import { DisableDraftMode } from "@/components/disable-draft-mode";
import { VisualEditing } from "next-sanity";
import { draftMode } from "next/headers";
import { SanityLive } from "@/sanity/lib/live";
import { MainLayoutClientShell } from "./MainLayoutClientShell";
import type { SETTINGS_QUERYResult } from "@/sanity.types";
import type { NavigationItem } from "@/lib/getNavigationItems";

export default async function MainLayoutShell({
  children,
  settings,
  headerNav,
  headerAction,
  footerNav,
  footerBottomNav,
  locale,
}: {
  children: React.ReactNode;
  settings: SETTINGS_QUERYResult;
  headerNav: NavigationItem[];
  headerAction: NavigationItem[];
  footerNav: NavigationItem[];
  footerBottomNav: NavigationItem[];
  locale: string;
}) {
  // Fetch locale-specific banner
  const banner = await fetchSanityBanner({ lang: locale as any });
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
