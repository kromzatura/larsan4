import { groq } from "next-sanity";
import { imageQuery } from "../shared/image";

// @sanity-typegen-ignore
export const logos9Query = groq`
  _type == "logos-9" => {
    _type,
    _key,
    padding,
    title,
    images[]{
      ${imageQuery}
    },
    testimonials[]->{
      ...,
      image{
        ${imageQuery}
      },
    }
  }
`;
