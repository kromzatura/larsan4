import Navbar1 from "@/components/header/navbar-1";
import Footer2 from "@/components/footer/footer-2";
import Banner from "@/components/blocks/banner";
import Banner5 from "@/components/blocks/banner/banner5";
import { fetchSanityBanner } from "@/sanity/lib/fetch";
import { DisableDraftMode } from "@/components/disable-draft-mode";
import { VisualEditing } from "next-sanity";
import { draftMode } from "next/headers";
import { SanityLive } from "@/sanity/lib/live";
import { Toaster } from "@/components/ui/sonner";
import { InquiryProvider } from "@/components/inquiry/InquiryContext";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";

export default async function MainLayout({
  children,
  locale = FALLBACK_LOCALE,
}: {
  children: React.ReactNode;
  locale?: SupportedLocale;
}) {
  const banner = await fetchSanityBanner();

  return (
    <InquiryProvider>
      <Navbar1 locale={locale} />
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
      <SanityLive />
      {(await draftMode()).isEnabled && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}
      <Footer2 locale={locale} />
    </InquiryProvider>
  );
}
