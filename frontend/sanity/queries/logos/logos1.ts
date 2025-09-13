import { groq } from "next-sanity";
import { imageQuery } from "../shared/image";

// @sanity-typegen-ignore
export const logos1Query = groq`
  _type == "logos-1" => {
    _type,
    _key,
    padding,
    title,
    images[]{
      ${imageQuery}
    },
  }
`;
