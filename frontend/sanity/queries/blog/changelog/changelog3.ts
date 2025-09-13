import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const changelog3Query = groq`
  _type == "changelog-3" => {
    _type,
    _key,
    padding
  }
`;
