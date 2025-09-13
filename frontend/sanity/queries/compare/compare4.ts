import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";
import { bodyQuery } from "../shared/body";

// @sanity-typegen-ignore
export const compare4Query = groq`
  _type == "compare-4" => {
    _type,
    _key,
    padding,
    title,
    titles,
    columns[]{
      _key,
      title,
      primary,
      secondary
    },
    body[]{
      ${bodyQuery}
    },
    links[]{
      ${linkQuery}
    },
  }
`;
