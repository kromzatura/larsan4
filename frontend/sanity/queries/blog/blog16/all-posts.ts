import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const allPosts16Query = groq`
  _type == "all-posts-16" => {
    _type,
    _key,
    padding
  }
`;
