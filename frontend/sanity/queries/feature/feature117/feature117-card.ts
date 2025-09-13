import { groq } from "next-sanity";
import { linkQuery } from "../../shared/link";
import { imageQuery } from "../../shared/image";

// @sanity-typegen-ignore
export const feature117CardQuery = groq`
  _type == "feature-117-card" => {
    _type,
    _key,
    tag,
    title,
    image{
      ${imageQuery}
    },
    link {
      ${linkQuery}
    }
  }
`;
