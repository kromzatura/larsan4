import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const compareProductsQuery = groq`
  _type == "compare-products" => {
    _type,
    _key,
    padding,
    title,
    mode,
    productFields,
    rows,
    columns[]{
      _key,
      name,
      product->{
        _id,
        title,
        specifications[]->{
          sku,
          bestFor,
          pungency,
          bindingCapacity,
          fatContent
        }[0]
      },
      overrides{
        name,
        sku,
        bestFor,
        pungency,
        bindingCapacity,
        fatContent
      },
      attributes[]{
        _key,
        value,
        status,
      },
    },
  }
`;
