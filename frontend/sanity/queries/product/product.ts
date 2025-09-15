import { groq } from "next-sanity";

export const PRODUCT_QUERY = groq`
  *[_type == "product" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    slug,
    excerpt,
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
    keyFeatures,
    packagingOptions[]{
      _key,
      packagingType,
      sizeValue,
      sizeUnit,
      weightPerPallet,
      notes
    },
    image{
      ...,
      asset->{
        _id,
        url,
        mimeType,
        metadata {
          lqip,
          dimensions { width, height }
        }
      }
    },
    body[]{
      ...,
      markDefs[]{
        ...,
        _type == "link" => {
          _key,
          ...,
          "href": select(
            isExternal => href,
            @.internalLink->slug.current == "index" => "/",
            @.internalLink->_type == "post" => "/blog/" + @.internalLink->slug.current,
            @.internalLink->_type == "category" => "/blog/category/" + @.internalLink->slug.current,
            @.internalLink->_type == "product" => "/products/" + @.internalLink->slug.current,
            @.internalLink->_type == "productCategory" => "/products/category/" + @.internalLink->slug.current,
            "/" + @.internalLink->slug.current
          )
        }
      },
      _type == "image" => {
        ...,
        asset->{
          _id,
          url,
          mimeType,
          metadata {
            lqip,
            dimensions { width, height }
          }
        }
      }
    },
    categories[]-> { _id, title, slug },
    meta{
      title,
      description,
      noindex,
      image{ ..., asset->{ _id, url, mimeType, metadata { lqip, dimensions { width, height } } } }
    }
  }
`;

export const PRODUCTS_SLUGS_QUERY = groq`
  *[_type == "product" && defined(slug.current)]{ "slug": slug } | order(_createdAt desc)
`;
