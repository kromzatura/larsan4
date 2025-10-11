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
import LocaleBridge from "./LocaleBridge";

export default async function MainLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const banner = await fetchSanityBanner();
  const { isEnabled: isDraft } = await draftMode();

  return (
    <InquiryProvider>
      <LocaleBridge>
        {(locale) => (
          <>
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
          </>
        )}
      </LocaleBridge>
    </InquiryProvider>
  );
}
