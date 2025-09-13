import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="icon" href="/favicon.ico" />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased overscroll-none",
          fontSans.variable
        )}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
