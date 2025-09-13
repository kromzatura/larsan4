import { groq } from "next-sanity";
import { imageQuery } from "../shared/image";

// @sanity-typegen-ignore
export const timeline4Query = groq`
  _type == "timeline-4" => {
    _type,
    _key,
    padding,
    tag,
    title,
    description,
    columns[]{
      _key,
      title,
      description,
      iconVariant,
      image{
        ${imageQuery}
      },
    },
  }
`;
