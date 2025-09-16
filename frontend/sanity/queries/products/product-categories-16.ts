import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const productCategories16Query = groq`
  _type == "product-categories-16" => {
    _type,
    _key,
    padding
  }
`;
