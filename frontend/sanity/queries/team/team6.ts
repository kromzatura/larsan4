import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const team6Query = groq`
  _type == "team-6" => {
    _type,
    _key,
    padding
  }
`;
