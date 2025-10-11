import { groq } from "next-sanity";

// Leaner navigation link fragment: expose internalType/internalSlug for runtime resolution
// Keep external href if explicitly set
// @sanity-typegen-ignore
export const navigationLinkQuery = groq`
  _key,
  _type,
  title,
  buttonVariant,
  target,
  isExternal,
  "href": select(isExternal => href, null),
  "internalType": internalLink->_type,
  "internalSlug": internalLink->slug.current,
  iconVariant,
  description
`;

export const NAVIGATION_QUERY = groq`
  *[
    _type == "navigation" &&
    (!defined(language) || language in [$lang, $fallbackLang])
  ]
  | order((language == $lang) desc, (language == $fallbackLang) desc, orderRank asc){
    _type,
    _key,
    title,
    language,
    links[]{
      ${navigationLinkQuery},
      _type == "link-group" => {
        links[]{
          ${navigationLinkQuery}
        }
      }
    }
  }
`;
