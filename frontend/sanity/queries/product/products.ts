import { groq } from "next-sanity";

export const PRODUCTS_QUERY = groq`
  {
    "items": *[_type == "product"] | order(_createdAt desc)[$offset...$end]{
      _id,
      title,
      slug,
      excerpt,
      image,
      categories[]-> { _id, title, slug }
    }
  }
`;

export const PRODUCTS_COUNT_QUERY = groq`count(*[_type == "product"])`;
