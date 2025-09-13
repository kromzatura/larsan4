import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const team1Query = groq`
  _type == "team-1" => {
    _type,
    _key,
    padding
  }
`;
