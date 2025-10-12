export const DEFAULT_LOCALE = "en" as const;

export const TARGET_LOCALES = ["en", "nl"] as const;

export type SupportedLocale = (typeof TARGET_LOCALES)[number];

export const SUPPORTED_LOCALES = TARGET_LOCALES;

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: "English",
  nl: "Dutch",
};

export const FALLBACK_LOCALE: SupportedLocale = DEFAULT_LOCALE;

export const LOCALE_FALLBACKS: Record<SupportedLocale, SupportedLocale> = {
  en: DEFAULT_LOCALE,
  nl: DEFAULT_LOCALE,
};

export const RTL_LOCALES = new Set<SupportedLocale>();

export const FORMAT_LOCALE_MAP: Record<SupportedLocale, string> = {
  en: "en-US",
  nl: "nl-NL",
};

export function getFallbackLocale(locale: SupportedLocale): SupportedLocale {
  return LOCALE_FALLBACKS[locale] ?? DEFAULT_LOCALE;
}
