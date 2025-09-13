import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";

// @sanity-typegen-ignore
export const pricing16Query = groq`
  _type == "pricing-16" => {
    _type,
    _key,
    padding,
    title,
    tag,
    columns[]{
      _key,
      featured,
      title,
      description,
      price{
        value,
        discount,
      },
      link{
        ${linkQuery},
      },
      listTitle,
      list,
    },
  }
`;
