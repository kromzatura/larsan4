"use client";

import Navbar1 from "@/components/header/navbar-1";
import Footer2 from "@/components/footer/footer-2";
import Banner from "@/components/blocks/banner";
import Banner5 from "@/components/blocks/banner/banner5";
import { Toaster } from "@/components/ui/sonner";
import { InquiryProvider } from "@/components/inquiry/InquiryContext";
import { useLocale } from "@/lib/i18n/locale-context";
import type { BANNER_QUERYResult, SETTINGS_QUERYResult } from "@/sanity.types";
import type { NavigationItem } from "@/lib/getNavigationItems";

export function MainLayoutClientShell({
  children,
  banner,
  settings,
  headerNav,
  headerAction,
  footerNav,
  footerBottomNav,
}: {
  children: React.ReactNode;
  banner: BANNER_QUERYResult;
  settings: SETTINGS_QUERYResult;
  headerNav: NavigationItem[];
  headerAction: NavigationItem[];
  footerNav: NavigationItem[];
  footerBottomNav: NavigationItem[];
}) {
  const locale = useLocale();

  return (
    <InquiryProvider>
      <Navbar1
        locale={locale}
        settings={settings}
        navigationItems={headerNav}
        actionItems={headerAction}
      />
      {banner && banner.length > 0 && (
        <Banner
          data={banner[0]}
          component={Banner5}
          bannerId="banner5"
          locale={locale}
        />
      )}
      <main>{children}</main>
      <Toaster position="top-right" />
      <Footer2
        locale={locale}
        settings={settings}
        footerNavItems={footerNav}
        bottomNavItems={footerBottomNav}
      />
    </InquiryProvider>
  );
}
