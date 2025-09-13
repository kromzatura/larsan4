import { groq } from "next-sanity";
import { imageQuery } from "../shared/image";

// @sanity-typegen-ignore
export const compare2Query = groq`
  _type == "compare-2" => {
    _type,
    _key,
    padding,
    columns[]{
      _key,
      featured,
      image{
        ${imageQuery}
      },
      title,
      list,
    },
  }
`;
