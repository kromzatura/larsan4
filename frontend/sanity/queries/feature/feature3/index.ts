import { groq } from "next-sanity";
import { feature3CardQuery } from "./feature3-card";

// @sanity-typegen-ignore
export const feature3Query = groq`
  _type == "feature-3" => {
    _type,
    _key,
    padding,
    columns[]{
      ${feature3CardQuery},
    },
  }
`;
