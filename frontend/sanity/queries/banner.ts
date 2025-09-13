import { groq } from "next-sanity";
import { linkQuery } from "./shared/link";

export const BANNER_QUERY = groq`
  *[_type == "banner"]{
    _type,
    _key,
    title,
    description,
    link{
      ${linkQuery},
    }
  }
`;
