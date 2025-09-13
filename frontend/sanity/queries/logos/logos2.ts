import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";
import { imageQuery } from "../shared/image";

// @sanity-typegen-ignore
export const logos2Query = groq`
  _type == "logos-2" => {
    _type,
    _key,
    padding,
    title,
    description,
    links[]{
      ${linkQuery}
    },
    images[]{
      ${imageQuery}
    },
  }
`;
