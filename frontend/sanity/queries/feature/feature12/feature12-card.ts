import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const feature12CardQuery = groq`
  _type == "feature-12-card" => {
    _type,
    _key,
    iconVariant,
    title,
    description,
  }
`;
