import { NextResponse, type NextRequest } from "next/server";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/lib/i18n/config";

function hasSupportedLocalePrefix(pathname: string): boolean {
  const m = pathname.match(/^\/([a-z]{2})(?:\/|$)/i);
  if (!m) return false;
  return (SUPPORTED_LOCALES as readonly string[]).includes(m[1].toLowerCase());
}

export function middleware(req: NextRequest) {
  const { nextUrl, method } = req;
  const { pathname } = nextUrl;

  // Only consider safe idempotent requests for redirect
  if (method !== "GET" && method !== "HEAD") return NextResponse.next();

  // Already localized: forward the detected locale to the app via a request header
  if (hasSupportedLocalePrefix(pathname)) {
    const m = pathname.match(/^\/([a-z]{2})(?:\/|$)/i);
    const locale = (m?.[1] || "").toLowerCase();
    const headers = new Headers(req.headers);
    headers.set("x-locale", locale);
    return NextResponse.next({ request: { headers } });
  }

  // Redirect root and any non-prefixed path to DEFAULT_LOCALE
  const url = nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.redirect(url);
}

// Exclude assets, API, and obvious static files
export const config = {
  matcher: [
    "/((?!_next/|api/|.*\\..*|sitemap\\.xml|robots\\.txt|site\\.webmanifest|favicon\\.ico).*)",
  ],
};
