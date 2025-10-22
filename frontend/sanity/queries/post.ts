import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";
import { bodyQuery } from "./shared/body";
import { metaQuery } from "./shared/meta";
import { TRANSLATIONS_QUERY_FRAGMENT } from "../lib/queries/fragments";

export const POST_QUERY = groq`
  *[
    _type == "post" &&
    slug.current == $slug &&
    language == $lang
  ]
  | order(_updatedAt desc)[0]{
    _id,
    language,
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
      title,
      image { ${imageQuery} }
    },
    publishedAt,
    _createdAt,
    _updatedAt,
    ${metaQuery},
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 ),
    ${TRANSLATIONS_QUERY_FRAGMENT},
  }
`;

export const POSTS_QUERY = groq`
  *[
    _type == "post" &&
    defined(slug) &&
    language == $lang
  ]
  | order((language == $lang) desc, coalesce(publishedAt, _createdAt) desc)[$offset...$end]{
    _id,
    language,
    _createdAt,
    title,
    slug,
    excerpt,
    author->{
      name,
      title,
      image { ${imageQuery} }
    },
    image{
      ${imageQuery}
    },
    categories[]->{
      _id,
      title,
      slug,
    },
  }
`;

export const POSTS_QUERY_AZ = groq`
  *[
    _type == "post" &&
    defined(slug) &&
    language == $lang
  ]
  | order((language == $lang) desc, title asc)[$offset...$end]{
    _id,
    language,
    _createdAt,
    title,
    slug,
    excerpt,
    author->{
      name,
      title,
      image { ${imageQuery} }
    },
    image{
      ${imageQuery}
    },
    categories[]->{
      _id,
      title,
      slug,
    },
  }
`;

export const POSTS_QUERY_ZA = groq`
  *[
    _type == "post" &&
    defined(slug) &&
    language == $lang
  ]
  | order((language == $lang) desc, title desc)[$offset...$end]{
    _id,
    language,
    _createdAt,
    title,
    slug,
    excerpt,
    author->{
      name,
      title,
      image { ${imageQuery} }
    },
    image{
      ${imageQuery}
    },
    categories[]->{
      _id,
      title,
      slug,
    },
  }
`;

export const POSTS_SLUGS_QUERY = groq`
  *[
    _type == "post" &&
    defined(slug) &&
    language == $lang
  ]{
    slug,
    language,
  }
`;

export const POSTS_COUNT_QUERY = groq`
  count(*[
    _type == "post" &&
    defined(slug) &&
    language == $lang
  ])
`;
