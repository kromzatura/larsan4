import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";

export const SETTINGS_QUERY = groq`*[_type == "settings"][0]{
  _type,
  siteName,
  logo{
    ${imageQuery}
  },
  description,
  copyright
}`;
