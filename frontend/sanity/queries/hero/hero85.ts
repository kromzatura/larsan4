import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";
import { imageQuery } from "../shared/image";
import { bodyQuery } from "../shared/body";

// @sanity-typegen-ignore
export const hero85Query = groq`
  _type == "hero-85" => {
    _type,
    _key,
    tag{
      title,
      description
    },
    title,
    body[]{
      ${bodyQuery}
    },
    images[]{
      ${imageQuery}
    },
    links[]{
      ${linkQuery}
    },
  }
`;
