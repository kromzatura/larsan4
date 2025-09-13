import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";
import { bodyQuery } from "../shared/body";

// @sanity-typegen-ignore
export const hero13Query = groq`
  _type == "hero-13" => {
    _type,
    _key,
    tag,
    title,
    body[]{
      ${bodyQuery}
    },
    links[]{
      ${linkQuery}
    },
  }
`;
