import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";

// @sanity-typegen-ignore
export const bannerBlockQuery = groq`
  _type == "banner-block" => {
    _type,
    _key,
    padding,
    title,
    description[]{
      ...,
      markDefs[]{
        ...,
        _type == "link" => {
          ${linkQuery}
        }
      }
    },
    link{ ${linkQuery} },
  }
`;
