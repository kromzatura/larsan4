import { groq } from "next-sanity";
import { feature117CardQuery } from "./feature117-card";

// @sanity-typegen-ignore
export const feature117Query = groq`
  _type == "feature-117" => {
    _type,
    _key,
    padding,
    columns[]{
      ${feature117CardQuery},
    },
  }
`;
