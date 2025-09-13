import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";
import { bodyQuery } from "./shared/body";
import { metaQuery } from "./shared/meta";

export const POST_QUERY = groq`*[_type == "post" && slug.current == $slug][0]{
    title,
    slug,
    image{
      ${imageQuery}
    },
    body[]{
      ${bodyQuery}
    },
    author->{
      name,
      image {
        ${imageQuery}
      }
    },
    _createdAt,
    _updatedAt,
    ${metaQuery},
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 ),
}`;

export const POSTS_QUERY = groq`*[_type == "post" && defined(slug)] | order(_createdAt desc)[$offset...$end]{
    _id,
    _createdAt,
    title,
    slug,
    excerpt,
    author->{
      name,
      title,
      image {
        ${imageQuery}
      }
    },
    image{
      ${imageQuery}
    },
    categories[]->{
      _id,
      title,
    },
}`;

export const POSTS_SLUGS_QUERY = groq`*[_type == "post" && defined(slug)]{slug}`;

export const POSTS_COUNT_QUERY = groq`count(*[_type == "post"])`;
