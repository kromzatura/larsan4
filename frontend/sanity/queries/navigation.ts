import { groq } from "next-sanity";

// Simplified explicit navigation query (no fragments) to satisfy typegen.
// If link groups are introduced later, either adjust schema or add a second query.
export const NAVIGATION_QUERY = groq`
  *[_type == "navigation" && language == $lang]
    | order(order asc, _updatedAt desc){
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
      iconVariant,
      description,
      // Normalized internal link object (optional)
      "internal": select(defined(internalLink) => {
        "_type": internalLink->_type,
        "slug": internalLink->slug.current
      }),
      // External href provided directly; for internal derive path if slug available.
      "href": select(
        isExternal == true => href,
        defined(internalLink->slug.current) => "/" + internalLink->slug.current
      ),
      // Explicit resolvedHref alias for future-proofing (can deprecate href later)
      "resolvedHref": select(
        isExternal == true => href,
        defined(internalLink->slug.current) => "/" + internalLink->slug.current
      )
    }
  }
`;
