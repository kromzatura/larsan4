import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";

// @sanity-typegen-ignore
export const hero57Query = groq`
  _type == "hero-57" => {
    _type,
    _key,
    title,
    body,
    links[]{
      ${linkQuery}
    },
    tags
  }
`;
