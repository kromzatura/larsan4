import { groq } from "next-sanity";
import { linkQuery } from "../../shared/link";
import { imageQuery } from "../../shared/image";

// @sanity-typegen-ignore
export const feature157CardQuery = groq`
  _type == "feature-157-card" => {
    _type,
    _key,
    image{
      ${imageQuery}
    },
    link {
      ${linkQuery}
    }
  }
`;
