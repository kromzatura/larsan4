import { groq } from "next-sanity";
import { bodyQuery } from "./shared/body";

export const FEED_POSTS_QUERY_NEWEST = groq`*[_type == "post" && defined(slug)] | order(_createdAt desc)[0...$limit]{
  _id,
  _createdAt,
  title,
  slug,
  excerpt,
  body[]{
    ${bodyQuery}
  },
  categories[]->{ title }
}`;

export const FEED_POSTS_BY_CATEGORY_QUERY_NEWEST = groq`*[
  _type == "post" && references(*[_type == "category" && slug.current == $slug]._id)
] | order(_createdAt desc)[0...$limit]{
  _id,
  _createdAt,
  title,
  slug,
  excerpt,
  body[]{
    ${bodyQuery}
  },
  categories[]->{ title }
}`;
