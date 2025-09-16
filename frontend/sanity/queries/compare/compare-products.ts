import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const compareProductsQuery = groq`
  _type == "compare-products" => {
    _type,
    _key,
    padding,
    title,
    productFields,
    columns[]{
      _key,
      name,
      product->{
        _id,
        title,
        "slug": slug.current,
        // First specification projected under 'spec'
        "spec": specifications[0]->{
          sku,
          bestFor,
          pungency,
          bindingCapacity,
          fatContent
        }
      },
      overrides{
        name,
        sku,
        bestFor,
        pungency,
        bindingCapacity,
        fatContent
      },
    },
  }
`;
