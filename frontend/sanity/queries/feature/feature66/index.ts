import { groq } from "next-sanity";
import { feature66CardQuery } from "./feature66-card";

// @sanity-typegen-ignore
export const feature66Query = groq`
  _type == "feature-66" => {
    _type,
    _key,
    padding,
    columns[]{
      ${feature66CardQuery},
    },
  }
`;
