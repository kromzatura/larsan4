import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const changelog2Query = groq`
  _type == "changelog-2" => {
    _type,
    _key,
    padding
  }
`;
