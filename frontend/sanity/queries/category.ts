import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";

export const CATEGORY_QUERY = groq`*[_type == "category" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  description,
  color,
  seo
}`;

export const CATEGORIES_SLUGS_QUERY = groq`*[_type == "category" && defined(slug)]{slug}`;

export const POSTS_BY_CATEGORY_QUERY = groq`*[_type == "post" && defined(slug) && references(*[_type == "category" && slug.current == $slug]._id)] | order(_createdAt desc)[$offset...$end]{
  _id,
  _createdAt,
  title,
  slug,
  excerpt,
  author->{
    name,
    title,
    image{ ${imageQuery} }
  },
  image{ ${imageQuery} },
  categories[]->{ _id, title }
}`;

export const POSTS_BY_CATEGORY_COUNT_QUERY = groq`count(*[_type == "post" && references(*[_type == "category" && slug.current == $slug]._id)])`;
