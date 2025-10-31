import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";

export const SETTINGS_QUERY = groq`
  *[
    _type == "settings" &&
    (!defined(language) || language in [$lang, $fallbackLang])
  ]
  | order((language == $lang) desc, (language == $fallbackLang) desc, _updatedAt desc)[0]{
    _type,
    language,
    siteName,
    logo{
      ${imageQuery}
    },
    description,
    copyright,
    socialLinks
  }
`;
