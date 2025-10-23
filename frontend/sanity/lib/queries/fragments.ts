import { groq } from "next-sanity";

/**
 * Fetches all published translations for a given document.
 * Requires the document's `_id` to be in context (e.g., `^._id`).
 */
export const TRANSLATIONS_QUERY_FRAGMENT = groq`
  "allTranslations": *[_type == "translation.metadata" && ^._id in translations[].value._ref][0].translations[] {
    "lang": _key,
    "slug": value->slug.current
  } [defined(slug) && defined(lang)]
`;
