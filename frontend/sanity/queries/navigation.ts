import { groq } from "next-sanity";

// Simplified explicit navigation query (no fragments) to satisfy typegen.
// If link groups are introduced later, either adjust schema or add a second query.
export const NAVIGATION_QUERY = groq`
  *[_type == "navigation" && language == $lang]{
    _id,
    _type,
    title,
    links[]{
      _key,
      _type,
      title,
      buttonVariant,
      target,
      isExternal,
      "href": select(isExternal == true => href),
      iconVariant,
      description,
      // Normalized internal link object (optional)
      "internal": select(defined(internalLink) => {
        "_type": internalLink->_type,
        "slug": internalLink->slug.current
      })
    }
  }
`;
