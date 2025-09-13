import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";

// @sanity-typegen-ignore
export const pricing1Query = groq`
  _type == "pricing-1" => {
    _type,
    _key,
    padding,
    columns[]{
      _key,
      featured,
      title,
      description,
      price{
        value,
        note,
      },
      link{
        ${linkQuery},
      },
      listTitle,
      list,
    },
  }
`;
