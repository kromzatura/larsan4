import { groq } from "next-sanity";

export const PRODUCTS_BY_CATEGORY_QUERY = groq`
  {
    "category": *[_type == "productCategory" && slug.current == $slug][0]{ _id, title, slug },
    "items": *[_type == "product" && references(*[_type=='productCategory' && slug.current==$slug][0]._id)] | order(_createdAt desc)[$offset...$end]{
      _id,
      title,
      slug,
      excerpt,
      image,
      categories[]-> { _id, title, slug }
    },
    "total": count(*[_type == "product" && references(*[_type=='productCategory' && slug.current==$slug][0]._id)])
  }
`;
