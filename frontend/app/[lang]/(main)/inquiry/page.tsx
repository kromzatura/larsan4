import InquiryPageClient from "./pageClient";
import type { LangAsyncPageProps } from "@/lib/types/next";
import { normalizeLocale } from "@/lib/i18n/routing";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/i18n/config";

// Use centralized metadata to ensure canonical, self hreflang and x-default are present
export async function generateMetadata(props: LangAsyncPageProps) {
  const resolved = props.params ? await props.params : undefined;
  const locale = normalizeLocale(resolved?.lang);

  const translations = (SUPPORTED_LOCALES as readonly SupportedLocale[]).map(
    (lang) => ({ lang, slug: "inquiry" })
  );

  return generatePageMetadata({
    page: {
      meta: { title: "Inquiry", noindex: true },
      allTranslations: translations,
    },
    slug: "inquiry",
    type: "page",
    locale,
  });
}

export default function InquiryPage() {
  return <InquiryPageClient />;
}
