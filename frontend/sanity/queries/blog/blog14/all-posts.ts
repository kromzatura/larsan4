import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const allPosts14Query = groq`
  _type == "all-posts-14" => {
    _type,
    _key,
    padding
  }
`;
