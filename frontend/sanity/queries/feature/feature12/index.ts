import { groq } from "next-sanity";
import { feature12CardQuery } from "./feature12-card";

// @sanity-typegen-ignore
export const feature12Query = groq`
  _type == "feature-12" => {
    _type,
    _key,
    padding,
    tagline,
    columns[]{
      ${feature12CardQuery},
    },
  }
`;
