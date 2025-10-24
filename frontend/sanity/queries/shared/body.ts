import { linkQuery } from "./link";
import { imageQuery } from "./image";

export const bodyQuery = `
  ...,
  markDefs[]{
    ...,
    _type == "link" => {
      ${linkQuery}
    }
  },
  _type == "image" => {
    ${imageQuery}
  },
  _type == "product-callout" => {
    _type,
    _key,
    variant,
    align,
    showImage,
    title,
    blurb,
    ctaLabel,
    product->{
      _id,
      title,
      slug,
      // Optional fields commonly displayed in product UI
      sku,
      excerpt,
      image{ ${imageQuery} },
      categories[]->{ _id, title, slug }
    }
  }
`;
