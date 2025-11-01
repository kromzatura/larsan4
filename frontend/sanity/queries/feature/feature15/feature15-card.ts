import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const feature15CardQuery = groq`
  _type == "feature-15-card" => {
    _type,
    _key,
    iconVariant,
    title,
    description,
  }
`;
