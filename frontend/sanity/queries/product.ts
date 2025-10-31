import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";
import { bodyQuery } from "./shared/body";
import { metaQuery } from "./shared/meta";
import { TRANSLATIONS_QUERY_FRAGMENT } from "../lib/queries/fragments";
import { sectionHeaderQuery } from "../queries/section-header";
import { faq1Query } from "../queries/faq/faq1";
import { faq5Query } from "../queries/faq/faq5";
import { faq8Query } from "../queries/faq/faq8";
import { faq9Query } from "../queries/faq/faq9";
import { faq14Query } from "../queries/faq/faq14";
import { feature1Query } from "../queries/feature/feature1";
import { feature3Query } from "../queries/feature/feature3";
import { feature12Query } from "../queries/feature/feature12";
import { feature15Query } from "../queries/feature/feature15";
import { feature66Query } from "../queries/feature/feature66";
import { feature117Query } from "../queries/feature/feature117";
import { feature157Query } from "../queries/feature/feature157";
import { feature202Query } from "../queries/feature/feature202";

const productCategoryFilter = `
  _type == "productCategory" &&
  slug.current == $slug &&
  language == $lang
`;

// @sanity-typegen-ignore
const productCategoryProjection = groq`
  _id,
  title,
  slug,
  language
`;

// @sanity-typegen-ignore
const productProjection = groq`
  _id,
  language,
  orderRank,
  _createdAt,
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
    certification
  },
  keyFeatures[],
  packagingOptions[]{
    ...
  },
  image{ ${imageQuery} },
  body[]{ ${bodyQuery} },
  excerpt,
  categories[]->{
    ${productCategoryProjection}
  },
  ${metaQuery}
`;

// @sanity-typegen-ignore
const productListProjection = groq`
  _id,
  language,
  orderRank,
  _createdAt,
  title,
  slug,
  specifications[]->{
    _id,
    sku,
    purity,
    productAttributes
  },
  keyFeatures[],
  excerpt,
  image{ ${imageQuery} },
  categories[]->{
    ${productCategoryProjection}
  }
`;

export const PRODUCT_QUERY = groq`
  *[
    _type == "product" &&
    slug.current == $slug &&
    language == $lang
  ]
  | order(_updatedAt desc)[0]{
    ${productProjection}
    ,
    ${TRANSLATIONS_QUERY_FRAGMENT}
  }
`;

export const PRODUCTS_QUERY = groq`
  *[
    _type == "product" &&
    defined(slug) &&
    language == $lang
  ]
  | order((language == $lang) desc, orderRank)[$offset...$end]{
    ${productListProjection}
  }
`;

export const PRODUCTS_SLUGS_QUERY = groq`
  *[
    _type == "product" &&
    defined(slug) &&
    language == $lang
  ]{
    slug,
    language,
  }
`;

export const PRODUCTS_COUNT_QUERY = groq`
  count(*[
    _type == "product" &&
    defined(slug) &&
    language == $lang
  ])
`;

export const PRODUCT_CATEGORIES_QUERY = groq`
  *[
    _type == "productCategory" &&
    defined(slug) &&
    language == $lang
  ]
  | order(orderRank){
    _id,
    title,
    slug,
    language,
  }
`;

export const PRODUCT_CATEGORY_BY_SLUG_QUERY = groq`
  *[
    _type == "productCategory" &&
    slug.current == $slug &&
    language == $lang
  ]
  | order(_updatedAt desc)[0]{
    _id,
    _type,
    language,
    title,
    slug,
    blocks[]{
      ${sectionHeaderQuery},
      ${feature1Query},
      ${feature3Query},
      ${feature12Query},
      ${feature15Query},
      ${feature66Query},
      ${feature117Query},
      ${feature157Query},
      ${feature202Query},
      ${faq1Query},
      ${faq5Query},
      ${faq8Query},
      ${faq9Query},
      ${faq14Query},
    },
    description,
    ${metaQuery},
    ${TRANSLATIONS_QUERY_FRAGMENT}
  }
`;

const productsByCategoryFilter = groq`
  _type == "product" &&
  defined(slug) &&
  language == $lang &&
  references(*[${productCategoryFilter}]._id)
`;

export const PRODUCTS_BY_CATEGORY_QUERY = groq`
  *[${productsByCategoryFilter}]
  | order((language == $lang) desc, orderRank)[$offset...$end]{
    ${productListProjection}
  }
`;

// Explicit variants to avoid brittle string replacement when ordering
export const PRODUCTS_BY_CATEGORY_QUERY_NEWEST = groq`
  *[${productsByCategoryFilter}]
  | order((language == $lang) desc, _createdAt desc)[$offset...$end]{
    ${productListProjection}
  }
`;

export const PRODUCTS_BY_CATEGORY_QUERY_AZ = groq`
  *[${productsByCategoryFilter}]
  | order((language == $lang) desc, title asc)[$offset...$end]{
    ${productListProjection}
  }
`;

export const PRODUCTS_BY_CATEGORY_QUERY_ZA = groq`
  *[${productsByCategoryFilter}]
  | order((language == $lang) desc, title desc)[$offset...$end]{
    ${productListProjection}
  }
`;

export const PRODUCTS_COUNT_BY_CATEGORY_QUERY = groq`
  count(*[${productsByCategoryFilter}])
`;
