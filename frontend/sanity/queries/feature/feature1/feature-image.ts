import { groq } from "next-sanity";
import { imageQuery } from "../../shared/image";

// @sanity-typegen-ignore
export const featureImageQuery = groq`
  _type == "feature-image" => {
    _type,
    _key,
    image{
      ${imageQuery}
    },
  }
`;
