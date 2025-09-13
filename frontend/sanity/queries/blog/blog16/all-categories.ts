import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const allCategories16Query = groq`
  _type == "all-categories-16" => {
    _type,
    _key,
    padding,
  }
`;
