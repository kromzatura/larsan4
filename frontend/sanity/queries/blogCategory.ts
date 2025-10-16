import { groq } from "next-sanity";

export const BLOG_CATEGORIES_QUERY = groq`
  *[
    _type == "category" &&
    defined(slug) &&
    (language == $lang || (!defined(language) && $lang == $fallbackLang))
  ] | order(orderRank){
    _id,
    title,
    slug,
    language,
  }
`;

export const BLOG_CATEGORY_BY_SLUG_QUERY = groq`
  *[
    _type == "category" &&
    slug.current == $slug &&
    (language == $lang || (!defined(language) && $lang == $fallbackLang))
  ]
  | order((language == $lang) desc, _updatedAt desc)[0]{
    _id,
    _type,
    title,
    slug,
    description,
    language,
    "meta": {
      "title": coalesce(seo.title, title),
      "description": seo.metaDescription,
      "noindex": coalesce(seo.noindex, false),
      "image": seo.image{ asset->{ _id, url, mimeType, metadata{ lqip, dimensions{ width, height } } } }
    }
  }
`;

const postsByCategoryFilter = `_type == "post" && references(*[_type == "category" && slug.current == $slug]._id) && (language == $lang || (!defined(language) && $lang == $fallbackLang))`;

export const POSTS_BY_BLOG_CATEGORY_QUERY_NEWEST = groq`
  *[
    ${postsByCategoryFilter}
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
      image{ asset->{ _id, url } }
    },
    categories[]->{ _id, title, slug },
  }
`;

export const POSTS_BY_BLOG_CATEGORY_QUERY_AZ = groq`
  *[
    ${postsByCategoryFilter}
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
      image{ asset->{ _id, url } }
    },
    categories[]->{ _id, title, slug },
  }
`;

export const POSTS_BY_BLOG_CATEGORY_QUERY_ZA = groq`
  *[
    ${postsByCategoryFilter}
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
      image{ asset->{ _id, url } }
    },
    categories[]->{ _id, title, slug },
  }
`;

export const POSTS_COUNT_BY_BLOG_CATEGORY_QUERY = groq`
  count(*[
    ${postsByCategoryFilter}
  ])
`;
