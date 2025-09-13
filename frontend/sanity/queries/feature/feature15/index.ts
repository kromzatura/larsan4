import { groq } from "next-sanity";
import { feature15CardQuery } from "./feature15-card";

// @sanity-typegen-ignore
export const feature15Query = groq`
  _type == "feature-15" => {
    _type,
    _key,
    padding,
    gridColumns,
    columns[]{
      ${feature15CardQuery},
    },
  }
`;
