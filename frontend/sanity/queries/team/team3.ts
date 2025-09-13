import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const team3Query = groq`
  _type == "team-3" => {
    _type,
    _key,
    padding
  }
`;
