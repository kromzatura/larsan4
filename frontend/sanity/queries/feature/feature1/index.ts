import { groq } from "next-sanity";
import { featureContentQuery } from "./feature-content";
import { featureImageQuery } from "./feature-image";

// @sanity-typegen-ignore
export const feature1Query = groq`
  _type == "feature-1" => {
    _type,
    _key,
    padding,
    columns[]{
      ${featureContentQuery},
      ${featureImageQuery},
    },
  }
`;
