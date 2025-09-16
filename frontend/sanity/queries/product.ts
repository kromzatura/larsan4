import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";
import { bodyQuery } from "./shared/body";
import { metaQuery } from "./shared/meta";

export const PRODUCT_QUERY = groq`*[_type == "product" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  specifications[]->{
    _id,
    name,
    sku,
    bestFor,
    pungency,
    bindingCapacity,
    fatContent,
    purity,
    moisture,
    hsCode,
    minOrder,
    origin,
    botanicalName,
    shelfLife,
    allergenInfo,
    productAttributes,
    certification,
  },
  keyFeatures[],
  packagingOptions[]{
    ...,
  },
  image{ ${imageQuery} },
  body[]{ ${bodyQuery} },
  excerpt,
  categories[]->{ _id, title, slug },
  ${metaQuery}
}`;

export const PRODUCTS_QUERY = groq`*[_type == "product" && defined(slug)] | order(_createdAt desc)[$offset...$end]{
  _id,
  _createdAt,
  title,
  slug,
  specifications[]->{
    _id,
    sku,
    purity,
    productAttributes,
  },
  keyFeatures[],
  excerpt,
  image{ ${imageQuery} },
  categories[]->{ _id, title, slug }
}`;

export const PRODUCTS_SLUGS_QUERY = groq`*[_type == "product" && defined(slug)]{ slug }`;

export const PRODUCTS_COUNT_QUERY = groq`count(*[_type == "product" && defined(slug)])`;

export const PRODUCT_CATEGORIES_QUERY = groq`*[_type == "productCategory" && defined(slug)] | order(orderRank){
  _id,
  title,
  slug
}`;

export const PRODUCT_CATEGORY_BY_SLUG_QUERY = groq`*[_type == "productCategory" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  slug,
  description,
  ${metaQuery}
}`;

export const PRODUCTS_BY_CATEGORY_QUERY = groq`*[_type == "product" && references(*[_type == "productCategory" && slug.current == $slug]._id)] | order(_createdAt desc)[$offset...$end]{
  _id,
  _createdAt,
  title,
  slug,
  specifications[]->{
    _id,
    sku,
    purity,
    productAttributes,
  },
  keyFeatures[],
  excerpt,
  image{ ${imageQuery} },
  categories[]->{ _id, title, slug }
}`;

// Explicit variants to avoid brittle string replacement when ordering
export const PRODUCTS_BY_CATEGORY_QUERY_NEWEST = groq`*[_type == "product" && references(*[_type == "productCategory" && slug.current == $slug]._id)] | order(_createdAt desc)[$offset...$end]{
  _id,
  _createdAt,
  title,
  slug,
  specifications[]->{
    _id,
    sku,
    purity,
    productAttributes,
  },
  keyFeatures[],
  excerpt,
  image{ ${imageQuery} },
  categories[]->{ _id, title, slug }
}`;

export const PRODUCTS_BY_CATEGORY_QUERY_AZ = groq`*[_type == "product" && references(*[_type == "productCategory" && slug.current == $slug]._id)] | order(title asc)[$offset...$end]{
  _id,
  _createdAt,
  title,
  slug,
  specifications[]->{
    _id,
    sku,
    purity,
    productAttributes,
  },
  keyFeatures[],
  excerpt,
  image{ ${imageQuery} },
  categories[]->{ _id, title, slug }
}`;

export const PRODUCTS_BY_CATEGORY_QUERY_ZA = groq`*[_type == "product" && references(*[_type == "productCategory" && slug.current == $slug]._id)] | order(title desc)[$offset...$end]{
  _id,
  _createdAt,
  title,
  slug,
  specifications[]->{
    _id,
    sku,
    purity,
    productAttributes,
  },
  keyFeatures[],
  excerpt,
  image{ ${imageQuery} },
  categories[]->{ _id, title, slug }
}`;

export const PRODUCTS_COUNT_BY_CATEGORY_QUERY = groq`count(*[_type == "product" && references(*[_type == "productCategory" && slug.current == $slug]._id)])`;
