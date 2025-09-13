import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";

// @sanity-typegen-ignore
export const pricing2Query = groq`
  _type == "pricing-2" => {
    _type,
    _key,
    padding,
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
