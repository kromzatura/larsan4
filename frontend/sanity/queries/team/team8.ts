import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const team8Query = groq`
  _type == "team-8" => {
    _type,
    _key,
    padding
  }
`;
