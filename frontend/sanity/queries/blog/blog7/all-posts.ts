import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const allPosts7Query = groq`
  _type == "all-posts-7" => {
    _type,
    _key,
    padding
  }
`;
