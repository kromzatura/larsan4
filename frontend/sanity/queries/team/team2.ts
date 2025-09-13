import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const team2Query = groq`
  _type == "team-2" => {
    _type,
    _key,
    padding
  }
`;
