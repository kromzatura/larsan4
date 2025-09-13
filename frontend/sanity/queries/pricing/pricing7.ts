import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";

// @sanity-typegen-ignore
export const pricing7Query = groq`
  _type == "pricing-7" => {
    _type,
    _key,
    padding,
    badge,
    columns[]{
      _key,
      title,
      description,
      price{
        monthly,
        yearly,
      },
      link{
        ${linkQuery},
      },
      listTitle,
      list,
    },
  }
`;
