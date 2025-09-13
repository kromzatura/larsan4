import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const team4Query = groq`
  _type == "team-4" => {
    _type,
    _key,
    padding
  }
`;
