import { buildLocalizedPath } from "@/lib/i18n/routing";
import type { SupportedLocale } from "@/lib/i18n/config";

/**
 * Builds a full, absolute, and localized URL for sharing or SEO metadata.
 * Example: https://example.com/en/blog/my-post
 */
export function buildAbsoluteUrl(
  locale: SupportedLocale,
  path: string
): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const localizedPath = buildLocalizedPath(locale, path);
  return `${baseUrl}${localizedPath}`;
}
