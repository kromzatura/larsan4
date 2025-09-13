import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const team5Query = groq`
  _type == "team-5" => {
    _type,
    _key,
    padding
  }
`;
