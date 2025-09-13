import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";
import { imageQuery } from "../shared/image";
import { bodyQuery } from "../shared/body";

// @sanity-typegen-ignore
export const hero160Query = groq`
  _type == "hero-160" => {
    _type,
    _key,
    backgroundImage{
      ${imageQuery}
    },
    tag,
    title,
    body[]{
      ${bodyQuery}
    },
    links[]{
      ${linkQuery}
    },
    image{
      ${imageQuery}
    },
  }
`;
