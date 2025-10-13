import { groq } from "next-sanity";
import { linkQuery } from "./shared/link";
import { metaQuery } from "./shared/meta";

export const CONTACT_QUERY = groq`
  *[
    _type == "contact" &&
    (!defined(language) || language in [$lang, $fallbackLang])
  ]
  | order(
    (language == $lang) desc,
    (language == $fallbackLang) desc,
    _updatedAt desc
  )[0]{
    tagline,
    title,
    description,
    contactMethods[]{
      icon,
      title,
      description,
      link {
        ${linkQuery}
      }
    },
    ${metaQuery},
  }
`;
