import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const allPosts4Query = groq`
  _type == "all-posts-4" => {
    _type,
    _key,
    padding
  }
`;
