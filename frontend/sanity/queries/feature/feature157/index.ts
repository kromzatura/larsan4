import { groq } from "next-sanity";
import { feature157CardQuery } from "./feature157-card";

// @sanity-typegen-ignore
export const feature157Query = groq`
  _type == "feature-157" => {
    _type,
    _key,
    padding,
    columns[]{
      ${feature157CardQuery},
    },
  }
`;
