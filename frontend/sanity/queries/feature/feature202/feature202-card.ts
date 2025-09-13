import { groq } from "next-sanity";
import { linkQuery } from "../../shared/link";
import { imageQuery } from "../../shared/image";

// @sanity-typegen-ignore
export const feature202CardQuery = groq`
  _type == "feature-202-card" => {
    _type,
    _key,
    iconVariant,
    title,
    description,
    image{
      ${imageQuery}
    },
    link {
      ${linkQuery}
    }
  }
`;
