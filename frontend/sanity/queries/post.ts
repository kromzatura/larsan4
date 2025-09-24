import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";
import { bodyQuery } from "./shared/body";
import { metaQuery } from "./shared/meta";

export const POST_QUERY = groq`*[_type == "post" && slug.current == $slug && language == coalesce($lang, "en")][0]{
  // @sanity-typegen-ignore: extra fields for i18n hreflang
  _id,
  language,
  title,
  slug,
  // Translations from the i18n metadata doc (includes current doc)
  "i18n": *[_type == "i18n.metadata" && references(^._id)][0].translations[]->{
    "language": language,
    "slug": slug.current
  },
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
    publishedAt,
    _createdAt,
    _updatedAt,
    ${metaQuery},
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 ),
}`;

export const POSTS_QUERY = groq`*[_type == "post" && defined(slug) && language == coalesce($lang, "en")] | order(coalesce(publishedAt, _createdAt) desc)[$offset...$end]{
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
      slug,
    },
}`;

export const POSTS_QUERY_AZ = groq`*[_type == "post" && defined(slug) && language == coalesce($lang, "en")] | order(title asc)[$offset...$end]{
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
      slug,
    },
}`;

export const POSTS_QUERY_ZA = groq`*[_type == "post" && defined(slug) && language == coalesce($lang, "en")] | order(title desc)[$offset...$end]{
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
      slug,
    },
}`;

export const POSTS_SLUGS_QUERY = groq`*[_type == "post" && defined(slug) && language == coalesce($lang, "en")] {slug}`;

export const POSTS_COUNT_QUERY = groq`count(*[_type == "post" && defined(slug) && language == coalesce($lang, "en")])`;
