import { groq } from "next-sanity";
import { imageQuery } from "../shared/image";

// @sanity-typegen-ignore
export const gallery10Query = groq`
  _type == "gallery-10" => {
    _type,
    _key,
    padding,
    title,
    description,
    testimonials[]->{
      ...,
      image{
        ${imageQuery}
      },
    }
  }
`;
