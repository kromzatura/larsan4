import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";
import { imageQuery } from "../shared/image";
import { bodyQuery } from "../shared/body";

// @sanity-typegen-ignore
export const hero12Query = groq`
  _type == "hero-12" => {
    _type,
    _key,
    backgroundImage{
      ${imageQuery}
    },
    tagLine,
    title,
    body[]{
      ${bodyQuery}
    },
    image{
      ${imageQuery}
    },
    links[]{
      ${linkQuery}
    },
    techLogos[]{
      _key,
      title,
      link,
      image{
        ${imageQuery}
      }
    }
  }
`;
