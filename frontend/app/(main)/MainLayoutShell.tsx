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
import { FALLBACK_LOCALE } from "@/lib/i18n/config";
// import LocaleBridge from "./LocaleBridge"; // Commented out as it's no longer needed

export default async function MainLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  // Consume locale from context (provided by app/[lang]/layout)
  // Server components cannot use useContext directly; read from a client shim.
  // We'll infer locale on the server via a prop from a small client bridge.
  const locale = FALLBACK_LOCALE;
  const banner = await fetchSanityBanner();
  const { isEnabled: isDraft } = await draftMode();

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
      {isDraft && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}
      <Footer2 locale={locale} />
    </InquiryProvider>
  );
}