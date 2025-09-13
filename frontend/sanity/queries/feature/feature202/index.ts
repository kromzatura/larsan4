import { groq } from "next-sanity";
import { feature202CardQuery } from "./feature202-card";

// @sanity-typegen-ignore
export const feature202Query = groq`
  _type == "feature-202" => {
    _type,
    _key,
    padding,
    columns[]{
      ${feature202CardQuery},
    },
  }
`;
