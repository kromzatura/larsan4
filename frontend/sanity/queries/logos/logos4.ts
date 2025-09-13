import { groq } from "next-sanity";
import { imageQuery } from "../shared/image";

// @sanity-typegen-ignore
export const logos4Query = groq`
  _type == "logos-4" => {
    _type,
    _key,
    padding,
    images[]{
      ${imageQuery}
    },
  }
`;
