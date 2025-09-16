import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const allProducts16Query = groq`
  _type == "all-products-16" => {
    _type,
    _key,
    padding
  }
`;
