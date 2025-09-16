import { groq } from "next-sanity";

export const BLOG_CATEGORIES_QUERY = groq`*[_type == "category" && defined(slug)] | order(orderRank){
  _id,
  title,
  slug
}`;

export const BLOG_CATEGORY_BY_SLUG_QUERY = groq`*[_type == "category" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  slug,
  description,
  "meta": {
    "title": coalesce(seo.title, title),
    "description": seo.metaDescription,
    "noindex": false,
    "image": seo.image{ asset->{ _id, url, mimeType, metadata{ lqip, dimensions{ width, height } } } }
  }
}`;

export const POSTS_BY_BLOG_CATEGORY_QUERY_NEWEST = groq`*[
  _type == "post" && references(*[_type == "category" && slug.current == $slug]._id)
] | order(_createdAt desc)[$offset...$end]{
  _id,
  _createdAt,
  title,
  slug,
  excerpt,
  author->{
    name,
    title,
    image{ asset->{ _id, url } }
  },
  categories[]->{ _id, title, slug },
}`;

export const POSTS_BY_BLOG_CATEGORY_QUERY_AZ = groq`*[
  _type == "post" && references(*[_type == "category" && slug.current == $slug]._id)
] | order(title asc)[$offset...$end]{
  _id,
  _createdAt,
  title,
  slug,
  excerpt,
  author->{
    name,
    title,
    image{ asset->{ _id, url } }
  },
  categories[]->{ _id, title, slug },
}`;

export const POSTS_BY_BLOG_CATEGORY_QUERY_ZA = groq`*[
  _type == "post" && references(*[_type == "category" && slug.current == $slug]._id)
] | order(title desc)[$offset...$end]{
  _id,
  _createdAt,
  title,
  slug,
  excerpt,
  author->{
    name,
    title,
    image{ asset->{ _id, url } }
  },
  categories[]->{ _id, title, slug },
}`;

export const POSTS_COUNT_BY_BLOG_CATEGORY_QUERY = groq`count(*[
  _type == "post" && references(*[_type == "category" && slug.current == $slug]._id)
])`;
