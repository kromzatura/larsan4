import { groq } from "next-sanity";
import { linkQuery } from "../../shared/link";
import { imageQuery } from "../../shared/image";

// @sanity-typegen-ignore
export const feature66CardQuery = groq`
  _type == "feature-66-card" => {
    _type,
    _key,
    logo{
      ${imageQuery}
    },
    image{
      ${imageQuery}
    },
    link {
      ${linkQuery}
    }
  }
`;
