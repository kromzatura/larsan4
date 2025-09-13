import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const allPosts13Query = groq`
  _type == "all-posts-13" => {
    _type,
    _key,
    padding
  }
`;
