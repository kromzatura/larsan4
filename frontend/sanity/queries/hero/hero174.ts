import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";
import { imageQuery } from "../shared/image";
import { bodyQuery } from "../shared/body";

// @sanity-typegen-ignore
export const hero174Query = groq`
  _type == "hero-174" => {
    _type,
    _key,
    backgroundImage{
      ${imageQuery}
    },
    title,
    body[]{
      ${bodyQuery}
    },
    links[]{
      ${linkQuery}
    },
    tag
  }
`;
