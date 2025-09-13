import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const changelog1Query = groq`
  _type == "changelog-1" => {
    _type,
    _key,
    padding
  }
`;
