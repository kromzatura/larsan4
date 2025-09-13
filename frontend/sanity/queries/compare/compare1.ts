import { groq } from "next-sanity";
import { imageQuery } from "../shared/image";

// @sanity-typegen-ignore
export const compare1Query = groq`
  _type == "compare-1" => {
    _type,
    _key,
    padding,
    images[]{
      ${imageQuery}
    },
    columns[]{
      _key,
      label,
      primary,
      secondary,
      hasIcon,
    },
  }
`;
