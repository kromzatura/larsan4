import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/i18n/config";
import { GoogleAnalytics } from "@next/third-parties/google";
import { headers } from "next/headers";
import type { Metadata } from "next";

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

// Site-wide default metadata. Child routes/pages merge/override this.
export const metadata: Metadata = {
  title: {
    template: "%s | LAR Group",
    default: "LAR Group | Premium Agricultural Ingredients",
  },
  description:
    "Betrek premium agrarische ingrediënten met LAR Group. Zorg voor kwaliteit, veiligheid en duurzaamheid.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Derive locale from the current pathname (e.g., /en/..., /nl/..., with or without trailing slash)
  // Fallback to DEFAULT_LOCALE when no 2-letter segment is present
  const h = await headers();
  const pathname = h.get("next-url") ?? h.get("Next-Url") ?? "";
  const langMatch = pathname.match(/^\/([a-z]{2})/);
  const extracted = (langMatch?.[1] ?? DEFAULT_LOCALE).toLowerCase();
  const locale = (SUPPORTED_LOCALES as readonly string[]).includes(extracted)
    ? extracted
    : DEFAULT_LOCALE;
  return (
    <html lang={locale} suppressHydrationWarning>
      <link rel="icon" href="/favicon.ico" />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased overscroll-none flex flex-col",
          fontSans.variable
        )}
      >
        {/* Google Analytics – loads once globally for all pages */}
        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GA_ID || "G-Z73RV8ZXQV"}
        />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
