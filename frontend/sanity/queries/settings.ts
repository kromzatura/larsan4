import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";

export const SETTINGS_QUERY = groq`*[_type == "settings" && language == coalesce($lang, "en")][0]{
  _type,
  siteName,
  logo{
    ${imageQuery}
  },
  description,
  copyright
}`;
