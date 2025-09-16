import { groq } from "next-sanity";
import { bodyQuery } from "./shared/body";
import { imageQuery } from "./shared/image";

export const FEED_POSTS_QUERY_NEWEST = groq`*[_type == "post" && defined(slug)] | order(coalesce(publishedAt, _createdAt) desc)[0...$limit]{
  _id,
  _createdAt,
  publishedAt,
  title,
  slug,
  excerpt,
  author->{ name },
  image{ ${imageQuery} },
  body[]{
    ${bodyQuery}
  },
  categories[]->{ title }
}`;

export const FEED_POSTS_BY_CATEGORY_QUERY_NEWEST = groq`*[
  _type == "post" && references(*[_type == "category" && slug.current == $slug]._id)
] | order(coalesce(publishedAt, _createdAt) desc)[0...$limit]{
  _id,
  _createdAt,
  publishedAt,
  title,
  slug,
  excerpt,
  author->{ name },
  image{ ${imageQuery} },
  body[]{
    ${bodyQuery}
  },
  categories[]->{ title }
}`;
