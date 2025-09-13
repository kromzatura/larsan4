import { groq } from "next-sanity";
import { imageQuery } from "../../shared/image";

// @sanity-typegen-ignore
export const feature3CardQuery = groq`
  _type == "feature-3-card" => {
    _type,
    _key,
    iconVariant,
    title,
    description,
    image{
      ${imageQuery}
    }
  }
`;
