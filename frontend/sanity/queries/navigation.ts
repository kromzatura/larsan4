import { groq } from "next-sanity";
import { linkQuery } from "./shared/link";

export const NAVIGATION_QUERY = groq`
  *[_type == "navigation"]{
    _type,
    _key,
    title,
    links[]{
      ${linkQuery},
      _type == "link-group" => {
        links[]{
          ${linkQuery}
        }
      }
    }
  }
`;
