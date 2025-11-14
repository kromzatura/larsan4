import { groq } from "next-sanity";
import { linkQuery } from "./shared/link";

export const BANNER_QUERY = groq`
  *[
    _type == "banner" &&
    language == $lang
  ]
  | order(_updatedAt desc){
    _type,
    _key,
    title,
    description,
    link{
      ${linkQuery},
    }
  }
`;
