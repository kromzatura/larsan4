export type I18nTranslation = { language?: string; slug?: string };

// Builds a Next.js `alternates.languages` map from i18n translations.
// `baseSlug` is the route slug passed to metadata (e.g., 'index', 'about', 'blog/foo').
export function buildAlternatesLanguages(
  baseSlug: string,
  translations: I18nTranslation[] | undefined
): Record<string, string> | undefined {
  if (!Array.isArray(translations) || translations.length === 0)
    return undefined;
  return translations
    .filter((t) => t?.language && typeof t.slug === "string")
    .reduce<Record<string, string>>((acc, t) => {
      const lang = t.language as string;
      const s = (t.slug as string) === "index" ? "" : `/${t.slug}`;
      acc[lang] = `/${lang}${s}`;
      return acc;
    }, {});
}
