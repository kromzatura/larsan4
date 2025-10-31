import { groq } from "next-sanity";
import { linkQuery } from "../../shared/link";

// @sanity-typegen-ignore
export const feature15CardQuery = groq`
  _type == "feature-15-card" => {
    _type,
    _key,
    iconVariant,
    title,
    description,
    richDescription[]{
      ...,
      markDefs[]{
        ...,
        _type == "link" => {
          ${linkQuery}
        }
      }
    },
  }
`;
