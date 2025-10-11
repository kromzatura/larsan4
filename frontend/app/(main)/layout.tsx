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

// Default export must conform to Next.js layout typing: only accepts { children }
export default function GroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
