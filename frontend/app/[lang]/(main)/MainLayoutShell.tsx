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
}: {
  children: React.ReactNode;
  settings: SETTINGS_QUERYResult;
  headerNav: NavigationItem[];
  headerAction: NavigationItem[];
  footerNav: NavigationItem[];
  footerBottomNav: NavigationItem[];
}) {
  // Always fetch banner (not locale-dependent in our setup)
  const banner = await fetchSanityBanner();
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
