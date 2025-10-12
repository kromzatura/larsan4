import { FALLBACK_LOCALE, SUPPORTED_LOCALES, SupportedLocale } from "./config";

export const LOCALE_COOKIE_NAME = "next-lang";
export const LOCALE_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

export function isSupportedLocale(
  locale: string | null | undefined
): locale is SupportedLocale {
  if (!locale) {
    return false;
  }
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}

export function normalizeLocale(
  locale: string | null | undefined
): SupportedLocale {
  if (isSupportedLocale(locale)) {
    return locale;
  }
  return FALLBACK_LOCALE;
}

export function parseLocaleCookie(
  value: string | null | undefined
): SupportedLocale | null {
  if (isSupportedLocale(value)) {
    return value;
  }
  return null;
}

export function getLocaleFromAcceptLanguage(
  header: string | null | undefined
): SupportedLocale | null {
  if (!header) {
    return null;
  }

  const candidates = header
    .split(",")
    .map((segment) => {
      const [langPart] = segment.trim().split(";");
      return langPart.toLowerCase();
    })
    .filter(Boolean);

  for (const candidate of candidates) {
    const [language] = candidate.split("-");
    if (isSupportedLocale(candidate as SupportedLocale)) {
      return candidate as SupportedLocale;
    }
    if (isSupportedLocale(language as SupportedLocale)) {
      return language as SupportedLocale;
    }
  }

  return null;
}

export function resolveRequestedLocale({
  cookie,
  acceptLanguage,
}: {
  cookie: string | null | undefined;
  acceptLanguage: string | null | undefined;
}): SupportedLocale {
  const cookieLocale = parseLocaleCookie(cookie);
  if (cookieLocale) {
    return cookieLocale;
  }

  const headerLocale = getLocaleFromAcceptLanguage(acceptLanguage);
  if (headerLocale) {
    return headerLocale;
  }

  return FALLBACK_LOCALE;
}

export function buildLocalizedPath(
  locale: SupportedLocale,
  path: string
): string {
  const cleanedPath = path.startsWith("/") ? path : `/${path}`;
  // Always prefix with locale, including the fallback locale, for consistency and SEO.
  const suffix = cleanedPath === "/" ? "" : cleanedPath;
  return `/${locale}${suffix}`.replace(/\/+/, "/");
}

export function stripLocalePrefix(urlPath: string): {
  locale: SupportedLocale;
  path: string;
} {
  const segments = urlPath.replace(/^\/+/, "").split("/");
  const maybeLocale = segments[0];
  if (isSupportedLocale(maybeLocale as SupportedLocale)) {
    const remainder = segments.slice(1).join("/");
    return {
      locale: maybeLocale as SupportedLocale,
      path: `/${remainder}`.replace(/\/+/, "/"),
    };
  }
  return {
    locale: FALLBACK_LOCALE,
    path: `/${segments.join("/")}`.replace(/\/+/, "/"),
  };
}
