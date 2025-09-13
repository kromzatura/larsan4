import { groq } from "next-sanity";
import { imageQuery } from "../shared/image";

// @sanity-typegen-ignore
export const gallery9Query = groq`
  _type == "gallery-9" => {
    _type,
    _key,
    padding,
    columns[]{
      _key,
      image{
        ${imageQuery}
      },
      title,
      description,
      iconVariant,
    },
  }
`;
