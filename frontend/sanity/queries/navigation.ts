import { groq } from "next-sanity";

// Leaner navigation link fragment: expose internalType/internalSlug for runtime resolution
// Keep external href if explicitly set
export const navigationLinkQuery = groq`
  _key,
  _type,
  title,
  buttonVariant,
  target,
  isExternal,
  // External href only retained if isExternal
  "href": select(isExternal => href),
  "internalType": internalLink->_type,
  "internalSlug": internalLink->slug.current,
  iconVariant,
  description
`;

export const NAVIGATION_QUERY = groq`
  *[_type == "navigation" && language == coalesce($lang, "en")]|order(orderRank){
    _type,
    _key,
    key,
    title,
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
